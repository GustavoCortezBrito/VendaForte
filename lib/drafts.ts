/**
 * Rascunhos de posts do blog (só no servidor).
 *
 * Um rascunho é uma linha da tabela `posts` do Supabase com `published = false`: o admin
 * cria, edita, visualiza e publica pelo painel. Os textos entregues em arquivo ficam em
 * `content/rascunhos/*.md` (fora de `content/blog`, que o blog público usa como reserva e
 * mostraria o rascunho no site) até alguém importá-los pelo painel.
 *
 * Campos próprios do arquivo de rascunho: `publicacao_prevista` (AAAA-MM-DD) e `pendencias`.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { enhanceHtml, renderBody } from '@/lib/blog-data'
import type { Heading } from '@/lib/blog-format'
import forklifts from '@/lib/data/electric-forklifts.json'
import { supabaseAdmin } from '@/lib/supabase'

const draftsDirectory = path.join(process.cwd(), 'content/rascunhos')
const publishedDirectory = path.join(process.cwd(), 'content/blog')
const publicDirectory = path.join(process.cwd(), 'public')

const DB_TIMEOUT_MS = 5000
const productSlugs = new Set((forklifts as { slug: string }[]).map((p) => p.slug))

const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

export interface DraftCheck {
  level: 'ok' | 'aviso' | 'erro'
  text: string
}

export interface DraftSummary {
  slug: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  author: string
  words: number
  readingTime: string
  /** `banco`: já está no painel; `arquivo`: texto pronto em content/rascunhos, ainda sem importar. */
  source: 'banco' | 'arquivo'
  published: boolean
  /** Última alteração (só para posts do banco). */
  updatedAt?: string
  /** Dia em que foi ao ar, se já foi publicado (só para posts do banco). */
  publishedAt?: string
  /** Dia previsto para ir ao ar (`AAAA-MM-DD`), só nos arquivos. */
  plannedDate?: string
  /** O que falta antes de publicar, só nos arquivos. */
  pending: string[]
  checks: DraftCheck[]
}

export interface Draft extends DraftSummary {
  html: string
  headings: Heading[]
}

interface PostRow {
  slug: string
  title: string | null
  description: string | null
  content: string | null
  image: string | null
  category: string | null
  tags: string[] | null
  author: string | null
  published: boolean | null
  updated_at?: string | null
  published_at?: string | null
}

/** Só letras minúsculas, números e hífen: o nome vira um caminho de arquivo. */
export const isDraftSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)

const fileExists = (dir: string, file: string) => fs.existsSync(path.join(dir, file))

// ---------- banco ----------

/** Roda uma consulta com tempo-limite; `ok: false` quando o banco não respondeu. */
async function query<T>(
  run: (signal: AbortSignal) => PromiseLike<{ data: T | null; error: unknown }>
): Promise<{ ok: boolean; data: T | null }> {
  if (!supabaseConfigured) return { ok: false, data: null }
  try {
    const { data, error } = await run(AbortSignal.timeout(DB_TIMEOUT_MS))
    if (error) throw error
    return { ok: true, data }
  } catch {
    return { ok: false, data: null }
  }
}

/** Todos os endereços que existem no banco, com o estado de cada um (publicado ou não). */
async function knownPosts(): Promise<Map<string, boolean> | null> {
  const { ok, data } = await query<{ slug: string; published: boolean | null }[]>((signal) =>
    supabaseAdmin.from('posts').select('slug,published').abortSignal(signal)
  )
  if (!ok || !data) return null
  return new Map(data.map((row) => [row.slug, row.published !== false]))
}

// ---------- conferência ----------

