# Seção 07 — Linha completa em campanha

**Componente:** `components/promo/PromoOffersGrid.tsx`
**Âncora:** `#ofertas`
**Fonte de dados:** `components/promo/promo.config.ts`, constante `PROMO_PRODUCTS`

## 1. Objetivo

Capturar quem precisa de outra capacidade e evitar o abandono de quem achou a DS3 grande
ou pequena demais.

## 2. Layout

### Desktop, ≥ 768 px

Três cartões em `grid-cols-3`, `gap-8`, container `max-w-7xl`, seção com `py-28`.

Cada cartão, de cima para baixo:

1. Selo de modelo à esquerda e selo de pronta entrega à direita
2. Imagem do produto, `aspect-square` de 192 px, centralizada, com halo atrás
3. Nome e chamada
4. Ficha em três colunas: carga, elevação, bateria
5. Três destaques com ícone de confirmação
6. Preço e condição, separados por borda superior
7. Botão primário em esmeralda
8. Botão secundário em contorno

O cartão da DS3 é o destaque: borda vermelha a 30%, fundo em gradiente vermelho escuro e
halo vermelho mais forte. Os outros dois usam vidro neutro.

### Mobile, < 768 px

Coluna única, `gap-6`. A ordem interna do cartão não muda. Imagem reduz para 160 px.

Alinhar o bloco de preço ao fim do cartão para que os três botões fiquem na mesma altura
relativa, mesmo com nomes de tamanhos diferentes.

## 3. Copy

- **Rótulo:** Vitrine de campanha
- **Título:** Modelos em oferta
- **Apoio:** Condições válidas enquanto durar o estoque do lote.

### EP DS3, empilhadeira patolada

Selo: Destaque, 1.500 kg · Chamada: Verticalização em corredor estreito
Ficha: 1.500 kg · 3,3 metros · 24V lítio
Destaques: recarga de oportunidade em qualquer tomada · zero manutenção de água e ácido ·
timão ergonômico com comando progressivo
Preço: a partir de R$ 39.900 · até 48x via BNDES e Finame
Botão: Cotar DS3 no WhatsApp

### EP F4, paleteira elétrica

Selo: Mais vendida · Chamada: A campeã de vendas do armazém
Ficha: 1.500 kg · 200 mm · 24V lítio
Destaques: compacta para docas e caminhões · bateria removível de troca rápida ·
operação silenciosa para turno noturno
Preço: a partir de R$ 14.890 · até 12x no cartão CNPJ
Botão: Cotar F4 no WhatsApp

### EP EFL302, contrabalançada

Selo: 3 toneladas · Chamada: Força pesada 100% elétrica
Ficha: 3.000 kg · 6 metros · 80V lítio
Destaques: substitui a combustão sem perder desempenho · cabine ampla com coluna de
direção ajustável · frenagem regenerativa
Preço: condição de lote · faturamento direto mais BNDES
Botão: Cotar EFL302 no WhatsApp

### Comum aos três

- **Selo de disponibilidade:** Pronta entrega
- **Botão secundário:** Pedir proposta formal, âncora `#cotacao`
- **Mensagem:** Olá! Quero cotar a [nome do modelo] de [capacidade] da campanha promocional.

### Barra de confiança, abaixo dos cartões

Três itens: Pronta entrega, com despacho e seguro de carga · Garantia de fábrica, com
assistência técnica especializada · Faturamento CNPJ, com BNDES, Finame e leasing.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada dos cartões | Escalonamento de 0.12, cada um em `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Hover do cartão | `y: -8`, `duration 0.4`, mais brilho de gradiente laranja de 0 para 100% em 500 ms |
| Imagem no hover | Escala 1.05 em 500 ms |
| Halo do destaque | Estático. Não pulsar, para não competir com o indicador de disponibilidade |
| Botão primário | Escala 1.02 no hover, via CSS |

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/promo/hero-ds3.png` | Render da DS3, fundo transparente | 1600 × 1600 | `object-contain`, halo vermelho atrás | Empilhadeira Patolada EP DS3 de 1.500 kg |
| `public/promo/produto-f4.webp` | Paleteira F4 recortada, mesmo ângulo da DS3 | 1200 × 1200 | idem, halo laranja | Paleteira Elétrica EP F4 de 1.500 kg |
| `public/promo/produto-efl302.webp` | Contrabalançada EFL302 recortada, mesmo ângulo | 1200 × 1200 | idem, halo laranja | Empilhadeira Contrabalançada EP EFL302 de 3 toneladas |

Hoje a F4 e a EFL302 apontam para o CDN externo `cdn.ep-portal.net`, já liberado em
`next.config.ts`. Recomenda-se baixar e servir do próprio domínio, por três motivos:
controle de disponibilidade, padronização de ângulo e eliminação de uma dependência
externa no caminho de renderização.

Diretriz de produção: as três máquinas no mesmo ângulo, mesma altura de câmera e mesma
escala relativa entre si, para o visitante comparar tamanho de relance.

## 6. Acessibilidade

- Cada cartão é um `<article>` com título em `<h3>`
- A ficha técnica usa lista de definição, com termo e descrição
- O preço não pode ser apenas visual. Deve estar em texto legível por leitor de tela
- Contraste do selo amarelo com texto preto verificado, é o único par claro da página

## 7. Critérios de aceite

1. Os três botões primários ficam na mesma altura no desktop
2. Nenhum preço é renderizado a partir de valor codificado no componente, tudo vem da
   configuração central
3. As mensagens de WhatsApp identificam corretamente cada modelo
4. Com o CDN externo indisponível, o cartão continua legível e o botão continua funcional
