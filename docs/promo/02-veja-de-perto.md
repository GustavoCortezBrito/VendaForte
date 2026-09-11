# Seção 02 — Veja a DS3 de perto, fase B da sequência

**Componente:** `components/promo/PromoCloseUp.tsx`
**Palco compartilhado:** ver [sequencia-scroll-produto.md](sequencia-scroll-produto.md)
**Faixa de progresso:** 0.34 a 1.00
**Âncora:** `#ds3`

## 1. Objetivo

Substituir o "ver a máquina pessoalmente", que é o maior atrito da venda de equipamento
pesado, e levar quem já está convencido para a demonstração.

## 2. Layout

### Desktop, ≥ 1024 px

Continua no palco fixo herdado da seção 01. O produto migra para a esquerda e ocupa 55%
da largura. A coluna direita, com 45%, recebe:

- Rótulo de seção e título, fixos durante toda a fase
- Área de legenda com 220 px de altura mínima, onde os cinco pontos se sucedem no mesmo
  lugar, sem empurrar o layout
- Indicador de progresso vertical com cinco marcas, a ativa em laranja
- Botão de demonstração, visível durante toda a fase

A altura da área de legenda é reservada pelo texto mais longo, para não haver
deslocamento na troca.

### Mobile, < 768 px

Seção normal, sem palco fixo. Carrossel horizontal com deslize, um cartão por ponto,
foto de detalhe acima e texto abaixo, indicador de posição em pontos. Botão de
demonstração abaixo do carrossel, em largura total.

## 3. Copy

- **Rótulo:** Detalhe construtivo
- **Título:** Conheça a DS3 por dentro
- **Apoio:** Cinco pontos que fazem diferença no turno.

Pontos, na ordem da sequência:

1. **Timão de comando.** Aceleração progressiva e botões de elevação ao alcance do
   polegar. Reduz fadiga em jornada longa.
2. **Bateria de lítio 24V.** Removível, com conector rápido. Aceita carga parcial em
   qualquer intervalo, sem efeito memória.
3. **Patolas.** Estabilidade para carga elevada sem exigir contrapeso, o que mantém a
   máquina compacta.
4. **Mastro.** Elevação até 3,3 metros com visibilidade frontal preservada para o
   posicionamento do pallet.
5. **Rodas e chassi.** Construção para piso industrial e giro em corredor estreito.

- **Botão:** Agendar demonstração na minha operação
- **Mensagem de WhatsApp:** Olá! Quero agendar uma demonstração da EP DS3 na minha operação.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Troca de legenda | `opacity 0→1`, `x -16→0`, `duration 0.4`. A anterior sai em 0.25 s antes da entrada da seguinte, com sobreposição de 0.02 do progresso |
| Marcas do indicador | A ativa cresce de 4 para 8 px de altura e muda para laranja, `duration 0.3` |
| Produto | Frames 40 a 71, com o mastro subindo, conforme a tabela do documento do palco |
| Saída da fase | Faixa 0.92 a 1.00: escala volta a 1.0 e o palco desvanece, liberando a rolagem |
| Carrossel mobile | Deslize nativo com `scroll-snap-type: x mandatory` e `scroll-snap-align: center`. Sem JavaScript de arrasto |

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/promo/sequencia/ds3-040.webp` a `ds3-071.webp` | Frames da fase B, com elevação do mastro | 1600 × 1600 | Desenhados no canvas | ver documento do palco |
| `public/promo/detalhe-timao.webp` | Close do timão de comando com a mão do operador | 1200 × 900 | `object-cover`, cantos arredondados | Timão de comando da EP DS3 com os botões de elevação |
| `public/promo/detalhe-bateria.webp` | Bateria de lítio 24V removida do compartimento | 1200 × 900 | idem | Bateria de lítio de 24V removível da EP DS3 |
| `public/promo/detalhe-patolas.webp` | Patolas apoiadas, vista frontal baixa | 1200 × 900 | idem | Patolas de estabilização da EP DS3 |
| `public/promo/detalhe-mastro.webp` | Mastro elevado com pallet no terceiro nível | 1200 × 900 | idem | Mastro da EP DS3 elevando um pallet a 3,3 metros |
| `public/promo/detalhe-rodas.webp` | Rodas e chassi em piso industrial | 1200 × 900 | idem | Rodas e chassi da EP DS3 em piso industrial |
| `public/promo/ds3-operacao.mp4` | Ciclo completo de pegar, elevar e depositar o pallet, sem trilha | 1920 × 1080, alvo de 4 MB | Carregado sob demanda, sem reprodução automática | não se aplica |

As cinco fotos de detalhe são obrigatórias no mobile, onde substituem a sequência de
frames. No desktop elas são opcionais e servem de reforço ao lado da legenda.

## 6. Acessibilidade

- Os cinco pontos existem em uma lista presente no DOM desde o início. A animação
  controla apenas opacidade e posição, nunca a montagem do elemento
- O indicador de progresso é decorativo e fica oculto para leitor de tela
- No mobile o carrossel é navegável por teclado, com os cartões na ordem de foco
- Nenhuma informação existe somente dentro do canvas

## 7. Critérios de aceite

1. A área de legenda não muda de altura ao trocar de ponto
2. Rolando rápido, nenhuma legenda fica presa em estado intermediário
3. No mobile, os cinco pontos são alcançáveis por deslize e por teclado
4. Com movimento reduzido, os cinco pontos aparecem empilhados e todos visíveis
