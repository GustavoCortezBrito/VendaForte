// Define uma nova senha para um usuário do painel (tabela `users` do Supabase de produção).
// A senha é digitada no terminal, sem aparecer na tela, e só o hash bcrypt vai para o banco:
// nada fica em arquivo, histórico do terminal ou repositório.
//
// Uso: node scripts/seo/definir-senha-admin.cjs [email]      (sem e-mail, usa admin@vendaforte.com)
const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')
const R = path.resolve(__dirname, '../..')
const bcrypt = require(R + '/node_modules/bcryptjs')
const { createClient } = require(R + '/node_modules/@supabase/supabase-js')

const email = (process.argv[2] || 'admin@vendaforte.com').trim()
const env = Object.fromEntries(
  fs.readFileSync(R + '/.env.local', 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^['"]|['"]$/g, '').trim()])
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function pergunta(texto) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    const escrever = rl._writeToOutput
    rl._writeToOutput = (s) => (rl.stdoutMuted && s !== texto ? rl.output.write('') : escrever.call(rl, s))
    rl.stdoutMuted = false
    rl.question(texto, (resposta) => {
      rl.close()
      process.stdout.write('\n')
      resolve(resposta)
    })
    rl.stdoutMuted = true
  })
}

;(async () => {
  const { data: user, error } = await db.from('users').select('id,email,name,role').eq('email', email).maybeSingle()
  if (error) return console.log('Erro ao ler o usuário:', error.message)
  if (!user) return console.log(`Não existe usuário com o e-mail ${email}.`)

  console.log(`Usuário: ${user.email} (${user.name}, ${user.role})`)
  const senha = await pergunta('Nova senha (mínimo 10 caracteres): ')
  if (senha.length < 10) return console.log('Senha curta demais. Nada foi alterado.')
  const repete = await pergunta('Repita a senha: ')
  if (senha !== repete) return console.log('As senhas não são iguais. Nada foi alterado.')

  const password_hash = await bcrypt.hash(senha, 10)
  const { error: e } = await db.from('users').update({ password_hash }).eq('id', user.id)
  if (e) return console.log('Erro ao gravar:', e.message)
  console.log('Pronto. Entre em /admin/login com esse e-mail e a nova senha.')
})()
