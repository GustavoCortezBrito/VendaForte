# 🏢 Venda Forte - Landing Page & Blog

Sistema completo de landing page e blog para o Grupo Venda Forte, especializado em empilhadeiras e equipamentos industriais.

## ✨ Features

- 🎨 Landing page moderna e responsiva
- 📝 Sistema de blog completo com admin panel
- 🔐 Autenticação segura (JWT + bcrypt)
- 💾 Banco de dados PostgreSQL (Supabase)
- 🖼️ Upload de imagens para Supabase Storage
- ⚡ Performance otimizada com ISR
- 🎯 SEO otimizado
- 📱 100% responsivo

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Editor**: TipTap (rich text editor)
- **Animações**: Framer Motion
- **Email**: Resend

## 📋 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.local.example` para `.env.local` e preencha:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
SUPABASE_SERVICE_ROLE_KEY=sua-chave-secreta
JWT_SECRET=sua-chave-jwt
RESEND_API_KEY=sua-chave-resend
```

### 3. Configurar Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o arquivo `supabase/schema.sql` no SQL Editor
4. Copie as credenciais para `.env.local`

### 4. Migrar posts para o banco
```bash
npm run migrate
```

### 5. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔐 Credenciais Padrão

**Admin Panel**: http://localhost:3000/admin/login

```
Email: admin@vendaforte.com
Senha: vendaforte2026
```

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 📚 Documentação

- 📘 **[COMECAR-AQUI.md](COMECAR-AQUI.md)** - Guia inicial
- 📗 **[RESUMO-IMPLEMENTACAO.md](RESUMO-IMPLEMENTACAO.md)** - Guia rápido (17 min)
- 📙 **[CONFIGURACAO-COMPLETA.md](CONFIGURACAO-COMPLETA.md)** - Guia detalhado
- 📕 **[SUPABASE-SETUP.md](SUPABASE-SETUP.md)** - Setup do Supabase
- ✅ **[CHECKLIST-CONFIGURACAO.md](CHECKLIST-CONFIGURACAO.md)** - Checklist
- 📊 **[IMPLEMENTACAO-FINAL.md](IMPLEMENTACAO-FINAL.md)** - Detalhes técnicos

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run start      # Inicia servidor de produção
npm run migrate    # Migra posts para o banco
npm run lint       # Executa linter
```

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (public)/          # Páginas públicas
│   │   ├── blog/          # Blog público
│   │   └── page.tsx       # Landing page
│   ├── admin/             # Painel administrativo
│   │   ├── blog/          # Gerenciamento de posts
│   │   └── login/         # Página de login
│   └── api/               # API routes
│       ├── auth/          # Autenticação
│       ├── blog/          # CRUD de posts
│       └── upload/        # Upload de imagens
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── supabase/              # Schema do banco
└── scripts/               # Scripts de migração
```

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ JWT com expiração de 7 dias
- ✅ Cookies HTTP-only
- ✅ Row Level Security (RLS) no banco
- ✅ Middleware de proteção de rotas
- ✅ Validações em todas as APIs

## 🌐 Deploy

### Vercel (Recomendado)

1. Push o código para GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras plataformas

```bash
npm run build
npm start
```

Configure as variáveis de ambiente na plataforma escolhida.

## 📝 Funcionalidades do Blog

### Admin Panel
- ✅ Criar posts com editor rich text
- ✅ Upload de múltiplas imagens
- ✅ Sistema de categorias
- ✅ Tags customizáveis
- ✅ Preview antes de publicar
- ✅ Editar posts existentes
- ✅ Deletar posts
- ✅ Busca e filtros avançados
- ✅ Paginação

### Blog Público
- ✅ Listagem de posts com filtros
- ✅ Busca por título, descrição e tags
- ✅ Filtro por categoria
- ✅ Filtro por tags múltiplas
- ✅ Ordenação (mais recente, mais antigo, A-Z)
- ✅ Paginação
- ✅ Página individual do post
- ✅ Tempo de leitura automático
- ✅ Responsivo 100%

## 🎨 Componentes

- Navbar com scroll animado
- Hero section com animações
- Cards de serviços
- Seção de estatísticas
- Depoimentos de clientes
- FAQ com acordeão
- Formulários de contato
- Footer completo
- Blog cards
- Rich text editor (TipTap)

## 📧 Contato

Para suporte ou dúvidas sobre o código, consulte a documentação completa nos arquivos markdown da raiz do projeto.

## 📄 Licença

Projeto proprietário do Grupo Venda Forte.

---

**Desenvolvido com ❤️ por Kiro AI**

**Versão**: 2.0.0  
**Última atualização**: Julho 2026
