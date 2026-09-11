# Seção 04 — Prova de economia, lítio contra o convencional

**Componente:** `components/promo/PromoDS3Highlight.tsx`
**Âncora:** `#economia`

## 1. Objetivo

Transformar a escolha técnica em argumento financeiro e dar ao contato o material que
ele vai levar para o financeiro aprovar.

## 2. Layout

### Desktop, ≥ 1024 px

Três blocos empilhados, container `max-w-7xl`, seção com `py-28`.

1. **Cabeçalho centralizado.** Rótulo, título, apoio, largura máxima de 640 px
2. **Barras comparativas.** Bloco em vidro, `rounded-3xl`, três barras horizontais
   empilhadas com rótulo à esquerda e valor à direita
3. **Tabela de seis critérios.** Bloco em vidro com cabeçalho, quatro colunas, a coluna
   do lítio com fundo esmeralda a 5% e borda destacada
4. **Rodapé do bloco.** Nota de metodologia à esquerda e botão à direita

### Mobile, < 768 px

- Barras em largura total, rótulo acima do traço
- A tabela vira lista de seis blocos. Cada bloco tem o critério como título e as três
  opções empilhadas, com o lítio primeiro e destacado
- Não usar rolagem horizontal em tabela aqui. Seis critérios por quatro colunas em
  360 px fica ilegível mesmo com deslize

## 3. Copy

- **Rótulo:** Custo total de operação
- **Título:** O custo que não aparece na proposta
- **Apoio:** A conta de uma empilhadeira não termina no preço de compra. Ela continua
  todo mês, na energia, na manutenção e nas horas em que a máquina fica parada.

### Barras

Três barras de custo mensal de operação, ancoradas na combustão a GLP como referência
de 100%. Rótulos: EP DS3 com lítio · Chumbo-ácido · Combustão GLP.

Os valores dependem de dado real e estão pendentes. Não publicar a seção de barras com
número inventado. Enquanto não houver premissa fechada, publicar apenas a tabela.

### Tabela

| Critério | EP DS3 com lítio | Chumbo-ácido | Combustão GLP |
|---|---|---|---|
| Tempo de recarga | 2 a 3 horas, com recarga de oportunidade no intervalo | 8 a 10 horas mais o resfriamento | Troca de botijão a cada turno |
| Manutenção da fonte | Nenhuma. Sem água e sem ácido | Complemento de água semanal | Óleo, filtros, velas e correias |
| Infraestrutura exigida | Tomada comum no próprio setor | Sala dedicada e ventilada | Depósito de botijões pressurizados |
| Vida útil da fonte | Mais de 3.000 ciclos | Cerca de 1.200 ciclos | Atrelada às revisões do motor |
| Custo por turno | Somente tarifa elétrica | Tarifa elétrica mais troca de banco | Preço do GLP mais consumíveis |
| Emissões e ruído | Zero emissão, operação silenciosa | Libera hidrogênio na recarga | Gases de escape e ruído alto |

### Nota de metodologia, obrigatória junto às barras

Cálculo considera [x] turnos de [y] horas, tarifa de energia de [R$ por kWh] e GLP a
[R$ por kg]. Valores de referência, sujeitos a variação por região e por perfil de
operação.

### Ação

- **Botão:** Receber a memória de cálculo em PDF
- **Mensagem:** Olá! Quero o comparativo de ROI da EP DS3 com lítio para a minha operação.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Cabeçalho e blocos | Entrada padrão, `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Barras | Crescem da esquerda para a direita, `scaleX 0→1` com origem à esquerda, `duration 0.9`, `ease [0.16,1,0.3,1]`, escalonadas em 0.12. Disparo por `whileInView`, uma vez |
| Valor numérico da barra | Contador de 0 até o valor, sincronizado com o crescimento |
| Linhas da tabela | Sem entrada individual. O bloco inteiro entra de uma vez, para não parecer carregamento lento |
| Hover de linha | Fundo branco a 2%, apenas no desktop |

Com movimento reduzido: barras já entram na largura final, sem contador.

## 5. Imagens

Nenhuma fotografia. Nesta seção o dado é a imagem, e ilustração decorativa reduz a
credibilidade do número.

Elementos gráficos permitidos:

- Ícone de tendência de queda, 20 px, esmeralda, ao lado do título do bloco
- Ícone de confirmação em cada célula do lítio e ícone de negativa nas demais colunas
- Um orbe esmeralda a 7% com `blur-[120px]` atrás do bloco de barras

## 6. Acessibilidade

- Tabela real com `<th>` de cabeçalho e associação de escopo, não uma grade de `<div>`
- As barras têm o valor em texto ao lado, nunca só na largura do traço
- A coluna do lítio não pode se apoiar só na cor para indicar vantagem. O ícone de
  confirmação cumpre esse papel

## 7. Critérios de aceite

1. Sem as premissas preenchidas, o bloco de barras não é renderizado e a tabela sozinha
   continua fazendo sentido
2. A nota de metodologia é visível sem interação, não escondida atrás de um link
3. Em 360 px, cada critério é legível sem zoom e sem rolagem horizontal
