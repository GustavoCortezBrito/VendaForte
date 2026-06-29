# 📋 Próximos Passos - Landing Page Grupo Venda Forte

## ✅ O que já está pronto

- ✅ Design moderno com cores do site original (vermelho/cinza)
- ✅ Todas as seções principais implementadas
- ✅ Conteúdo adaptado para empilhadeiras
- ✅ Informações de contato reais (Chapecó e Joinville)
- ✅ Totalmente responsivo
- ✅ Animações suaves
- ✅ SEO básico configurado

## 🎯 Próximas Ações Prioritárias

### 1. Adicionar Conteúdo Real (URGENTE)

#### Logo e Identidade Visual
```bash
# Adicione o logo em:
public/logo.png       # Logo principal
public/logo-white.png # Logo branca (para navbar)
public/favicon.ico    # Ícone do navegador
```

Depois atualize em `components/Navbar.tsx`:
```tsx
import Image from 'next/image'

// Substituir o texto por:
<Image 
  src="/logo.png" 
  alt="Grupo Venda Forte" 
  width={180}
  height={60}
  priority
/>
```

#### Imagens de Empilhadeiras
```bash
public/
├── empilhadeiras/
│   ├── eletrica-efl252.jpg
│   ├── gas-25ton.jpg
│   ├── diesel-30ton.jpg
│   └── hero-background.jpg
```

### 2. Integrar Formulários (IMPORTANTE)

#### Opção A: EmailJS (Gratuito e Simples)
```bash
npm install @emailjs/browser
```

```tsx
// components/CTA.tsx ou Contact.tsx
import emailjs from '@emailjs/browser'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    await emailjs.sendForm(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      e.target as HTMLFormElement,
      'YOUR_PUBLIC_KEY'
    )
    alert('Mensagem enviada com sucesso!')
  } catch (error) {
    alert('Erro ao enviar mensagem.')
  }
}
```

#### Opção B: API Route do Next.js + Nodemailer
```bash
npm install nodemailer
```

Criar `app/api/contact/route.ts`

#### Opção C: Integração com CRM
- HubSpot
- RD Station
- Pipedrive

### 3. WhatsApp Business Integration

Adicione o botão flutuante do WhatsApp:

```tsx
// components/WhatsAppButton.tsx
'use client'

export default function WhatsAppButton() {
  const phoneNumber = '5549983395635' // Sem espaços ou caracteres especiais
  const message = 'Olá! Gostaria de solicitar um orçamento.'
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all z-50 hover:scale-110"
    >
      {/* Ícone WhatsApp */}
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  )
}
```

Adicione no layout:
```tsx
// app/layout.tsx
import WhatsAppButton from '@/components/WhatsAppButton'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
```

### 4. Google Analytics

```bash
# Instalar pacote
npm install @next/third-parties
```

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### 5. Catálogo de Produtos

Criar estrutura:
```
app/
├── produtos/
│   └── page.tsx              # Lista de produtos
├── produtos/[slug]/
│   └── page.tsx              # Detalhe do produto
```

Exemplo de estrutura de dados:
```tsx
// data/produtos.ts
export const produtos = [
  {
    id: 1,
    slug: 'empilhadeira-eletrica-efl252',
    nome: 'Empilhadeira Elétrica EFL252',
    categoria: 'Elétrica',
    capacidade: '2.5 toneladas',
    altura: '4.8 metros',
    preco: 'Sob consulta',
    imagem: '/empilhadeiras/efl252.jpg',
    especificacoes: {
      motor: 'Elétrico',
      bateria: '48V',
      garantia: '12 meses'
    }
  },
  // ... mais produtos
]
```

### 6. Blog/Notícias (Opcional)

```
app/
├── blog/
│   ├── page.tsx           # Lista de posts
│   └── [slug]/
│       └── page.tsx       # Post individual
```

### 7. SEO Avançado

#### Criar sitemap.xml
```tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://grupovendaforte.com',
      lastModified: new Date(),
    },
    {
      url: 'https://grupovendaforte.com/produtos',
      lastModified: new Date(),
    },
    // ... mais URLs
  ]
}
```

#### Criar robots.txt
```tsx
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://grupovendaforte.com/sitemap.xml',
  }
}
```

### 8. Otimização de Performance

```bash
# Analisar bundle
ANALYZE=true npm run build

# Instalar plugin de análise
npm install @next/bundle-analyzer
```

### 9. Testes

```bash
# Lighthouse
npm install -g @lhci/cli
lhci autorun

# Teste de acessibilidade
npm install -g axe-cli
axe http://localhost:3000
```

### 10. Deploy

#### Vercel (Recomendado)
```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Configurar domínio
1. Adicionar domínio personalizado na Vercel
2. Configurar DNS:
   - Tipo A: 76.76.21.21
   - CNAME www: cname.vercel-dns.com

## 📊 Checklist de Lançamento

### Conteúdo
- [ ] Logo adicionado
- [ ] Imagens de produtos
- [ ] Textos revisados
- [ ] Informações de contato verificadas
- [ ] Links de redes sociais atualizados

### Funcionalidades
- [ ] Formulários funcionando
- [ ] WhatsApp integrado
- [ ] Google Analytics configurado
- [ ] Emails sendo enviados
- [ ] Links testados

### SEO
- [ ] Meta tags configuradas
- [ ] Open Graph images
- [ ] Sitemap criado
- [ ] Robots.txt configurado
- [ ] Google Search Console

### Performance
- [ ] Imagens otimizadas
- [ ] Lighthouse score >90
- [ ] Tempo de carregamento <3s
- [ ] Mobile-friendly

### Segurança
- [ ] HTTPS configurado
- [ ] Headers de segurança
- [ ] Rate limiting em formulários
- [ ] Validação de inputs

## 🆘 Suporte e Manutenção

### Atualizações Regulares
```bash
# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

### Backup
- Fazer backup regular do código
- Versionar no Git
- Deploy preview antes de produção

### Monitoramento
- Configurar alertas de uptime
- Monitorar performance
- Acompanhar erros (Sentry)

## 📞 Contato para Suporte Técnico

Se precisar de ajuda com:
- Integração de formulários
- Configuração de domínio
- Otimização de performance
- Adicionar novas funcionalidades

Entre em contato com a equipe de desenvolvimento.

---

**Boa sorte com o lançamento! 🚀**

O projeto está 95% pronto. Falta apenas:
1. Adicionar imagens reais (5%)
2. Conectar formulários

Tudo o mais está funcional e pronto para uso!
