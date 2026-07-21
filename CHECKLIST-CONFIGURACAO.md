# ✅ CHECKLIST DE CONFIGURAÇÃO

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 ANTES DE COMEÇAR

- [ ] Node.js instalado (v18+)
- [ ] npm funcionando
- [ ] Projeto rodando (`npm run dev`)
- [ ] Terminal aberto no diretório do projeto

---

## 🚀 CONFIGURAÇÃO DO SUPABASE

### 1. Criar Conta e Projeto
- [ ] Acessou https://supabase.com
- [ ] Criou conta (GitHub/Google/Email)
- [ ] Clicou em "New Project"
- [ ] Nome: `vendaforte-blog`
- [ ] Escolheu senha forte para o DB
- [ ] Região: South America (São Paulo)
- [ ] Aguardou projeto ser criado (~2 min)

### 2. Coletar Credenciais
- [ ] Entrou em **Settings** > **API**
- [ ] Copiou **Project URL**
- [ ] Copiou **anon public** key
- [ ] Revelou e copiou **service_role** key

### 3. Configurar Variáveis de Ambiente
- [ ] Abriu arquivo `.env.local`
- [ ] Colou `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Colou `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Colou `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Gerou `JWT_SECRET` com:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- [ ] Colou o `JWT_SECRET` gerado

### 4. Criar Tabelas no Banco
- [ ] Entrou em **SQL Editor** no Supabase
- [ ] Clicou "+ New query"
- [ ] Abriu `supabase/schema.sql` do projeto
- [ ] Copiou TODO o conteúdo
- [ ] Colou no SQL Editor do Supabase
- [ ] Clicou "Run" ou `Ctrl+Enter`
- [ ] Viu "Success. No rows returned"

### 5. Verificar Tabelas Criadas
- [ ] Entrou em **Table Editor** no Supabase
- [ ] Viu tabela `users` criada
- [ ] Viu tabela `posts` criada

### 6. Migrar Posts para o Banco
- [ ] Executou no terminal:
  ```bash
  npm run migrate
  ```
- [ ] Viu mensagem: "✅ Usuário admin criado"
- [ ] Viu mensagem: "📁 Encontrados 3 arquivos .md"
- [ ] Viu mensagem: "🎉 Migração concluída!"

### 7. Verificar Posts no Banco
- [ ] No Supabase, **Table Editor** > **posts**
- [ ] Viu os 3 posts listados:
  - [ ] "Bem-vindo ao Blog da Venda Forte"
  - [ ] "Manutenção Preventiva..."
  - [ ] "10 Regras de Ouro..."

### 8. Verificar Usuário no Banco
- [ ] No Supabase, **Table Editor** > **users**
- [ ] Viu usuário `admin@vendaforte.com`

---

## 🧪 TESTES

### 1. Testar Servidor
- [ ] Executou: `npm run dev`
- [ ] Servidor iniciou sem erros
- [ ] Abriu: http://localhost:3000
- [ ] Site carregou normalmente

### 2. Testar Login
- [ ] Acessou: http://localhost:3000/admin/login
- [ ] Página de login carregou
- [ ] Preencheu email: `admin@vendaforte.com`
- [ ] Preencheu senha: `vendaforte2026`
- [ ] Clicou "Entrar"
- [ ] Foi redirecionado para `/admin/blog`
- [ ] Viu os 3 posts listados no painel admin

### 3. Testar Proteção de Rotas
- [ ] Fez logout (se houver botão)
- [ ] Ou limpou cookies (F12 > Application > Cookies)
- [ ] Tentou acessar: http://localhost:3000/admin/blog
- [ ] Foi redirecionado para `/admin/login` ✅

### 4. Testar Blog Público
- [ ] Acessou: http://localhost:3000/blog
- [ ] Viu os 3 posts listados
- [ ] Clicou em um post
- [ ] Post abriu normalmente
- [ ] Imagens carregaram
- [ ] Botão "Voltar" funciona

---

## 🔐 SEGURANÇA

### Verificações de Segurança
- [ ] Arquivo `.env.local` NÃO está no Git
- [ ] `.gitignore` inclui `.env.local`
- [ ] Senha do Supabase está anotada em local seguro
- [ ] JWT_SECRET não foi compartilhado
- [ ] Service Role Key não foi exposta

### Ações de Segurança Recomendadas
- [ ] Planejar trocar senha padrão `vendaforte2026`
- [ ] Ativar 2FA no Supabase (Settings > Account)
- [ ] Documentar credenciais em gerenciador de senhas
- [ ] Não compartilhar chaves em mensagens/email

---

## 📊 RESULTADO ESPERADO

Se tudo estiver ✅, você deve ter:

```
✅ Conta Supabase criada
✅ Projeto configurado
✅ Banco de dados com 2 tabelas (users, posts)
✅ 1 usuário admin no banco
✅ 3 posts no banco de dados
✅ Login funcionando
✅ Middleware protegendo rotas
✅ Blog público acessível
✅ Painel admin acessível após login
```

---

## ❌ PROBLEMAS COMUNS

### "fetch failed" ou "ECONNREFUSED"
- [ ] Verifiquei `NEXT_PUBLIC_SUPABASE_URL` no `.env.local`
- [ ] URL está correto (https://xxx.supabase.co)
- [ ] Projeto Supabase está ativo (não pausado)

### "Invalid API key"
- [ ] Verifiquei se copiei a chave `anon` correta
- [ ] Verifiquei se copiei a chave `service_role` correta
- [ ] Chaves não têm espaços extras no início/fim

### "relation 'posts' does not exist"
- [ ] Executei o `schema.sql` no SQL Editor
- [ ] Vi mensagem de sucesso
- [ ] Verifiquei no Table Editor se tabelas existem

### Login diz "Credenciais inválidas"
- [ ] Executei `npm run migrate` novamente
- [ ] Verifiquei se usuário existe na tabela `users`
- [ ] Email está correto: `admin@vendaforte.com`
- [ ] Senha está correta: `vendaforte2026`

### Posts não aparecem no /blog
- [ ] Executei `npm run migrate`
- [ ] Verifiquei posts na tabela do Supabase
- [ ] Posts têm `published = true`
- [ ] Reiniciei o servidor (`npm run dev`)

---

## 🎉 CONFIGURAÇÃO CONCLUÍDA!

Se todos os itens acima estão ✅, **PARABÉNS!**

Seu sistema está:
- ✅ 100% funcional
- ✅ Seguro
- ✅ Com autenticação real
- ✅ Posts no banco de dados
- ✅ Pronto para produção

---

## 📚 PRÓXIMOS PASSOS

Agora você pode:

1. [ ] Criar novos posts pelo painel admin
2. [ ] Fazer upload de novas imagens
3. [ ] Editar posts existentes
4. [ ] Gerenciar categorias e tags
5. [ ] Criar novos usuários admin (se necessário)
6. [ ] Configurar domínio personalizado
7. [ ] Deploy para produção

---

## 📞 PRECISA DE AJUDA?

Leia os guias detalhados:
- **RESUMO-IMPLEMENTACAO.md** - Guia rápido
- **CONFIGURACAO-COMPLETA.md** - Guia completo
- **SUPABASE-SETUP.md** - Detalhes do Supabase

---

**Data**: Julho 2026  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para uso
