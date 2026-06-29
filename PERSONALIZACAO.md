# 🎨 Guia de Personalização Rápida

## Como Personalizar o Conteúdo

### 1. Alterar Informações de Contato

**Arquivo: `components/Contact.tsx` e `components/Footer.tsx`**

```typescript
// Localizar e alterar:
const contactInfo = [
  {
    title: 'Telefone',
    info: '+55 (11) 3456-7890',  // ← ALTERE AQUI
    link: 'tel:+551134567890'
  },
  {
    title: 'E-mail',
    info: 'contato@grupovendaforte.com',  // ← ALTERE AQUI
    link: 'mailto:contato@grupovendaforte.com'
  },
  // ...
]
```

---

### 2. Alterar Nome da Empresa

**Arquivo: `app/layout.tsx`**

```typescript
export const metadata: Metadata = {
  title: "Grupo Venda Forte - Transformando Resultados em Vendas",  // ← ALTERE AQUI
  description: "Consultoria especializada em vendas...",  // ← ALTERE AQUI
};
```

**Arquivo: `components/Navbar.tsx`**

```typescript
<h1 className="text-2xl font-bold">
  Venda Forte  {/* ← ALTERE AQUI */}
</h1>
```

---

### 3. Alterar Cores do Site

**Cores Principais:**
- Azul: `blue-600`, `blue-700`, `blue-900`
- Amarelo/Dourado: `yellow-400`
- Cinza: `gray-900`, `slate-50`

**Onde Alterar:**

```typescript
// Em qualquer componente, procure por classes como:
className="bg-blue-600"  // Cor de fundo
className="text-blue-600"  // Cor do texto
className="border-blue-600"  // Cor da borda

// Para mudar para verde por exemplo:
className="bg-green-600"
className="text-green-600"
className="border-green-600"
```

**Cores Disponíveis no Tailwind:**
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`
- `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`
- `violet`, `purple`, `fuchsia`, `pink`, `rose`

---

### 4. Alterar Serviços

**Arquivo: `components/Services.tsx`**

```typescript
const services = [
  {
    icon: <TrendingUp size={40} />,
    title: 'Consultoria em Vendas',  // ← ALTERE AQUI
    description: 'Análise completa...',  // ← ALTERE AQUI
    features: ['Item 1', 'Item 2', 'Item 3']  // ← ALTERE AQUI
  },
  // Adicione mais serviços copiando este bloco
  {
    icon: <SeuIcone size={40} />,
    title: 'Novo Serviço',
    description: 'Descrição do novo serviço',
    features: ['Feature 1', 'Feature 2']
  }
]
```

---

### 5. Alterar Depoimentos

**Arquivo: `components/Testimonials.tsx`**

```typescript
const testimonials = [
  {
    name: 'Carlos Silva',  // ← ALTERE AQUI
    position: 'CEO',  // ← ALTERE AQUI
    company: 'TechSolutions Brasil',  // ← ALTERE AQUI
    image: '👨‍💼',  // ← ALTERE AQUI (ou use URL de imagem)
    rating: 5,
    text: 'Depoimento do cliente...'  // ← ALTERE AQUI
  },
  // Adicione mais depoimentos aqui
]
```

---

### 6. Alterar Estatísticas

**Arquivo: `components/Stats.tsx`**

```typescript
const stats = [
  { value: 500, suffix: '+', label: 'Empresas Transformadas', duration: 2 },  // ← ALTERE
  { value: 150, suffix: '%', label: 'Aumento Médio em Vendas', duration: 2 },  // ← ALTERE
  { value: 10000, suffix: '+', label: 'Profissionais Treinados', duration: 2.5 },  // ← ALTERE
  { value: 98, suffix: '%', label: 'Taxa de Satisfação', duration: 2 },  // ← ALTERE
]
```

---

### 7. Adicionar Logo

**Passo 1:** Adicione sua logo em `public/logo.png`

**Passo 2:** Atualize o Navbar (`components/Navbar.tsx`):

```typescript
import Image from 'next/image'

