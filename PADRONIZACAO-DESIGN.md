# 🎨 Sistema de Design Padronizado - Grupo Venda Forte

**Data:** 29/06/2026

---

## ✅ Padronizações Implementadas

### 1. **Estrutura Consistente de Sections**

Todas as sections agora seguem o mesmo padrão:

```tsx
<section id="nome" ref={ref} className="py-24 bg-[cor] relative overflow-hidden">
  {/* Background Pattern (opcional) */}
  <div className="absolute inset-0 opacity-5">...</div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    {/* Section Header */}
    <motion.div className="text-center mb-16">
      <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
        Tag da Seção
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
        Título Principal com <span className="text-red-600">Destaque</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Subtítulo descritivo
      </p>
    </motion.div>
    
    {/* Conteúdo da Section */}
  </div>
</section>
```

---

## 📏 Padrões de Espaçamento

### **Padding Vertical:**
- **Todas as sections:** `py-24` (6rem = 96px)
- **Sections especiais (Hero):** `py-32`

### **Margin Bottom (Títulos):**
- Header da section para conteúdo: `mb-16` (4rem = 64px)
- Título para subtítulo: `mb-6` (1.5rem = 24px)
- Entre elementos: `mb-3` ou `mb-4`

### **Gap (Grids):**
- Cards pequenos: `gap-6` (1.5rem = 24px)
- Cards médios: `gap-8` (2rem = 32px)
- Seções principais: `gap-12` (3rem = 48px)

---

## 🎨 Sistema de Cores

### **Primária (Vermelho):**
```css
red-600: #DC2626  /* Principal */
red-700: #B91C1C  /* Hover/Ativo */
red-500: #EF4444  /* Destaque */
red-900: #7F1D1D  /* Background escuro */
```

### **Secundária (Cinza):**
```css
gray-900: #111827  /* Texto principal */
gray-800: #1F2937  /* Texto secundário */
gray-600: #4B5563  /* Texto terciário */
gray-200: #E5E7EB  /* Bordas */
gray-50:  #F9FAFB  /* Background claro */
```

### **Backgrounds de Sections:**
- `bg-white` - Seções padrão
- `bg-gray-50` - Seções alternadas
- `bg-gradient-to-br from-red-900 via-red-800 to-red-900` - Destaque

---

## 🎯 Tipografia Padronizada

### **Headers de Section:**
```tsx
<span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
  TAG
</span>
<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
  Título Principal
</h2>
<p className="text-xl text-gray-600 max-w-3xl mx-auto">
  Subtítulo
</p>
```

### **Cards e Componentes:**
- **Título do card:** `text-xl md:text-2xl font-bold text-gray-900`
- **Descrição:** `text-gray-600 text-sm md:text-base`
- **Labels:** `text-xs text-gray-400 uppercase tracking-wide`

---

## 📦 Cards Padronizados

### **Card Base:**
```tsx
<div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
  {/* Conteúdo */}
</div>
```

### **Variações:**
1. **Card com Hover:**
```tsx
whileHover={{ scale: 1.05, y: -5 }}
className="... hover:shadow-xl transition-all"
```

2. **Card com Ícone:**
```tsx
<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
  <Icon className="text-red-600" size={24} />
</div>
```

3. **Card Gradiente:**
```tsx
className="bg-gradient-to-br from-white to-gray-50 ..."
```

---

## 🎬 Animações Consistentes

### **Fade In:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={isInView ? { opacity: 1, y: 0 } : {}}
transition={{ duration: 0.6 }}
```

### **Slide Horizontal:**
```tsx
initial={{ opacity: 0, x: -50 }}  // ou x: 50 para direita
animate={isInView ? { opacity: 1, x: 0 } : {}}
transition={{ duration: 0.8 }}
```

### **Scale:**
```tsx
initial={{ opacity: 0, scale: 0.8 }}
animate={isInView ? { opacity: 1, scale: 1 } : {}}
transition={{ delay: 0.2, duration: 0.5 }}
```

### **Hover Effects:**
```tsx
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.98 }}
```

### **Stagger Children:**
```tsx
{items.map((item, index) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: 0.1 * index, duration: 0.6 }}
  />
))}
```

---

## 📐 Grid Responsivo

### **2 Colunas:**
```tsx
className="grid md:grid-cols-2 gap-8"
```

### **3 Colunas:**
```tsx
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### **4 Colunas:**
```tsx
className="grid grid-cols-2 md:grid-cols-4 gap-6"
```

