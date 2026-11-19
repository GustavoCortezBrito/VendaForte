// Troca o número do WhatsApp (49) 98839-5635 pelo (47) 9997-0464 no texto dos posts do Supabase de produção.
// O texto dos posts vive no banco (os .md só valem se o banco estiver vazio), então o código sozinho não alcança os links
// de WhatsApp escritos dentro dos artigos.
//
// Seguranças:
//  - sem --apply, só lista o que mudaria (não grava nada);
//  - só mexe na coluna `content` e só nas formas do número antigo; o resto do texto fica idêntico;
//  - com --apply, guarda antes a coluna `content` inteira dos posts afetados em dados-seo/backup-whatsapp-posts-<data>.json.
//
// Uso: node scripts/seo/sb-trocar-whatsapp.cjs [--apply]
const fs = require('node:fs')
const path = require('node:path')
const R = path.resolve(__dirname, '../..')
const { createClient } = require(R + '/node_modules/@supabase/supabase-js')

const apply = process.argv.includes('--apply')
// formas mais longas primeiro
const PAIRS = [
  ['+55 49 98839-5635', '+55 47 9997-0464'],
  ['+55-49-98839-5635', '+55-47-9997-0464'],
  ['(49) 98839-5635', '(47) 9997-0464'],
  ['49 98839-5635', '47 9997-0464'],
  ['+5549988395635', '+554799970464'],
  ['5549988395635', '554799970464'],
]
const swap = (text) => PAIRS.reduce((acc, [from, to]) => acc.split(from).join(to), text)
const hasOld = (text) => /5549988395635|98839-?5635/.test(text)

const env = Object.fromEntries(
  fs
    .readFileSync(R + '/.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^["']|["']$/g, '')])
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

;(async () => {
  const { data, error } = await db.from('posts').select('slug, published, content')
  if (error) {
    console.error('Erro ao ler os posts:', error.message)
    process.exit(1)
  }
  const hits = data.filter((p) => hasOld(p.content ?? ''))
  console.log(`Posts lidos: ${data.length} | com o número antigo no texto: ${hits.length}`)
  for (const p of hits) {
    const n = (p.content.match(/5549988395635|98839-?5635/g) || []).length
    console.log(` - ${p.published ? 'no ar   ' : 'rascunho'} ${p.slug} (${n} ocorrência${n > 1 ? 's' : ''})`)
  }
  if (!apply) {
    console.log('\nSimulação: nada foi gravado. Rode com --apply para trocar.')
    return
  }
  const stamp = new Date().toISOString().slice(0, 10)
  const backup = path.join(R, 'dados-seo', `backup-whatsapp-posts-${stamp}.json`)
  fs.mkdirSync(path.dirname(backup), { recursive: true })
  fs.writeFileSync(backup, JSON.stringify(hits.map(({ slug, content }) => ({ slug, content })), null, 1))
  console.log('\nCópia guardada em', backup)
  for (const p of hits) {
    const { error: upErr } = await db.from('posts').update({ content: swap(p.content) }).eq('slug', p.slug)
    console.log(upErr ? ` ERRO ${p.slug}: ${upErr.message}` : ` ok ${p.slug}`)
  }
})()
