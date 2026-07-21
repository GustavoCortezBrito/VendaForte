# 🎯 Configuração Completa - Sistema de Autenticação e Banco de Dados

## ✅ O Que Foi Implementado

### 1. **Sistema de Autenticação Real**
- ✅ Login com JWT (JSON Web Tokens)
- ✅ Senhas criptografadas com bcrypt
- ✅ Middleware de proteção de rotas
- ✅ Cookies HTTP-only seguros
- ✅ Sessões de 7 dias

### 2. **Banco de Dados PostgreSQL (Supabase)**
- ✅ Tabela `users` (usuários/administradores)
- ✅ Tabela `posts` (posts do blog)
- ✅ Índices otimizados para performance
- ✅ Row Level Security (RLS) configurado
- ✅ Triggers automáticos para `updated_at`

### 3. **APIs Criadas**
- ✅ POST `/api/auth/login` - Fazer login
- ✅ POST `/api/auth/logout` - Fazer logout
- ✅ GET `/api/auth/me` - Obter usuário atual

### 4. **Utilitários**
- ✅ Script de migração de posts (.md → banco)
- ✅ Funções auxiliares de autenticação
- ✅ Cliente Supabase configurado

## 📋 PASSOS PARA CONFIGURAR

### **Passo 1: Criar Conta no Supabase**

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email
4. É GRATUITO! ✅

### **Passo 2: Criar Novo Projeto**

1. Clique em "New Project"
2. Preencha:
   - **Name**: `vendaforte-blog`
   - **Database Password**: Crie uma senha FORTE e anote
   - **Region**: `South America (São Paulo)`
3. Clique em "Create new project"
4. ⏳ Aguarde 1-2 minutos

### **Passo 3: Copiar as Credenciais**

1. No menu lateral, vá em: **Settings** ⚙️ > **API**
2. Você verá:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public**: Uma chave longa começando com `eyJh...`
   - **service_role**: Outra chave longa (precisa clicar em "Reveal" para ver)

3. **COPIE ESSAS 3 INFORMAÇÕES!**

### **Passo 4: Configurar .env.local**

1. Abra o arquivo `.env.local` no projeto
2. Adicione as linhas abaixo COM SUAS CREDENCIAIS:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-ANON
SUPABASE_SERVICE_ROLE_KEY=SUA-CHAVE-SERVICE-ROLE

# JWT Secret (copie a linha abaixo e cole no terminal para gerar)
JWT_SECRET=
```

3. **Para gerar o JWT_SECRET**, execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado e cole na linha `JWT_SECRET=`

### **Passo 5: Criar as Tabelas no Banco**

1. No Supabase, vá em: **SQL Editor** 📝 (ícone de código no menu lateral)
2. Clique em "+ New query"
3. Abra o arquivo `supabase/schema.sql` do projeto
4. Copie TODO o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em "Run" ou pressione `Ctrl+Enter`
7. Aguarde aparecer: ✅ "Success. No rows returned"

### **Passo 6: Migrar os Posts para o Banco**

Agora vamos mover os 3 posts dos arquivos `.md` para o banco de dados:

```bash
npx tsx scripts/migrate-posts.ts
```

Você verá:
```
🚀 Iniciando script de migração do Venda Forte
📝 Criando usuário admin...
✅ Usuário admin criado/atualizado: admin@vendaforte.com
📚 Iniciando migração de posts...
📁 Encontrados 3 arquivos .md
✅ Migrado com sucesso: Bem-vindo ao Blog da Venda Forte
✅ Migrado com sucesso: Manutenção Preventiva...
✅ Migrado com sucesso: 10 Regras de Ouro...
🎉 Migração concluída!
```

### **Passo 7: Testar o Sistema**

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse: http://localhost:3000/admin/login

3. Faça login com:
   - **Email**: `admin@vendaforte.com`
   - **Senha**: `vendaforte2026`

4. Você deve ser redirecionado para: `/admin/blog`

5. ✅ **FUNCIONOU!** Agora os posts estão no banco de dados!

## 🔍 Como Verificar se Está Funcionando

### Verificar Posts no Banco:

1. No Supabase, vá em: **Table Editor** 📊
2. Clique na tabela `posts`
3. Você deve ver os 3 posts listados

### Verificar Usuário no Banco:

1. No Supabase, vá em: **Table Editor** 📊
2. Clique na tabela `users`
3. Você deve ver o usuário `admin@vendaforte.com`

## ⚙️ Arquivos Criados/Modificados

```
✅ Novos arquivos:
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   └── auth.ts              # Funções de autenticação
├── app/api/auth/
│   ├── login/route.ts       # API de login
│   ├── logout/route.ts      # API de logout
│   └── me/route.ts          # API usuário atual
├── scripts/
│   └── migrate-posts.ts     # Script de migração
├── supabase/
│   └── schema.sql           # Schema do banco
├── middleware.ts            # Proteção de rotas
├── SUPABASE-SETUP.md        # Guia detalhado
└── CONFIGURACAO-COMPLETA.md # Este arquivo

📝 Arquivos modificados:
├── .env.local.example       # Adicionadas variáveis Supabase
├── app/admin/login/page.tsx # Atualizado com auth real
└── package.json             # Novas dependências
```

## 🔐 Segurança Implementada

1. ✅ **Senhas criptografadas** com bcrypt (salt rounds: 10)
2. ✅ **JWT com expiração** (7 dias)
3. ✅ **Cookies HTTP-only** (não acessíveis via JavaScript)
4. ✅ **Row Level Security** no Supabase
5. ✅ **Middleware de proteção** para rotas /admin
6. ✅ **Service Role Key** isolada no servidor

## ⚠️ IMPORTANTE - Segurança

### 🚨 NÃO COMMITAR NO GIT:
- `.env.local` (já está no .gitignore)
- Chaves do Supabase
- JWT_SECRET

### 🔒 Após Primeiro Login:
- Altere a senha padrão `vendaforte2026`
- Crie usuários adicionais se necessário

### 🛡️ Em Produção:
- Use senhas fortes
- Habilite 2FA no Supabase
- Configure HTTPS
- Monitore logs de acesso

## 🆘 Problemas Comuns

### ❌ "fetch failed" ou erro de conexão
**Solução**: Verifique se o `NEXT_PUBLIC_SUPABASE_URL` está correto

### ❌ "Invalid API key"
**Solução**: Verifique se copiou as chaves corretas (anon e service_role)

### ❌ "relation does not exist"
**Solução**: Execute o schema.sql novamente no SQL Editor do Supabase

### ❌ Login diz "Credenciais inválidas"
**Solução**: Execute novamente: `npx tsx scripts/migrate-posts.ts`

### ❌ Redirect loop no /admin
**Solução**: Limpe os cookies do navegador (F12 > Application > Cookies)

## 📞 Próximos Passos

Agora você pode:

1. ✅ Criar novos posts pelo painel admin
2. ✅ Editar posts existentes
3. ✅ Fazer upload de imagens
4. ✅ Gerenciar categorias e tags
5. ✅ Publicar/despublicar posts
6. ✅ Criar novos usuários administradores

## 🎓 Recursos de Aprendizado

- [Documentação Supabase](https://supabase.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT.io](https://jwt.io) - Decodificar tokens JWT

---

**Criado por**: Kiro AI
**Data**: Julho 2026
**Versão**: 1.0.0