function plainText(content: string): string {
  if (content.trim().startsWith('<')) return content.replace(/<[^>]+>/g, ' ')
  return content.replace(/[#>*_`|\\]/g, ' ').replace(/-{2,}/g, ' ')
}

const countWords = (content: string) => plainText(content).trim().split(/\s+/).filter(Boolean).length

interface CheckInput {
  slug: string
  title: string
  description: string
  image: string
  category: string
  content: string
  words: number
  source: 'banco' | 'arquivo'
}

/** Confere o que dá para conferir sem abrir o navegador: campos, capa, imagens e links internos. */
function runChecks(input: CheckInput, known: Map<string, boolean> | null): DraftCheck[] {
  const { slug, title, description, image, category, content, words, source } = input
  const checks: DraftCheck[] = []
  const add = (level: DraftCheck['level'], text: string) => checks.push({ level, text })

  const missing = [
    !title.trim() && 'título',
    !description.trim() && 'descrição',
    !content.trim() && 'texto',
    !category.trim() && 'categoria',
    !image.trim() && 'capa',
  ].filter(Boolean)
  if (missing.length) add('erro', `Faltam campos: ${missing.join(', ')}.`)

  if (source === 'arquivo') {
    if (known?.has(slug)) add('aviso', `O endereço /blog/${slug} já existe no painel: importar não vai sobrescrevê-lo.`)
    else if (fileExists(publishedDirectory, `${slug}.md`)) add('erro', `Já existe um post publicado com o endereço /blog/${slug}.`)
    else add('ok', `Endereço livre: /blog/${slug}`)
  } else {
    add('ok', `Endereço do post: /blog/${slug}`)
  }

  if (title.length > 70) add('aviso', `O título tem ${title.length} caracteres; acima de uns 60, o Google corta no resultado da busca.`)

  if (description.length > 160) add('aviso', `A descrição tem ${description.length} caracteres; o Google mostra em torno de 160.`)
  else if (description && description.length < 70) add('aviso', `A descrição tem só ${description.length} caracteres; de 70 a 160 funciona melhor.`)
  else if (description) add('ok', `Descrição com ${description.length} caracteres.`)

  if (image.startsWith('/') && !fileExists(publicDirectory, image.slice(1))) add('erro', `A capa ${image} não existe na pasta public.`)

  const brokenImages = new Set<string>()
  for (const match of content.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)|<img[^>]*\ssrc="(\/[^"]+)"/g)) {
    const src = match[1] ?? match[2]
    if (!fileExists(publicDirectory, src.slice(1))) brokenImages.add(src)
  }
  if (brokenImages.size) add('erro', `Imagens que não existem em public: ${[...brokenImages].join(', ')}.`)

  const links = new Set<string>()
  for (const match of content.matchAll(/(?<!!)\[[^\]]*\]\((\/[^)\s#]+)(?:#[^)\s]*)?\)|<a[^>]*\shref="(\/[^"#]+)/g)) links.add(match[1] ?? match[2])

  const toDrafts: string[] = []
  const unknownPosts: string[] = []
  const brokenProducts: string[] = []
  for (const link of links) {
    if (link.startsWith('/blog/')) {
      const target = link.slice('/blog/'.length)
      const inDb = known?.get(target)
      if (inDb === true || fileExists(publishedDirectory, `${target}.md`)) continue
      if (inDb === false || fileExists(draftsDirectory, `${target}.md`)) toDrafts.push(link)
      else unknownPosts.push(link)
    } else if (link.startsWith('/produtos/')) {
      if (!productSlugs.has(link.slice('/produtos/'.length))) brokenProducts.push(link)
    }
  }
  if (brokenProducts.length) add('erro', `Links para fichas que não existem no catálogo: ${brokenProducts.join(', ')}.`)
  if (toDrafts.length) add('aviso', `Links para outros rascunhos (ficam quebrados até eles irem ao ar): ${toDrafts.join(', ')}.`)
  if (unknownPosts.length) add('aviso', `Links para posts que não aparecem no blog: ${unknownPosts.join(', ')}. Confira se estão no ar.`)
  if (!brokenProducts.length && !toDrafts.length && !unknownPosts.length) add('ok', `${links.size} links internos, todos apontam para páginas que existem.`)

  if (words < 500) add('aviso', `O texto tem ${words} palavras; guias com menos de uns 500 costumam ficar rasos.`)
  else add('ok', `${words} palavras.`)

  return checks
}

const readingTimeOf = (words: number) => `${Math.max(1, Math.ceil(words / 200))} min de leitura`

// ---------- montagem ----------

function fromRow(row: PostRow, known: Map<string, boolean> | null): DraftSummary & { content: string } {
  const content = row.content ?? ''
  const words = countWords(content)
  const base = {
    slug: row.slug,
    title: row.title ?? '',
    description: row.description ?? '',
    image: row.image ?? '',
    category: row.category ?? '',
    content,
    words,
  }
  return {
    ...base,
    tags: row.tags ?? [],
    author: row.author || 'Equipe Venda Forte',
    readingTime: readingTimeOf(words),
    source: 'banco',
    published: row.published !== false,
    updatedAt: row.updated_at ?? undefined,
    publishedAt: row.published_at ?? undefined,
    pending: [],
    checks: runChecks({ ...base, source: 'banco' }, known),
  }
}

interface FileDraft {
  summary: DraftSummary
  /** Markdown do arquivo, sem o cabeçalho. */
  content: string
}

function parseFile(slug: string, known: Map<string, boolean> | null): FileDraft | null {
  if (!isDraftSlug(slug)) return null
  const file = path.join(draftsDirectory, `${slug}.md`)
  if (!fs.existsSync(file)) return null

  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const words = countWords(content)
  const base = {
    slug,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    image: String(data.image ?? ''),
    category: String(data.category ?? ''),
    words,
  }
  return {
    content,
    summary: {
      ...base,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      author: String(data.author ?? 'Equipe Venda Forte'),
      readingTime: readingTimeOf(words),
      source: 'arquivo',
      published: false,
      plannedDate: data.publicacao_prevista ? String(data.publicacao_prevista) : undefined,
      pending: Array.isArray(data.pendencias) ? data.pendencias.map(String) : [],
      checks: runChecks({ ...base, content, source: 'arquivo' }, known),
    },
  }
}

function fileSlugs(): string[] {
  if (!fs.existsSync(draftsDirectory)) return []
  return fs
    .readdirSync(draftsDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
}

export interface DraftOverview {
  /** Rascunhos que já estão no painel (banco). */
  drafts: DraftSummary[]
  /** Textos prontos em arquivo, ainda sem importar. */
  files: DraftSummary[]
  /** `false` quando o banco não respondeu. */
  databaseOk: boolean
}

/** Tudo o que a tela de rascunhos mostra. */
export async function getDraftOverview(): Promise<DraftOverview> {
  const known = await knownPosts()
  const { ok, data } = await query<PostRow[]>((signal) =>
    supabaseAdmin
      .from('posts')
      .select('slug,title,description,content,image,category,tags,author,published,updated_at')
      .eq('published', false)
      .order('updated_at', { ascending: false })
      .abortSignal(signal)
  )

  const drafts = (data ?? []).map((row) => {
    const { content, ...summary } = fromRow(row, known)
    void content
    return summary
  })

  const files = fileSlugs()
    .filter((slug) => !known?.has(slug))
    .map((slug) => parseFile(slug, known)?.summary)
    .filter((draft): draft is DraftSummary => Boolean(draft))
    .sort((a, b) => `${a.plannedDate ?? ''}|${a.slug}`.localeCompare(`${b.plannedDate ?? ''}|${b.slug}`))

  return { drafts, files, databaseOk: ok }
}

/** Um post para visualizar: do banco (publicado ou não) ou, se ainda não foi importado, do arquivo. */
export async function getPostPreview(slug: string): Promise<Draft | null> {
  if (!isDraftSlug(slug)) return null
  const known = await knownPosts()

  const { data } = await query<PostRow>((signal) =>
    supabaseAdmin.from('posts').select('*').eq('slug', slug).abortSignal(signal).maybeSingle()
  )

  if (data) {
    const { content, ...summary } = fromRow(data, known)
    const { html, headings } = enhanceHtml(await renderBody(content))
    return { ...summary, html, headings }
  }

  const file = parseFile(slug, known)
  if (!file) return null
  const { html, headings } = enhanceHtml(await renderBody(file.content))
  return { ...file.summary, html, headings }
}

/** Posts novos para a tabela, vindos dos arquivos de rascunho que ainda não estão no banco (todos, ou só `onlySlug`). */
export async function getFilesToImport(onlySlug?: string): Promise<
  { slug: string; title: string; description: string; content: string; image: string; category: string; tags: string[]; author: string; reading_time: string }[] | null
> {
  const known = await knownPosts()
  // Sem saber o que já existe no banco, importar poderia duplicar: melhor não fazer nada
  if (!known) return null
  const rows = []
  for (const slug of fileSlugs()) {
    if (onlySlug && slug !== onlySlug) continue
    if (known.has(slug)) continue
    const parsed = parseFile(slug, known)
    if (!parsed) continue
    const { summary } = parsed
    rows.push({
      slug,
      title: summary.title,
      description: summary.description,
      // Guardado como HTML: é o formato do editor do painel, que assim consegue abrir e editar o texto
      content: await renderBody(parsed.content),
      image: summary.image || '/sede.png',
      category: summary.category || 'Geral',
      tags: summary.tags,
      author: summary.author,
      reading_time: summary.readingTime,
    })
  }
  return rows
}
