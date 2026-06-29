# 🎨 Guia Visual - Design Grupo Venda Forte

## Paleta de Cores

### Cores Principais

```
🔴 Vermelho Principal
HEX: #DC2626
RGB: rgb(220, 38, 38)
Uso: Botões, títulos, destaques, ícones

⚫ Cinza Escuro
HEX: #111827
RGB: rgb(17, 24, 39)
Uso: Backgrounds, footer, hero

⚪ Branco
HEX: #FFFFFF
Uso: Texto em backgrounds escuros, cards
```

### Cores Secundárias

```
🔴 Vermelho Escuro (Hover)
HEX: #B91C1C
Uso: Hover de botões

🔴 Vermelho Claro (Backgrounds)
HEX: #FEE2E2
Uso: Backgrounds suaves

⚫ Cinza Médio
HEX: #1F2937
Uso: Seções alternadas

⚫ Cinza Claro
HEX: #F3F4F6
Uso: Texto secundário, backgrounds
```

## Tipografia

### Fonte Principal
**Inter** (Google Fonts)
- Limpa e moderna
- Ótima legibilidade
- Diversos pesos disponíveis

### Hierarquia de Texto

```
H1 (Hero): 5xl-7xl (3rem - 4.5rem)
H2 (Seções): 4xl-5xl (2.25rem - 3rem)
H3 (Cards): 2xl (1.5rem)
Body: lg-xl (1.125rem - 1.25rem)
Small: sm (0.875rem)
```

## Componentes

### 1. Botões

#### Botão Primário (Vermelho)
```tsx
className="bg-red-600 text-white px-8 py-4 rounded-full 
hover:bg-red-700 transition-all shadow-lg"
```

#### Botão Secundário (Outline)
```tsx
className="border-2 border-white text-white px-8 py-4 
rounded-full hover:bg-white hover:text-red-600"
```

### 2. Cards

#### Card de Serviço
```tsx
className="bg-white p-8 rounded-2xl shadow-lg 
hover:shadow-2xl transition-all border border-gray-100"
```

#### Card Flutuante (Hero)
```tsx
className="bg-white p-6 rounded-2xl shadow-2xl"
// Com ícone vermelho
className="text-red-600 mb-3"
```

### 3. Inputs

```tsx
className="w-full px-4 py-3 rounded-lg border border-gray-300 
focus:border-red-600 focus:ring-2 focus:ring-red-600"
```

## Seções Principais

### Hero
- Background: `bg-gradient-to-br from-gray-900 via-red-900 to-gray-800`
- Texto principal: Branco
- Destaque: Vermelho
- CTAs: Botão vermelho + Outline branco

### Sobre
- Background: Branco
- Tag: Vermelho
- Cards: Gradiente vermelho suave

### Serviços
- Background: Gradiente cinza claro
- Ícones: Vermelho
- Cards: Brancos com sombra

### Estatísticas
- Background: Cinza escuro (#111827)
- Números: Vermelho
- Texto: Cinza claro

### Depoimentos
- Background: Branco
- Cards: Gradiente suave
- Estrelas: Amarelo

### CTA
- Background: Gradiente cinza-escuro com padrão
- Formulário: Card branco
- Botão: Vermelho

### Footer
- Background: Cinza muito escuro (#111827)
- Texto: Cinza claro
- Links hover: Vermelho
- Ícones sociais: Hover vermelho

## Animações

### Framer Motion - Padrões

#### Fade In
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.6 }}
```

#### Slide Up
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

#### Slide In (Left/Right)
```tsx
initial={{ opacity: 0, x: -50 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.8 }}
```

#### Float (Loop)
```tsx
animate={{ y: [0, -20, 0] }}
transition={{ duration: 4, repeat: Infinity }}
```

#### Hover Scale
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

## Espaçamento

### Padding de Seções
```tsx
className="py-24" // Desktop
className="py-16" // Mobile
```

### Container Máximo
```tsx
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Gaps em Grids
```tsx
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
```

## Responsividade

### Breakpoints (Tailwind)
```
sm:  640px  (Tablet pequeno)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Desktop grande)
2xl: 1536px (Desktop extra grande)
```

### Exemplos de Uso

#### Texto Responsivo
```tsx
className="text-4xl md:text-5xl lg:text-6xl"
```

#### Grid Responsivo
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

#### Padding Responsivo
```tsx
className="px-4 sm:px-6 lg:px-8"
```

## Iconografia

### Biblioteca: Lucide React

#### Ícones Usados
- `TrendingUp` - Crescimento/Performance
- `Users` - Equipe/Clientes
- `Target` - Foco/Objetivos
- `Truck` - Empilhadeiras/Produtos
- `Package` - Peças
- `Wrench` - Manutenção
- `Clock` - Atendimento 24h
- `Phone` - Telefone
- `Mail` - Email
- `MapPin` - Localização
- `ArrowRight` - CTAs
- `Star` - Avaliações

### Tamanhos
```tsx
size={24} // Padrão
size={32} // Cards grandes
size={40} // Destaque
```

## Sombras

```css
shadow-sm   -> Sutil
shadow-md   -> Média
shadow-lg   -> Grande (padrão para cards)
shadow-xl   -> Extra grande
shadow-2xl  -> Cards flutuantes
```

## Border Radius

```css
rounded-lg    -> 0.5rem (cards pequenos)
rounded-xl    -> 0.75rem (cards médios)
rounded-2xl   -> 1rem (cards grandes)
rounded-full  -> 9999px (botões, badges)
```

## Transições

```css
transition-all      -> Todas as propriedades
transition-colors   -> Apenas cores
transition-shadow   -> Apenas sombras

duration-300        -> 300ms (padrão)
duration-500        -> 500ms (suave)
```

## Gradientes

### Hero Background
```tsx
bg-gradient-to-br from-gray-900 via-red-900 to-gray-800
```

### Cards
```tsx
bg-gradient-to-br from-red-50 to-red-100
```

### CTA Section
```tsx
bg-gradient-to-br from-gray-900 via-red-900 to-gray-800
```

## Estados Interativos

### Hover
```tsx
hover:bg-red-700
hover:scale-105
hover:shadow-xl
```

### Focus (Inputs)
```tsx
focus:border-red-600
focus:ring-2
focus:ring-red-600
focus:outline-none
```

### Active
```tsx
active:scale-95
```

## Acessibilidade

### Contraste
- ✅ Texto branco em backgrounds escuros
- ✅ Texto escuro em backgrounds claros
- ✅ Botões com contraste adequado

### Navegação
- ✅ Links com hover visível
- ✅ Focus states nos inputs
- ✅ Smooth scroll

### Semântica
- ✅ HTML5 semântico (`<section>`, `<nav>`, `<footer>`)
- ✅ Alt text em imagens
- ✅ ARIA labels quando necessário

## Checklist de Qualidade

### Design
- [x] Cores consistentes
- [x] Tipografia harmoniosa
- [x] Espaçamento uniforme
- [x] Animações suaves
- [x] Sombras apropriadas

### Responsividade
- [x] Mobile (320px+)
- [x] Tablet (768px+)
- [x] Desktop (1024px+)
- [x] Large Desktop (1440px+)

### Performance
- [x] Animações otimizadas
- [x] Componentes lazy loaded
- [x] CSS minificado
- [x] Imagens otimizadas (quando adicionadas)

### UX
- [x] Navegação intuitiva
- [x] CTAs claros
- [x] Feedback visual
- [x] Formulários validados

---

**Este guia garante consistência visual em todo o projeto!**
