# Seção 09 — Ficha técnica da EP DS3

**Componente:** `components/promo/PromoSpecs.tsx`
**Âncora:** `#ficha-tecnica`

## 1. Objetivo

Atender o comprador que compara planilhas e o técnico que valida corredor e altura. No
B2B esta seção é o documento que circula internamente entre operação, manutenção e
financeiro.

## 2. Layout

### Desktop, ≥ 1024 px

Duas colunas, container `max-w-7xl`, `gap-12`, seção com `py-28`.

- **Esquerda, 55%:** tabela de duas colunas, atributo à esquerda e valor à direita,
  linhas separadas por borda branca a 6%, linhas alternadas com fundo branco a 2%
- **Direita, 45%:** desenho técnico cotado, fixo enquanto a tabela rola, mais o bloco de
  download em vidro abaixo

### Mobile, < 768 px

Coluna única. Tabela primeiro, com atributo e valor empilhados em cada linha. Desenho
técnico depois, com toque para ampliar. Bloco de download ao final, largura total.

## 3. Copy

- **Rótulo:** Especificação
- **Título:** Ficha técnica da EP DS3
- **Apoio:** Para quem precisa validar corredor, altura e ciclo antes de aprovar a compra.

Campos da tabela, todos pendentes de preenchimento com o catálogo oficial EP:

capacidade nominal · altura de elevação · altura livre · centro de carga · comprimento e
largura dos garfos · largura do corredor de trabalho · raio de giro · tensão e capacidade
da bateria · tipo de carregador · velocidade de deslocamento com e sem carga · velocidade
de elevação · rampa máxima · peso do equipamento · tipo de rodas · grau de proteção

Os quatro valores já confirmados: capacidade 1.500 kg, elevação 3,3 metros, bateria
24V lítio, garantia da bateria 5 anos.

- **Botão primário:** Baixar catálogo técnico em PDF
- **Botão secundário:** Tirar dúvida técnica no WhatsApp
- **Mensagem:** Olá! Tenho uma dúvida técnica sobre a EP DS3.
- **Nota do bloco de download:** Ficha completa com desenho cotado, para enviar ao seu
  time de engenharia.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada dos blocos | Padrão, `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Linhas da tabela | Sem entrada individual. Uma tabela que se monta linha a linha parece defeito de carregamento |
| Hover de linha | Fundo branco a 4%, apenas no desktop |
| Desenho técnico | Fixo com `sticky` na coluna, sem animação própria |
| Ampliação no mobile | Abre em camada sobre a página, entrada em `opacity` e `scale 0.96→1`, 0.3 s |

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/promo/ds3-desenho-tecnico.webp` | Desenho cotado, vista lateral e superior, com medidas em milímetros | 1600 × 1600 | Fundo transparente, traço claro sobre fundo escuro | Desenho técnico cotado da EP DS3, vistas lateral e superior |
| `public/promo/ds3-catalogo.pdf` | Catálogo oficial EP da DS3 | — | Download direto | não se aplica |

O desenho cotado é o item que o engenheiro do cliente procura primeiro. Se o material
oficial vier com traço escuro sobre fundo branco, inverter para o tema escuro em vez de
colocar um retângulo branco no meio da página.

**Nota de produção:** as imagens de produto hoje no repositório são de referência. As
peças finais serão geradas pelo MCP do Higgsfield, ver [README](README.md).

## 6. Acessibilidade

- Tabela real com cabeçalho e escopo declarado
- O link de PDF informa formato e peso no texto acessível
- O desenho técnico tem alt descritivo e não é a única fonte das medidas, que também
  estão na tabela

## 7. Critérios de aceite

1. Sem o PDF no diretório, o botão de download não é renderizado. Link quebrado em
   página de campanha custa credibilidade
2. Toda medida presente no desenho também existe em texto na tabela
3. A tabela é legível em 360 px sem rolagem horizontal
