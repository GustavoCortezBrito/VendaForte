# 🚀 Landing Page - Grupo Venda Forte

Landing page moderna e profissional para empresa de empilhadeiras em Santa Catarina.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple)

## 🏢 Sobre o Grupo Venda Forte

O Grupo Venda Forte é especializado em:
- **Venda de Empilhadeiras** (elétricas, gás e diesel)
- **Locação de Equipamentos**
- **Assistência Técnica 24h**
- **Peças Originais**
- **Contratos de Manutenção**

**Atendimento:** Chapecó e Joinville - SC  
**Telefones:**  
- Chapecó: 49 3323-9050
- Joinville: 47 3842-3333

## 🎨 Design

O design segue a identidade visual do site original:
- **Cor Principal:** Vermelho (#DC2626)
- **Cor Secundária:** Cinza Escuro (#111827)
- **Estilo:** Moderno, limpo e profissional
- **Inspiração:** [grupovendaforte.com](https://grupovendaforte.com)

## 🎨 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas e modernas
- **Lucide React** - Ícones modernos

## ✨ Características

- ✅ Design moderno e profissional
- ✅ Totalmente responsivo (Mobile, Tablet, Desktop)
- ✅ Animações suaves com Framer Motion
- ✅ Performance otimizada
- ✅ SEO friendly
- ✅ Acessibilidade (WCAG)
- ✅ Gradientes e efeitos visuais modernos

## 📦 Seções da Landing Page

1. **Hero** - Seção inicial impactante com CTA
2. **About** - Sobre a empresa e valores
3. **Services** - Portfólio completo de serviços
4. **Stats** - Números e estatísticas com animação
5. **Testimonials** - Depoimentos de clientes
6. **CTA** - Call-to-action com formulário
7. **Contact** - Informações de contato
8. **Footer** - Links e redes sociais

## 🚀 Como Executar

### Instalação

```bash
# Clone o repositório (se aplicável)
git clone [url-do-repositorio]

# Entre na pasta do projeto
cd vendaforte-landing

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Executar em produção
npm start
```

## 🎯 Personalização

### Cores

As cores principais podem ser ajustadas no arquivo `tailwind.config.ts` ou diretamente nos componentes:

- **Azul Principal**: `blue-600`
- **Amarelo/Ouro**: `yellow-400`
- **Texto**: `gray-900`

### Conteúdo

Edite os componentes em `/components` para personalizar:

- Textos e descrições
- Imagens e ícones
- Informações de contato
- Links de redes sociais

### Animações

As animações podem ser ajustadas nos componentes individuais, modificando os parâmetros do Framer Motion:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 📱 Responsividade

A landing page é totalmente responsiva e foi testada em:

- 📱 Mobile (320px - 767px)
- 📱 Tablet (768px - 1023px)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔧 Estrutura de Arquivos

```
vendaforte-landing/
├── app/
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Página inicial
│   └── globals.css      # Estilos globais
├── components/
│   ├── Navbar.tsx       # Barra de navegação
│   ├── Hero.tsx         # Seção hero
│   ├── About.tsx        # Seção sobre
│   ├── Services.tsx     # Seção serviços
│   ├── Stats.tsx        # Estatísticas
│   ├── Testimonials.tsx # Depoimentos
│   ├── CTA.tsx          # Call-to-action
│   ├── Contact.tsx      # Contato
│   └── Footer.tsx       # Rodapé
├── public/              # Arquivos estáticos
└── package.json         # Dependências
```

## 🌟 Próximos Passos

Para colocar o site no ar, você pode:

1. **Vercel** (Recomendado para Next.js)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Conecte seu repositório Git
   - Deploy automático

3. **AWS Amplify / Azure / Google Cloud**
   - Plataformas enterprise

## 📝 Customizações Sugeridas

- [ ] Adicionar imagens reais da empresa
- [ ] Integrar formulários com backend (API)
- [ ] Adicionar Google Analytics
- [ ] Implementar chatbot
- [ ] Adicionar blog/notícias
- [ ] Integrar WhatsApp Business
- [ ] Adicionar vídeos institucionais
- [ ] Implementar multi-idioma (i18n)

## 📄 Licença

Este projeto foi desenvolvido para o Grupo Venda Forte.

## 👨‍💻 Suporte

Para dúvidas ou suporte, entre em contato através de:
- E-mail: contato@grupovendaforte.com
- Telefone: +55 (11) 3456-7890

---

Desenvolvido com ❤️ usando Next.js e Tailwind CSS