---

## 🎨 Formulários Padronizados

### **Input Base:**
```tsx
<input
  type="text"
  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all bg-white"
/>
```

### **Label:**
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Campo *
</label>
```

### **Botão Submit:**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg"
>
  Enviar
</motion.button>
```

---

## 🎭 Background Patterns

### **Dots Pattern (Claro):**
```tsx
<div className="absolute inset-0 opacity-5">
  <div className="absolute inset-0" style={{
    backgroundImage: 'radial-gradient(circle at 2px 2px, #DC2626 1px, transparent 0)',
    backgroundSize: '40px 40px'
  }} />
</div>
```

### **Dots Pattern (Escuro):**
```tsx
<div className="absolute inset-0 opacity-10">
  <div className="absolute inset-0" style={{
    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
    backgroundSize: '40px 40px'
  }} />
</div>
```

---

## 🎯 Botões Padronizados

### **Primário:**
```tsx
className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold"
```

### **Secundário:**
```tsx
className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-full hover:bg-red-50 transition-all font-semibold"
```

### **Ghost:**
```tsx
className="text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg transition-colors"
```

---

## 📊 Badges e Tags

### **Badge Base:**
```tsx
<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
  Tag
</span>
```

### **Badge Gradiente:**
```tsx
<span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold">
  Destaque
</span>
```

---

## 🎨 Componentes por Section

### **About:**
- ✅ Header centralizado padronizado
- ✅ Background pattern
- ✅ Grid 2 colunas
- ✅ Cards de valores com sombra e hover
- ✅ Citação em destaque com borda vermelha

### **Stats:**
- ✅ Background gradiente vermelho
- ✅ Pattern de dots
- ✅ Cards com ícones
- ✅ Counter animado
- ✅ Hover effects

### **Services:**
- ✅ Grid 3 colunas
- ✅ Cards brancos com sombra
- ✅ Badges de destaque
- ✅ Botões CTa
- ✅ Banner de estatísticas

### **Testimonials:**
- ✅ Header centralizado
- ✅ Grid 3 colunas
- ✅ Estilo Google Maps
- ✅ Logos SVG estilizadas
- ✅ Banner de estatísticas

### **FAQ:**
- ✅ Accordion animado
- ✅ Botão "Ver Mais"
- ✅ CTA final
- ✅ Ícones Plus/Minus

### **Contact:**
- ✅ Cards de informação com ícones grandes
- ✅ Formulário em 2 colunas
- ✅ Inputs modernos com focus state
- ✅ Botão animado

---

## 🎯 Checklist de Padronização

### Para cada nova section:
- [ ] Usar `py-24` para padding vertical
- [ ] Adicionar `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Header centralizado com tag, título e subtítulo
- [ ] Usar `ref` e `useInView` para animações
- [ ] Background pattern (opcional)
- [ ] Animações consistentes (fade in, slide, scale)
- [ ] Cards com `rounded-2xl`, `shadow-lg`, `border-gray-100`
- [ ] Hover effects: `scale: 1.05, y: -5`
- [ ] Cores do sistema (red-600, gray-900, etc)
- [ ] Espaçamento consistente (gap-6, gap-8, mb-16)

---

## 🚀 Melhorias Implementadas

1. **Divisão Clara das Sections:**
   - Cada section tem padding `py-24`
   - Background alternado (branco/cinza)
   - Separação visual clara

2. **Largura Unificada:**
   - Todas usam `max-w-7xl mx-auto`
   - Padding horizontal consistente

3. **Formulário Modernizado:**
   - Inputs com rounded-xl
   - Focus state vermelho
   - Labels descritivas
   - Botão com gradiente e animação

4. **Animações em Todas as Sections:**
   - Fade in no header
   - Stagger nos cards
   - Hover effects consistentes
   - Scroll progress bar

---

## 📱 Responsividade

### Breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Grid Responsivo:
```tsx
// Mobile: 1 coluna
// Tablet: 2 colunas
// Desktop: 3-4 colunas
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## 🎨 Exemplo de Section Completa

```tsx
export default function Example() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="example" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #DC2626 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
            Tag
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Título com <span className="text-red-600">Destaque</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Subtítulo descritivo
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              {/* Card content */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

**Status:** ✅ Sistema de Design Padronizado e Implementado  
**Próximo:** Manter consistência em novos componentes
