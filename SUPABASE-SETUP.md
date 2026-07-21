# Configuração do Supabase para o Sistema de Blog

Este guia detalha como configurar o Supabase para o sistema de autenticação e banco de dados do blog Venda Forte.

## 📋 Pré-requisitos

- Conta no Supabase (gratuita em [supabase.com](https://supabase.com))
- Node.js instalado
- Acesso ao projeto Venda Forte

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: vendaforte-blog (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **guarde-a**
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project"
5. Aguarde alguns minutos enquanto o projeto é criado

## 🔑 Passo 2: Obter as Credenciais

Após o projeto ser criado:

1. No painel do Supabase, vá para **Settings** (ícone de engrenagem) > **API**
2. Você verá as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Chave pública (começa com `eyJh...`)
   - **service_role**: Chave privada (role: **service_role**)

## 📝 Passo 3: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` no projeto
2. Adicione as seguintes variáveis com os valores do Supabase:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-privada-service-role

# JWT Secret (gere um novo com: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET=sua-chave-jwt-secreta-gerada
```

### Como gerar o JWT_SECRET:

Execute no terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado e cole no `.env.local`

## 🗄️ Passo 4: Criar as Tabelas no Banco de Dados

1. No painel do Supabase, vá para **SQL Editor** (ícone de banco de dados)
2. Clique em "New query"
3. Copie e cole todo o conteúdo do arquivo `supabase/schema.sql`
4. Clique em "Run" ou pressione Ctrl/Cmd + Enter
5. Aguarde a execução (pode levar alguns segundos)
6. Você verá "Success. No rows returned" se tudo correr bem

### Verificar se as tabelas foram criadas:

1. Vá para **Table Editor** (ícone de tabela)
2. Você deve ver duas tabelas:
   - `users` - Usuários do sistema
   - `posts` - Posts do blog

## 🔄 Passo 5: Migrar os Posts Existentes

Agora vamos migrar os posts dos arquivos `.md` para o banco de dados:

1. Certifique-se de que o `.env.local` está configurado corretamente
2. Instale o tsx (se não tiver):
   ```bash
   npm install -D tsx
   ```
3. Execute o script de migração:
   ```bash
   npx tsx scripts/migrate-posts.ts
   ```
4. Você verá o progresso da migração no terminal
5. Ao final, será mostrado:
   - ✅ Posts migrados com sucesso
   - 📌 Credenciais de login

## 🔐 Passo 6: Testar o Login

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acesse: http://localhost:3000/admin/login
3. Use as credenciais:
   - **Email**: admin@vendaforte.com
   - **Senha**: vendaforte2026
4. Se tudo estiver correto, você será redirecionado para `/admin/blog`

## ⚠️ IMPORTANTE: Segurança

### 1. Alterar a senha padrão

Após o primeiro login, **altere imediatamente a senha padrão**!

### 2. Proteger as chaves

- **NUNCA** commite o arquivo `.env.local` no Git
- As chaves `SUPABASE_SERVICE_ROLE_KEY` e `JWT_SECRET` são **secretas**
- Mantenha o arquivo `.gitignore` com `.env.local` listado

### 3. Habilitar autenticação de dois fatores

No Supabase, ative 2FA na sua conta:
1. Settings > Account
2. Enable Two-Factor Authentication

## 🔍 Verificar Instalação

### Verificar usuários no banco:

1. No Supabase, vá para **Table Editor** > **users**
2. Você deve ver o usuário `admin@vendaforte.com`

### Verificar posts no banco:

1. No Supabase, vá para **Table Editor** > **posts**
2. Você deve ver todos os posts migrados

### Verificar políticas de segurança (RLS):

1. No Supabase, vá para **Authentication** > **Policies**
2. Cada tabela deve ter suas políticas listadas

## 🛠️ Troubleshooting

### Erro: "fetch failed" ou "ECONNREFUSED"

- Verifique se o `NEXT_PUBLIC_SUPABASE_URL` está correto
- Confirme que o projeto Supabase está ativo (não pausado)

### Erro: "Invalid API key"

- Verifique se copiou as chaves corretas do Supabase
- Certifique-se de usar a chave `anon` para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Certifique-se de usar a chave `service_role` para `SUPABASE_SERVICE_ROLE_KEY`

### Erro na migração: "relation does not exist"

- Execute novamente o script SQL (`supabase/schema.sql`)
- Verifique se todas as tabelas foram criadas

### Login não funciona: "Credenciais inválidas"

- Execute novamente o script de migração: `npx tsx scripts/migrate-posts.ts`
- Isso irá recriar o usuário admin com a senha correta

## 📊 Próximos Passos

Após a configuração, você pode:

1. ✅ Fazer login no painel admin
2. ✅ Criar novos posts
3. ✅ Editar posts existentes
4. ✅ Gerenciar categorias e tags
5. ✅ Fazer upload de imagens

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do terminal
2. Verifique o console do navegador (F12)
3. Confira os logs do Supabase: **Logs** > **Query Logs**
4. Revise este guia do início

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)
