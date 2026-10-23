// Le a primeira planilha de um .xlsx ja descompactado (unzip) e grava out.tsv na mesma pasta.
// Uso: copie o .xlsx para uma pasta nova como in.zip, descompacte, e rode: node scripts/seo/xlsx-read.cjs <pasta>
const fs = require('node:fs'); const path = require('node:path')
const dir = process.argv[2]
const un = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
const ss = []
const sx = fs.readFileSync(path.join(dir, 'xl/sharedStrings.xml'), 'utf8')
for (const m of sx.matchAll(/<si>([\s\S]*?)<\/si>/g)) ss.push(un([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('')))
const sheet = fs.readFileSync(path.join(dir, 'xl/worksheets/sheet1.xml'), 'utf8')
const col = (ref) => ref.replace(/\d+/g, '').split('').reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1
const rows = []
for (const r of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
  const row = []
  for (const c of r[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const attrs = c[1], body = c[2] || ''
    const ref = /r="([A-Z]+\d+)"/.exec(attrs)[1]; const t = /t="(\w+)"/.exec(attrs)?.[1]
    const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1]; const is = /<t[^>]*>([\s\S]*?)<\/t>/.exec(body)?.[1]
    row[col(ref)] = t === 's' ? ss[+v] : t === 'inlineStr' ? un(is || '') : v ?? ''
  }
  rows.push(row)
}
fs.writeFileSync(path.join(dir, 'out.tsv'), rows.map((r) => Array.from(r, (x) => x ?? '').join('\t')).join('\n'))
console.log('linhas:', rows.length)
