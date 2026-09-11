# Seção 00 — Barra de urgência e header

**Componente:** `components/promo/PromoHeader.tsx`
**Posição:** fixo no topo, `z-50`, presente em toda a página

## 1. Objetivo

Ancorar a condição comercial e manter o WhatsApp a um toque de distância em qualquer
ponto da rolagem.

## 2. Layout

### Desktop, ≥ 768 px

Duas faixas empilhadas, altura total de 88 px.

- **Faixa 1, 24 px:** barra de urgência, texto centralizado, gradiente vermelho para
  laranja, `text-xs font-semibold tracking-wide`
- **Faixa 2, 64 px:** container `max-w-7xl px-6`, três colunas
  - Esquerda: logo, 128 × 36 px
  - Centro: navegação, `gap-8`, `text-sm text-neutral-400`
  - Direita: botão de WhatsApp em esmeralda, `rounded-xl px-5 py-2.5`

### Mobile, < 768 px

- Navegação central oculta
- Botão do header reduz para o ícone, sem rótulo
- **Barra fixa inferior**, 64 px, `z-50`, fundo `#05070B/95` com `backdrop-blur`, botão
  de largura total em esmeralda. Aparece após 400 px de rolagem, entra com `y: 100→0`
  em 0.35 s
- Adicionar `pb-16` ao final da página para a barra não cobrir o rodapé

## 3. Copy

- **Barra de urgência:** PRONTA ENTREGA · CONDIÇÃO ESPECIAL DE LOTE · FATURAMENTO BNDES E FINAME
- **Navegação:** DS3 1.500 kg · Economia · Ofertas · Vendedores · Cotação
- **Botão do header:** WhatsApp
- **Barra fixa mobile:** Cotar agora no WhatsApp
- **Destino de ambos:** `https://wa.me/5549988395635` com a mensagem geral da campanha

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Fundo do header | Transparente com `backdrop-blur-md` no topo. Após 24 px de rolagem vira `#05070B/90` com `backdrop-blur-xl` e borda inferior. Transição de 300 ms |
| Barra fixa mobile | Entra em `y: 100→0`, `duration 0.35`, `ease "easeOut"`, ao passar de 400 px |
| Ponto de vendedores | Pulso contínuo em esmeralda |
| Botão | Escala de 1.03 no hover, via CSS. Não usar framer-motion aqui, para não conflitar com a transição global aplicada a link e botão em `globals.css` |

Listener de scroll registrado com `{ passive: true }`.

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/logo.png` | Logo do Grupo Venda Forte | Exibido a 128 × 36 | `object-contain`, `loading="eager"`, `fetchPriority="high"` | Grupo Venda Forte |

Sem outras imagens. O header não deve competir com o palco do produto.

## 6. Acessibilidade

- `<header>` com `<nav>` interno
- Botão de WhatsApp com rótulo acessível completo quando o texto está oculto no mobile
- Âncoras apontam para identificadores existentes, verificáveis em teste
- Contraste do texto da barra de urgência sobre o gradiente precisa passar em 4.5:1

## 7. Critérios de aceite

1. O header nunca cobre o título de uma seção ao navegar por âncora
2. A barra fixa mobile não aparece antes de 400 px nem cobre o botão do formulário
3. Todos os destinos de WhatsApp usam o número real da empresa
