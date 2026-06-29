# 🚀 Guia de Deploy - Landing Page Venda Forte

## Opções de Deploy

### 1. Vercel (Recomendado) ⭐

A Vercel é a plataforma criada pelos desenvolvedores do Next.js e oferece a melhor integração.

#### Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Deploy via Git

1. Faça push do código para GitHub/GitLab/Bitbucket
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe seu repositório
5. Configure (já vem configurado automaticamente para Next.js)
6. Deploy!

**Vantagens:**
- ✅ Deploy automático em cada push
- ✅ Preview deployments para PRs
- ✅ SSL automático
- ✅ CDN global
- ✅ Gratuito para projetos pessoais
- ✅ Zero configuração

---

### 2. Netlify

Outra excelente opção com plano gratuito generoso.

#### Deploy via CLI

```bash
# Instalar Netlify CLI
npm install netlify-cli -g

# Build do projeto
npm run build

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
```

#### Deploy via Git

1. Acesse [netlify.com](https://www.netlify.com)
2. "New site from Git"
3. Conecte seu repositório
4. Configure build:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy!

---

### 3. AWS Amplify

Para quem já usa AWS.

```bash
# Instalar Amplify CLI
npm install -g @aws-amplify/cli

# Configurar
amplify configure

# Inicializar
amplify init

# Adicionar hosting
amplify add hosting

# Publicar
amplify publish
```

---

### 4. Azure Static Web Apps

```bash
# Instalar Azure CLI
npm install -g @azure/static-web-apps-cli

# Build
npm run build

# Deploy via portal Azure ou GitHub Actions
```

---

### 5. Google Cloud Platform

#### App Engine

```bash
# Criar app.yaml
runtime: nodejs20
env: standard

# Deploy
gcloud app deploy
```

---

### 6. Docker + VPS

Se você tem um servidor próprio (DigitalOcean, Linode, etc.)

#### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build e Run

```bash
# Build
docker build -t vendaforte-landing .

# Run
docker run -p 3000:3000 vendaforte-landing
```

---

## Configurações Importantes

### Variáveis de Ambiente

Antes do deploy, configure as variáveis de ambiente na plataforma escolhida:

```bash
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://api.exemplo.com/send
# ... outras variáveis
```

### Domínio Customizado

#### Na Vercel:
1. Vá em Settings > Domains
2. Adicione seu domínio (ex: grupovendaforte.com)
3. Configure os DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### Na Netlify:
1. Settings > Domain management
2. Add custom domain
3. Configure DNS conforme instruções

---

## Otimizações Pré-Deploy

### 1. Análise de Bundle

```bash
# Instalar analisador
npm install @next/bundle-analyzer

# Analisar
ANALYZE=true npm run build
```

### 2. Performance Check

```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run
lhci autorun
```

### 3. Build Test Local

```bash
# Build e test
npm run build
npm start
```

---

## Checklist Pré-Deploy

- [ ] Build local sem erros
- [ ] Todas as imagens otimizadas
- [ ] Variáveis de ambiente configuradas
- [ ] Meta tags e SEO verificados
- [ ] Analytics configurado
- [ ] Formulários testados
- [ ] Links testados (sem 404s)
- [ ] Responsividade verificada
- [ ] Performance >90 no Lighthouse
- [ ] Acessibilidade >90 no Lighthouse
- [ ] Robots.txt configurado
- [ ] Sitemap.xml gerado
- [ ] Favicon adicionado
- [ ] SSL/HTTPS configurado

---

## Monitoramento Pós-Deploy

### Analytics
- [ ] Google Analytics configurado
- [ ] Search Console configurado
- [ ] Tag Manager instalado

### Performance
- [ ] New Relic ou similar
- [ ] Sentry para error tracking
- [ ] Uptime monitoring (UptimeRobot)

### SEO
- [ ] Submit sitemap no Google Search Console
- [ ] Submit no Bing Webmaster Tools

---

## Comandos Úteis

```bash
# Verificar build localmente
npm run build && npm start

# Limpar cache
rm -rf .next node_modules
npm install
npm run build

# Verificar versão do Node
node -v  # Deve ser 18.x ou superior

# Atualizar dependências
npm update

# Audit de segurança
npm audit
npm audit fix
```

---

## Troubleshooting

### Build falha

1. Limpe cache: `rm -rf .next`
2. Reinstale: `rm -rf node_modules && npm install`
3. Verifique versão do Node: `node -v`

### Imagens não aparecem

- Use o componente `next/image`
- Verifique o domínio em `next.config.js`

### Variáveis de ambiente não funcionam

- No cliente, use `NEXT_PUBLIC_` prefix
- Rebuild após alterar `.env`

### Erro 404 em rotas

- Verifique configuração de rewrites
- Certifique-se que está usando App Router

---

## Domínios Sugeridos

Se ainda não tem domínio:

- grupovendaforte.com.br
- vendaforte.com.br
- grupovendaforte.com
- vendaforte.com

Registradores confiáveis:
- Registro.br (para .br)
- Namecheap
- Google Domains
- GoDaddy

---

## Custos Estimados

### Gratuito
- Vercel (Hobby): Grátis
- Netlify (Starter): Grátis
- GitHub Pages: Grátis

### Pago
- Vercel Pro: $20/mês
- Netlify Pro: $19/mês
- AWS Amplify: ~$15/mês
- VPS DigitalOcean: $5-10/mês
- Domínio: $10-15/ano

---

## Scripts Personalizados

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

---

## Suporte

Para problemas com deploy:

- 📧 Email: contato@grupovendaforte.com
- 📱 WhatsApp: +55 (11) 3456-7890
- 📚 Docs Next.js: https://nextjs.org/docs
- 💬 Discord Next.js: https://nextjs.org/discord

---

**Boa sorte com o deploy! 🚀**