// Substituir o texto por:
<Image 
  src="/logo.png" 
  alt="Venda Forte" 
  width={150} 
  height={50}
  priority
/>
```

---

### 8. Alterar Links de Redes Sociais

**Arquivo: `components/Footer.tsx`**

```typescript
const socialLinks = [
  { 
    icon: <Share2 size={20} />, 
    href: 'https://facebook.com/suapagina',  // ← ALTERE AQUI
    label: 'Facebook' 
  },
  // ... outros
]
```

---

### 9. Alterar Texto do Hero

**Arquivo: `components/Hero.tsx`**

```typescript
<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
  Transforme Suas  {/* ← ALTERE AQUI */}
  <span className="block text-yellow-400">Vendas</span>
</h1>

<p className="text-xl text-blue-100 mb-8 leading-relaxed">
  Somos especialistas em...  {/* ← ALTERE AQUI */}
</p>
```

---

### 10. Adicionar Favicon

**Passo 1:** Crie seu favicon em [favicon.io](https://favicon.io)

**Passo 2:** Adicione os arquivos em `app/`:
- `favicon.ico`
- `icon.png`
- `apple-icon.png`

O Next.js detecta automaticamente!

---

## Alterações de Estilo Comuns

### Mudar Fonte

**Arquivo: `app/layout.tsx`**

```typescript
import { Inter, Poppins, Roboto } from "next/font/google";

// Escolha uma fonte:
const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"] 
});

// Use na página:
<body className={poppins.className}>
```

### Mudar Raio dos Botões

Procure por `rounded-full` e altere para:
- `rounded-lg` - Cantos menos arredondados
- `rounded-xl` - Meio termo
- `rounded-2xl` - Mais arredondado
- `rounded-none` - Sem arredondamento

### Mudar Sombras

Procure por `shadow-lg` e altere para:
- `shadow-sm` - Sombra pequena
- `shadow-md` - Sombra média
- `shadow-lg` - Sombra grande
- `shadow-xl` - Sombra extra grande
- `shadow-2xl` - Sombra máxima

---

## Adicionando Novas Seções

### Template de Seção

Crie um novo arquivo em `components/MinhaSecao.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function MinhaSecao() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="minha-secao" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Título da Seção
          </h2>
          <p className="text-xl text-gray-600">
            Descrição da seção
          </p>
        </motion.div>
      </div>
    </section>
  )
}
```

Adicione em `app/page.tsx`:

```typescript
import MinhaSecao from '@/components/MinhaSecao'

export default function Home() {
  return (
    <main>
      {/* ... outras seções ... */}
      <MinhaSecao />
    </main>
  )
}
```

---

## Velocidade das Animações

Em qualquer componente com animação, altere `duration`:

```typescript
// Mais rápido
transition={{ duration: 0.3 }}

// Normal
transition={{ duration: 0.6 }}

// Mais lento
transition={{ duration: 1.2 }}
```

---

## Remover Seções

Em `app/page.tsx`, comente ou remova a linha:

```typescript
export default function Home() {
  return (
    <main>
      <Hero />
      {/* <Stats /> */}  ← COMENTADO = NÃO APARECE
      <Services />
    </main>
  )
}
```

---

## Dicas Importantes

1. **Sempre teste após alterações:**
   ```bash
   npm run dev
   ```

2. **Para mudanças de cor globais**, considere editar `tailwind.config.ts`

3. **Use o DevTools do navegador** para experimentar cores e estilos antes de alterar o código

4. **Mantenha backup** antes de grandes mudanças

5. **Use Git** para versionar suas alterações:
   ```bash
   git add .
   git commit -m "Alteração de cores"
   ```

---

## Precisa de Ajuda?

- 📧 contato@grupovendaforte.com
- 📱 +55 (11) 3456-7890
- 📚 [Documentação Tailwind](https://tailwindcss.com/docs)
- 📚 [Documentação Next.js](https://nextjs.org/docs)
- 📚 [Documentação Framer Motion](https://www.framer.com/motion/)

---

**Boas personalizações! 🎨**
