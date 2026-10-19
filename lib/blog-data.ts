/**
 * Leitura de posts para as páginas públicas do blog (só no servidor).
 *
 * Fonte principal: tabela `posts` do Supabase, onde o admin publica. Reserva:
 * os arquivos `content/blog/*.md`, usados quando o Supabase falha ou está vazio.
 * A consulta ao Supabase tem tempo-limite curto: sem ele, um banco fora do ar
 * deixava cada leitura esperando ~7 s antes de cair na reserva.
 */
import { cache } from 'react'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { supabaseAdmin } from '@/lib/supabase'
import { getAllPosts as getFilePosts, getPostBySlug as getFilePost } from '@/lib/blog'
import { slugifyText, type BlogPostSummary, type Heading } from '@/lib/blog-format'
import photoDims from '@/lib/data/blog-photo-dims.json'

export interface BlogPost extends BlogPostSummary {
  /** Corpo em HTML, com ids nos títulos e tabelas dentro de um contêiner rolável. */
  html: string
  headings: Heading[]
}

const SUPABASE_TIMEOUT_MS = 3000
/** Depois de uma falha, o Supabase é pulado por este tempo. */
const SUPABASE_COOLDOWN_MS = 60_000

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
)

let supabaseDownUntil = 0

interface PostRow {
  slug: string
  title: string
  description?: string | null
  content?: string | null
  image?: string | null
  category?: string | null
  tags?: string[] | null
  author?: string | null
  reading_time?: string | null
  created_at: string
}

/** Roda uma consulta ao Supabase e devolve `null` se falhar, demorar ou não houver o que ler. */
async function fromSupabase<T>(run: (signal: AbortSignal) => PromiseLike<{ data: T | null; error: unknown }>): Promise<T | null> {
  if (!supabaseConfigured || Date.now() < supabaseDownUntil) return null
  try {
    const { data, error } = await run(AbortSignal.timeout(SUPABASE_TIMEOUT_MS))
    if (error) throw error
    return data
  } catch {
    supabaseDownUntil = Date.now() + SUPABASE_COOLDOWN_MS
    return null
  }
}

function summaryFromRow(row: PostRow): BlogPostSummary {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    date: row.created_at,
    author: row.author || 'Equipe Venda Forte',
    image: row.image || '/sede.png',
    category: row.category || 'Geral',
    tags: row.tags ?? [],
    readingTime: row.reading_time || '5 min de leitura',
  }
}

const byNewest = (a: BlogPostSummary, b: BlogPostSummary) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

/**
 * Posts publicados, do mais recente ao mais antigo. Memorizado por requisição:
 * a página e o `generateMetadata` pedem a lista e só uma leitura é feita.
 */
export const listPosts = cache(async function listPosts(): Promise<BlogPostSummary[]> {
  const rows = await fromSupabase<PostRow[]>((signal) =>
    supabaseAdmin
      .from('posts')
      .select('slug,title,description,image,category,tags,author,reading_time,created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .abortSignal(signal)
  )

  if (rows && rows.length > 0) return rows.map(summaryFromRow).sort(byNewest)
  return getFilePosts().sort(byNewest)
})

/**
 * Converte o corpo em HTML. Conteúdo que já começa com `<` veio do editor
 * (TipTap) e é usado como está; o resto é Markdown.
 */
async function renderBody(content: string): Promise<string> {
  if (content.trim().startsWith('<')) return content
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content)
  return file.toString()
}

const stripTags = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()

/**
 * Dá id aos títulos h2 e h3 (para o índice e para links diretos) e põe cada
 * tabela num contêiner com rolagem horizontal, para não vazar no celular.
 */
export function enhanceHtml(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = []
  const used = new Set<string>()

  const withIds = html.replace(
    /<h([23])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, attrs: string, inner: string) => {
      const text = stripTags(inner)
      let id = slugifyText(text) || 'secao'
      for (let n = 2; used.has(id); n++) id = `${slugifyText(text) || 'secao'}-${n}`
      used.add(id)
      headings.push({ id, text, level: Number(level) as 2 | 3 })
      const cleanAttrs = attrs.replace(/\sid="[^"]*"/, '')
      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`
    }
  )

  const wrapped = withIds
    .replace(/<table/g, '<div class="blog-table"><table')
    .replace(/<\/table>/g, '</table></div>')
    // Fotos do artigo: carregam sob demanda e já reservam o espaço (width/height), sem pular a página
    .replace(/<img src="([^"]+)"/g, (_tag, src: string) => {
      const dims = (photoDims as Record<string, number[]>)[src]
      return `<img loading="lazy" decoding="async"${dims ? ` width="${dims[0]}" height="${dims[1]}"` : ''} src="${src}"`
    })

  return { html: wrapped, headings }
}

/** Um post completo, ou `null` se não existir. Memorizado por requisição. */
export const getPost = cache(async function getPost(slug: string): Promise<BlogPost | null> {
  const row = await fromSupabase<PostRow>((signal) =>
    supabaseAdmin.from('posts').select('*').eq('slug', slug).eq('published', true).abortSignal(signal).maybeSingle()
  )

  if (row) {
    const { html, headings } = enhanceHtml(await renderBody(row.content ?? ''))
    return { ...summaryFromRow(row), html, headings }
  }

  const file = await getFilePost(slug)
  if (!file) return null
  const { html, headings } = enhanceHtml(await renderBody(file.content))
  return {
    slug: file.slug,
    title: file.title,
    description: file.description,
    date: file.date,
    author: file.author,
    image: file.image,
    category: file.category,
    tags: file.tags,
    readingTime: file.readingTime,
    html,
    headings,
  }
})
