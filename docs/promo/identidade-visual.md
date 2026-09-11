# Identidade visual — Grupo Venda Forte

Extraída do site oficial deste projeto: `app/(public)/page.tsx`, `app/layout.tsx`,
`app/globals.css`, `components/Hero.tsx`, `components/Navbar.tsx`,
`components/WhatsAppButton.tsx`, `components/Contact.tsx` e `components/Footer.tsx`.

Este documento registra o que a marca **é hoje**, não o que ela deveria ser. Onde o site
principal e a campanha divergem, a divergência está anotada na seção 7.

## 1. Paleta

### Vermelho, cor primária

| Token | Hex | Tailwind | Uso no site |
|---|---|---|---|
| Vermelho principal | `#DC2626` | `red-600` | Botão primário, ícone em caixa, ponto de lista, barra de rolagem |
| Vermelho pressionado | `#B91C1C` | `red-700` | Estado hover do botão primário, fim do gradiente |
| Vermelho destaque | `#EF4444` | `red-500` | Número de estatística, subtítulo do hero, borda de destaque |
| Vermelho claro | `#F87171` | `red-400` | Assinatura da marca sobre fundo escuro |
| Vermelho escuro | `#991B1B` | `red-800` | Orbe de fundo no hero |
| Vermelho de fundo | `#FEF2F2` | `red-50` | Fundo de bloco de destaque no tema claro |

O vermelho é a marca. Aparece 18 vezes como fundo e 24 como texto nos componentes
principais. Nenhuma outra cor de acento compete com ele.

### Neutros

| Token | Hex | Tailwind | Uso |
|---|---|---|---|
| Preto de sobreposição | `#000000` a 60–70% | — | Camada sobre a foto da sede no hero |
| Cinza escuro | `#111827` | `gray-900` | Fundo de seção escura e rodapé |
| Cinza médio | `#1F2937` | `gray-800` | Borda e superfície secundária no escuro |
| Texto sobre escuro | `#E5E7EB` | `gray-200` | Legenda de estatística |
| Texto claro | `#F3F4F6` | `gray-100` | Parágrafo do hero |
| Texto secundário | `#9CA3AF` | `gray-400` | Texto de apoio no rodapé |
| Fundo claro | `#F8FAFC` | `slate-50` | Fundo das seções internas |

### Verde de conversão

| Token | Hex | Tailwind | Uso |
|---|---|---|---|
| Verde WhatsApp | `#22C55E` | `green-500` | Botão flutuante de WhatsApp |
| Verde WhatsApp escuro | `#16A34A` | `green-600` | Fim do gradiente do botão flutuante |

O verde é exclusivo de WhatsApp. Não aparece como cor decorativa em nenhum ponto do site.

## 2. Tipografia

**Fonte da marca:** Inter, carregada por `next/font/google` em `app/layout.tsx`, subconjunto latino.

**Atenção:** o `body` em `app/globals.css` declara uma pilha de fontes de sistema que
sobrescreve a Inter. Na prática o site renderiza em Segoe UI no Windows, não em Inter.
A fonte é baixada e não é usada. Corrigir aplicando a variável da Inter no `body` ou
removendo a declaração da pilha de sistema.

### Escala observada no hero

| Papel | Mobile | Desktop | Peso |
|---|---|---|---|
| Assinatura da marca | 16 px | 24 px | 600 |
| Título principal | 30 px | 72 px | 700 |
| Parágrafo de apoio | 16 px | 24 px | 400 |
| Número de estatística | 24 px | 48 px | 700 |
| Legenda de estatística | 12 px | 16 px | 400 |
| Botão | 14 px | 18 px | 600 |

Pesos em uso: 400 para corpo, 600 para botão e rótulo, 700 para título. O site não usa
800 nem 900. A campanha usa `font-black`, que é 900, e essa é uma divergência
deliberada, registrada na seção 7.

Altura de linha do título: `leading-tight`. Do corpo: `leading-relaxed`.

## 3. Botões

### Primário

```
bg-red-600 text-white px-8 py-4 rounded-full font-semibold
hover:bg-red-700 hover:scale-105 transition-all shadow-lg
```

Pílula totalmente arredondada, preenchida, com leve crescimento no hover. É o botão de
orçamento, a ação principal do site.

### Secundário

```
border-2 border-white text-white px-8 py-4 rounded-full font-semibold
hover:bg-white hover:text-red-600 transition-all
```

Contorno branco sobre fundo escuro que inverte no hover, ficando branco com texto
vermelho. Usado para navegação secundária, como "Nossos Produtos".

### Primário do menu

```
bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold
hover:shadow-lg transition-all
```

Variante em gradiente e canto `rounded-xl`, usada no menu. Convive com a versão em
pílula do hero, o que já é uma inconsistência do site atual.

### WhatsApp flutuante

```
w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600
shadow-2xl hover:shadow-green-500/50
```

Círculo fixo no canto inferior direito, com anel de expansão contínua atrás e selo
vermelho de notificação no canto superior.

