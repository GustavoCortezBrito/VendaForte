// Sincroniza content/blog/*.md com a tabela posts do Supabase, sem pisar em edições feitas no admin:
//  - slug novo → insere
//  - slug existente → só atualiza se o conteúdo no banco ainda for igual ao do último commit do .md
//    (ou seja, ninguém editou no admin); do contrário, pula e avisa
//  - posts que não existem nos .md (os 3 antigos) nunca são tocados
// Uso: node sb-sync.cjs [--apply]
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const R = path.resolve(__dirname, '../..')
const matter = require(R + '/node_modules/gray-matter')
const { createClient } = require(R + '/node_modules/@supabase/supabase-js')
const env = Object.fromEntries(fs.readFileSync(R + '/.env.local', 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^["']|["']$/g, '')]))
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const apply = process.argv.includes('--apply')
const norm = (s) => String(s ?? '').replace(/\r\n/g, '\n').trim()

const dir = path.join(R, 'content', 'blog')
const rows = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((file) => {
  const slug = file.replace(/\.md$/, '')
  const { data: meta, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'))
  const date = String(meta.date instanceof Date ? meta.date.toISOString() : meta.date || '')
  return {
    slug,
    title: meta.title || 'Sem título',
    description: meta.description || '',
    content,
    image: meta.image || '/sede.png',
    category: meta.category || 'Geral',
    tags: meta.tags || [],
    author: meta.author || 'Equipe Venda Forte',
    published: true,
    reading_time: `${Math.ceil(content.trim().split(/\s+/).length / 200)} min de leitura`,
    created_at: date.includes('T') ? new Date(date).toISOString() : new Date(`${date.slice(0, 10)}T12:00:00-03:00`).toISOString(),
  }
})

const committed = (slug) => {
  try { return matter(execFileSync('git', ['show', `${process.env.BASE_REF || 'HEAD'}:content/blog/${slug}.md`], { cwd: R, encoding: 'utf8' })).content } catch { return null }
}

;(async () => {
  const { data: existing, error } = await db.from('posts').select('slug,content')
  if (error) return console.log('Erro ao ler posts:', error.message)
  const bySlug = new Map(existing.map((r) => [r.slug, r]))
  const toInsert = [], toUpdate = [], skipped = []
  for (const row of rows) {
    const have = bySlug.get(row.slug)
    if (!have) { toInsert.push(row); continue }
    const base = committed(row.slug)
    if (base !== null && norm(have.content) === norm(base)) toUpdate.push(row)
    else skipped.push(row.slug)
  }
  console.log(`inserir: ${toInsert.length} | atualizar: ${toUpdate.length} | pular (editados no admin ou sem base): ${skipped.length}`)
  toInsert.forEach((r) => console.log('  + ', r.slug, '|', r.category))
  toUpdate.forEach((r) => console.log('  ~ ', r.slug))
  skipped.forEach((s) => console.log('  ! pulado:', s))
  if (!apply) return console.log('\n(simulação — nada foi gravado; use --apply)')
  if (toInsert.length) {
    const { error: e } = await db.from('posts').insert(toInsert)
    if (e) return console.log('ERRO ao inserir:', e.message)
  }
  for (const row of toUpdate) {
    const { slug, ...fields } = row
    const { error: e } = await db.from('posts').update(fields).eq('slug', slug)
    if (e) return console.log('ERRO ao atualizar', slug, e.message)
  }
  const { count } = await db.from('posts').select('slug', { count: 'exact', head: true })
  console.log(`\nGravado. Linhas em posts agora: ${count}`)
})()
