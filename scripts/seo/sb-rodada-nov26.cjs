// Aplica no Supabase de produção o que mudou nos posts na rodada de 02/11/2026:
//  - atualiza o texto de 5 posts (menções ao BNDES, valores em R$ e união dos posts de lítio);
//  - exclui 2 posts (BNDES e "Por que migrar para empilhadeiras de lítio"), com cópia guardada antes.
//
// Seguranças:
//  - sem --apply, só mostra o que faria (não grava nada);
//  - só atualiza um post se o texto do banco ainda for igual ao do commit anterior à rodada (ninguém editou no painel);
//  - com --apply, só roda depois de confirmar que o deploy já está no ar: o endereço do post de BNDES precisa
//    redirecionar em produção, senão os links antigos virariam 404;
//  - antes de excluir, grava a linha inteira em dados-seo/backup-posts-removidos-2026-11-02.json.
//
// Uso: node scripts/seo/sb-rodada-nov26.cjs [--apply]
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const R = path.resolve(__dirname, '../..')
const matter = require(R + '/node_modules/gray-matter')
const { createClient } = require(R + '/node_modules/@supabase/supabase-js')

const apply = process.argv.includes('--apply')
const BASE_REF = 'a17c579' // último commit antes desta rodada
const SITE = 'https://www.grupovendaforte.com'
const ATUALIZAR = [
  'locar-ou-comprar-empilhadeira-guia-decisao',
  'tco-empilhadeira-eletrica-como-calcular',
  'bateria-litio-vs-chumbo-acido-empilhadeiras',
  'ep-ds3-ficha-tecnica-explicada',
  'ep-equipment-revolucao-empilhadeiras-litio',
]
const EXCLUIR = ['financiamento-empilhadeira-bndes-finame-como-funciona', 'por-que-empilhadeiras-lithium-ion']

const env = Object.fromEntries(
  fs.readFileSync(R + '/.env.local', 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^['"]|['"]$/g, '').trim()])
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const norm = (s) => String(s ?? '').replace(/\r\n/g, '\n').trim()

const oldContent = (slug) => {
  try {
    return matter(execFileSync('git', ['show', `${BASE_REF}:content/blog/${slug}.md`], { cwd: R, encoding: 'utf8' })).content
  } catch {
    return null
  }
}

async function deployNoAr() {
  try {
    const res = await fetch(`${SITE}/blog/${EXCLUIR[0]}`, { redirect: 'manual', signal: AbortSignal.timeout(20000) })
    return [301, 308].includes(res.status)
  } catch {
    return false
  }
}

;(async () => {
  const slugs = [...ATUALIZAR, ...EXCLUIR]
  const { data: rows, error } = await db.from('posts').select('*').in('slug', slugs)
  if (error) return console.log('Erro ao ler posts:', error.message)
  const bySlug = new Map(rows.map((r) => [r.slug, r]))

  const updates = []
  console.log('ATUALIZAR TEXTO')
  for (const slug of ATUALIZAR) {
    const row = bySlug.get(slug)
    const file = path.join(R, 'content/blog', `${slug}.md`)
    if (!row) { console.log('  ! não está no banco:', slug); continue }
    if (!fs.existsSync(file)) { console.log('  ! sem arquivo:', slug); continue }
    const { data: meta, content } = matter(fs.readFileSync(file, 'utf8'))
    const base = oldContent(slug)
    if (base === null || norm(row.content) !== norm(base)) { console.log('  ! pulado (editado no painel ou sem base):', slug); continue }
    if (norm(row.content) === norm(content)) { console.log('  = já está igual:', slug); continue }
    const words = content.trim().split(/\s+/).length
    updates.push({ slug, fields: { content, tags: meta.tags || [], reading_time: `${Math.ceil(words / 200)} min de leitura` } })
    console.log(`  ~ ${slug}  (${norm(row.content).length} -> ${norm(content).length} caracteres)`)
  }

  const deletes = EXCLUIR.filter((slug) => bySlug.has(slug))
  console.log('\nEXCLUIR')
  for (const slug of EXCLUIR) console.log(bySlug.has(slug) ? `  - ${slug}` : `  = já não está no banco: ${slug}`)

  if (!apply) return console.log('\n(simulação: nada foi gravado; use --apply depois do deploy)')

  if (!(await deployNoAr())) {
    return console.log(`\nPARADO: ${SITE}/blog/${EXCLUIR[0]} ainda não redireciona, então o deploy não está no ar. Rode de novo quando estiver.`)
  }

  if (deletes.length) {
    const dir = path.join(R, 'dados-seo')
    fs.mkdirSync(dir, { recursive: true })
    const backup = path.join(dir, 'backup-posts-removidos-2026-11-02.json')
    fs.writeFileSync(backup, JSON.stringify(deletes.map((s) => bySlug.get(s)), null, 2))
    console.log('\nCópia guardada em', backup)
  }
  for (const { slug, fields } of updates) {
    const { error: e } = await db.from('posts').update(fields).eq('slug', slug)
    if (e) return console.log('ERRO ao atualizar', slug, e.message)
    console.log('atualizado:', slug)
  }
  for (const slug of deletes) {
    const { error: e } = await db.from('posts').delete().eq('slug', slug)
    if (e) return console.log('ERRO ao excluir', slug, e.message)
    console.log('excluído:', slug)
  }
  const { count } = await db.from('posts').select('slug', { count: 'exact', head: true })
  console.log(`\nPronto. Posts no banco agora: ${count}. As páginas públicas atualizam em até 10 minutos.`)
})()