### Regras herdadas

- Todo `a` e `button` recebe `transition: all 0.3s ease` global, declarado em
  `globals.css`. Animar transformação por JavaScript nesses elementos gera conflito
- Sombra sempre presente no botão preenchido, nunca no de contorno
- Raio: pílula no conteúdo, `rounded-xl` na navegação, `rounded-2xl` em cartão

## 4. Formas e superfícies

- Cartão: `rounded-2xl` com sombra suave no tema claro
- Ícone em caixa: quadrado de 48 px, `rounded-xl`, fundo vermelho sólido, ícone branco
- Selo de localização: gradiente vermelho a 90%, `backdrop-blur-md`, borda vermelha a 30%
- Orbe de fundo: círculo de 384 px, vermelho, `blur-3xl`, opacidade entre 10% e 15%

## 5. Movimento

| Padrão | Valor |
|---|---|
| Entrada de bloco | `opacity 0→1`, `y 30→0`, `duration 0.8` |
| Entrada de filho | `opacity 0→1`, `y 20→0`, atraso escalonado de 0.2 em 0.2 |
| Orbe de fundo | Escala de 1 a 1.2 e opacidade de 0.1 a 0.15, ciclo de 15 s, contínuo |
| Partículas do hero | 50 pontos brancos a 30%, deslocamento vertical, 20 a 35 s, ocultas no mobile |
| Hover de botão | Escala 1.05 |
| Flutuação | `animate-float`, 6 s, deslocamento de 20 px, definida em `globals.css` |

O site já respeita a regra de reduzir carga no mobile: partículas e orbes são desativados
ou simplificados abaixo de `md`.

## 6. Tom de voz

Extraído da copy real do site.

**Como a marca fala:**

- Institucional e afirmativa. "Soluções Completas em Empilhadeiras e Equipamentos"
- Credencia-se pelo fabricante. "Como Dealer Oficial da EP Equipment"
- Ancorada no território. "Chapecó, SC" e "Atendimento em todo Sul do Brasil" aparecem
  em destaque no hero, dentro de um selo próprio
- Prova por número redondo. "1000+ equipamentos vendidos", "24h de assistência técnica",
  "20+ anos de experiência"
- Frase longa e completa no parágrafo, curta e direta no botão
- Vocabulário técnico sem jargão de marketing. Fala em operação logística, peças
  originais, suporte especializado
- Sem humor, sem gíria, sem exclamação

**Frase que resume a missão, do CEO Rodrigo Schilke:** "Em nosso DNA está a constante
busca para solucionar toda e qualquer operação de movimentação de cargas."

**O que a marca não faz:** não usa superlativo vazio, não promete prazo que não controla,
não trata o cliente por "você" no material institucional, prefere a terceira pessoa.

## 7. Divergências entre o site e a campanha

A campanha `/promo` foi construída com um sistema visual próprio. As diferenças abaixo
são intencionais em parte e acidentais em parte. Precisam de decisão.

| Elemento | Site principal | Campanha `/promo` | Recomendação |
|---|---|---|---|
| Verde de conversão | `green-500` `#22C55E` | `emerald-500` `#10B981` | Unificar no verde do site, é o que o cliente já reconhece |
| Raio do botão | Pílula, `rounded-full` | `rounded-xl` e `rounded-2xl` | Manter a campanha, o formato retangular sustenta melhor o texto longo dos CTAs |
| Peso do título | 700 | 900 | Manter a campanha, é peça de conversão e pede mais contraste |
| Laranja industrial | Não existe | `#EA580C` e `#F97316` | Manter como cor secundária exclusiva da campanha, sem migrar para o site |
| Fundo | Claro, `slate-50` | Escuro, `#05070B` | Manter, a campanha é peça noturna e cinematográfica |
| Como se apresenta | "Dealer Oficial da EP Equipment" | "Representante oficial EP Equipment" | Escolher um dos dois e usar em toda a comunicação |
| Cobertura | "Santa Catarina e toda a região Sul" | "Nacional" em vários pontos | Corrigir a campanha para a cobertura real |
| Números de prova | 1000+, 24h, 20+ | Nenhum | A campanha pode usar os mesmos, já publicados e assumidos pela empresa |
| Fonte | Inter carregada, sistema aplicada | Herda o mesmo problema | Corrigir na raiz, vale para os dois |

## 8. Dados de marca

- **Nome:** Grupo Venda Forte
- **Categoria:** importação, distribuição, locação, peças e assistência técnica de
  equipamentos de movimentação de carga
- **Credenciamento:** Dealer oficial EP Equipment
- **Matriz:** Chapecó, SC
- **Pontos de atendimento:** Chapecó, Itajaí, Joinville, Maringá, Seberi, Esteio
- **CEO:** Rodrigo Schilke
- **WhatsApp:** (49) 98839-5635
- **E-mail:** comercial@grupovendaforte.com
- **Site:** grupovendaforte.com
