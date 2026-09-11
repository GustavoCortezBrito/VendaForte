# Seção 06 — Aplicações por setor

**Componente:** `components/promo/PromoSectors.tsx`
**Âncora:** `#aplicacoes`

## 1. Objetivo

Provar amplitude e fazer o visitante se reconhecer. Os segmentos escolhidos são os que a
empresa já atende de fato, conforme o registro em `INFORMACOES-REAIS.md`.

## 2. Layout

### Desktop, ≥ 1024 px

Grade assimétrica de cinco cartões, container `max-w-7xl`, `gap-6`:

- Linha 1: dois cartões, o primeiro ocupando duas colunas de três
- Linha 2: três cartões iguais

Cada cartão é uma foto em `aspect-[4/3]`, `rounded-3xl`, com gradiente escuro na base,
de `transparent` para `#05070B` a 90%, e texto ancorado no rodapé interno.

### Mobile, < 768 px

Coluna única, cartões em `aspect-[3/2]`, empilhados com `gap-4`.

## 3. Copy

- **Rótulo:** Onde a DS3 trabalha
- **Título:** Feita para a sua operação
- **Apoio:** Os setores que a gente atende todo dia no Sul do Brasil.

Cartões:

1. **Armazém e centro de distribuição.** Verticaliza o terceiro nível do porta-pallets
   em corredor estreito, sem obra civil.
2. **Frigorífico e câmara fria.** A bateria de lítio mantém desempenho no frio, onde o
   chumbo-ácido perde capacidade.
3. **Indústria alimentícia.** Abastece a linha sem gás de escape dentro do galpão.
4. **Agronegócio e cooperativa.** Movimentação pesada em armazém de grãos e insumos.
5. **Varejo e atacado.** Operação silenciosa permite reposição com a loja aberta.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada dos cartões | Escalonamento de 0.1, cada um em `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Hover | Foto amplia para 1.05 em 600 ms com `ease-out`, dentro do cartão com `overflow-hidden`. O texto não se move |
| Gradiente | Escurece levemente no hover, de 90% para 95% de opacidade na base |

Sem parallax nesta seção. Cinco imagens grandes com parallax simultâneo derruba o
desempenho no celular.

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/promo/setor-armazem.webp` | Empilhadeira posicionando pallet no terceiro nível de porta-pallets | 1600 × 1200 | `object-cover`, gradiente na base | Empilhadeira elétrica posicionando pallet em porta-pallets de armazém |
| `public/promo/setor-frigorifico.webp` | Operação dentro de câmara fria, vapor visível | 1600 × 1200 | idem | Empilhadeira elétrica operando em câmara fria |
| `public/promo/setor-industria.webp` | Abastecimento de linha de produção em galpão | 1600 × 1200 | idem | Empilhadeira elétrica abastecendo linha de produção |
| `public/promo/setor-agro.webp` | Armazém de grãos ou insumos com pallets empilhados | 1600 × 1200 | idem | Empilhadeira elétrica em armazém de insumos agrícolas |
| `public/promo/setor-varejo.webp` | Reposição em corredor de atacado com a loja aberta | 1600 × 1200 | idem | Empilhadeira elétrica em reposição de atacado |

Diretrizes de produção:

- Foto real de operação, preferencialmente em cliente com autorização registrada
- Sem banco de imagens genérico. Empilhadeira de outra marca na foto invalida a peça
- Enquadramento horizontal, máquina à esquerda ou à direita, com espaço livre na base
  para o texto
- Se ainda não houver foto de cliente, usar a máquina em ambiente controlado e marcar
  a legenda como imagem ilustrativa

Todas com `sizes` declarado e `loading="lazy"`, pois estão abaixo da dobra.

## 6. Acessibilidade

- Texto sobre a foto precisa passar em 4.5:1 no ponto mais claro da imagem. O gradiente
  da base é obrigatório, não decorativo
- Alt descreve a operação, não repete o título do cartão
- Cartão inteiro clicável apenas se houver destino real. Sem destino, não usar cursor
  de link

## 7. Critérios de aceite

1. Nenhuma foto exibe equipamento de marca concorrente
2. O texto permanece legível em todas as cinco fotos, verificado no ponto mais claro
3. As cinco imagens somadas não passam de 900 KB depois da otimização do Next
