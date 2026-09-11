# Seção 03 — Destaques rápidos

**Componente:** `components/promo/PromoHighlights.tsx`
**Âncora:** `#destaques`
**Posição:** logo após o palco de produto ser liberado

## 1. Objetivo

Entregar em cinco cartões o resumo da página inteira, para quem não vai rolar tudo, e
servir de índice navegável para o restante do conteúdo.

## 2. Layout

### Desktop, ≥ 1024 px

Faixa de cinco cartões em `grid-cols-5`, `gap-4`, container `max-w-7xl`. Cada cartão em
vidro, `rounded-2xl`, `p-5`, altura igualada. Ícone de traço fino em laranja no topo,
título em `text-sm font-bold`, apoio em `text-xs text-neutral-500`.

Seção com `py-20`, menor que as demais. É uma faixa de passagem, não um bloco de leitura.

### Tablet, 768 a 1023 px

`grid-cols-3` na primeira linha e `grid-cols-2` na segunda.

### Mobile, < 768 px

Carrossel horizontal com `scroll-snap`, cartão com 80% da largura da viewport,
indicador de posição em pontos abaixo.

## 3. Copy

**Rótulo:** O essencial

**Título:** Cinco motivos para trocar agora

Cartões, nesta ordem:

1. **Lítio sem manutenção.** Sem água desmineralizada, sem ácido, sem sala de baterias.
2. **1.500 kg a 3,3 metros.** Verticaliza o terceiro nível em corredor estreito.
3. **Pronta entrega.** Estoque com despacho e seguro de carga.
4. **Até 60x no BNDES.** Faturamento direto para CNPJ, com Finame e leasing.
5. **Assistência especializada.** Peças genuínas em estoque e equipe técnica própria.

**Link de cada cartão:** Ver detalhes

Destinos, na ordem: `#economia`, `#ds3`, `#ofertas`, `#cotacao`, `#por-que-nos`.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada da faixa | Escalonamento de 0.08 entre os cartões, cada um em `opacity 0→1`, `y 24→0`, `duration 0.5`, `ease "easeOut"` |
| Gatilho | `whileInView` com `{ once: true, margin: "-80px" }` |
| Hover do cartão | `y: -6`, `duration 0.3`, mais brilho de gradiente laranja surgindo de 0 para 100% de opacidade em 500 ms |
| Ícone | Sem animação própria. Cinco ícones animando ao mesmo tempo criam ruído |

## 5. Imagens

Nenhuma imagem. A seção usa apenas ícones de traço fino da biblioteca já instalada,
20 px, cor laranja industrial.

Ícones sugeridos, por cartão: bateria em carga, régua vertical, caminhão, cifrão ou
documento, chave de boca.

## 6. Acessibilidade

- Cada cartão é um link único, com o texto do título dentro do elemento clicável
- Área de toque mínima de 44 px no mobile
- O carrossel não pode capturar o scroll vertical da página
- Ícones são decorativos e ficam ocultos para leitor de tela

## 7. Critérios de aceite

1. Os cinco destinos de âncora existem e a rolagem para todos considera a altura do header
2. Os cartões têm a mesma altura, independente do tamanho do texto
3. No mobile, o deslize horizontal não trava a rolagem vertical
