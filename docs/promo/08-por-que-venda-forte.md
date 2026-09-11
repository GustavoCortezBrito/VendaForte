# Seção 08 — Por que fechar com o Grupo Venda Forte

**Componente:** `components/promo/PromoWhyUs.tsx`
**Âncora:** `#por-que-nos`

## 1. Objetivo

Remover o atrito comercial. É a seção que a Apple repete em todas as páginas de produto
analisadas e a que mais faltava na nossa. Aqui não se vende a máquina, se vende o
fornecedor.

## 2. Layout

### Desktop, ≥ 1024 px

Bloco em vidro, container `max-w-7xl`, seção com `py-28`.

- Cabeçalho à esquerda, ocupando um terço, com rótulo, título, apoio e botão
- Grade de sete itens à direita, ocupando dois terços, em `grid-cols-2`
- O sétimo item, a demonstração, ocupa as duas colunas e recebe fundo levemente mais
  claro, por ser o de maior valor comercial

Cada item: ícone de traço fino em laranja, 20 px, título em `text-sm font-bold`, apoio em
`text-xs text-neutral-500`.

### Mobile, < 768 px

Cabeçalho acima, itens em coluna única, `gap-3`. Botão ao final, largura total.

## 3. Copy

- **Rótulo:** O fornecedor
- **Título:** Por que fechar com o Grupo Venda Forte
- **Apoio:** Importação, distribuição, peças e assistência técnica na mesma empresa.
  Matriz em Chapecó e seis pontos de atendimento no Sul do Brasil.

Itens:

1. **Representante oficial EP.** Garantia de fábrica, não de importação paralela.
2. **Faturamento direto para CNPJ.** Nota fiscal, crédito de impostos e contrato formal.
3. **BNDES, Finame e leasing.** Até 60 vezes, com apoio do nosso consultor na documentação.
4. **Pronta entrega com seguro.** Despacho por transportadora especializada em maquinário.
5. **Peças multimarcas em estoque.** Reposição sem espera de importação.
6. **Assistência técnica própria.** Equipe especializada, preventiva e corretiva.
7. **Demonstração na sua operação.** Validamos corredor, altura e ciclo antes de você
   fechar o pedido.

- **Botão:** Agendar demonstração
- **Mensagem:** Olá! Quero agendar uma demonstração da EP DS3 na minha operação.

### Faixa de presença, abaixo dos itens

Chapecó · Itajaí · Joinville · Maringá · Seberi · Esteio

Precedida do rótulo: Pontos de atendimento.

**Atenção:** a cobertura declarada aqui é regional, conforme o dado real da empresa. A
página promocional hoje afirma atendimento nacional em outros pontos. Uniformizar antes
de publicar, ver pendência 2 no [README](README.md).

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Cabeçalho | Entrada padrão, `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Itens | Escalonamento de 0.06. Com sete itens, um escalonamento maior faz a seção parecer lenta |
| Hover do item | Borda passa de branco a 10% para laranja a 30%, `transition-colors` de 300 ms. Sem deslocamento |
| Faixa de cidades | Entrada única, sem escalonamento por cidade |

## 5. Imagens

Nenhuma fotografia. Sete ícones de traço fino, 20 px, em laranja industrial.

Ícones sugeridos, na ordem: selo de verificação, documento fiscal, banco ou cifrão,
caminhão, caixa de peças, chave de boca, calendário.

A seção é de leitura rápida. Densidade visual atrapalha e foto de fachada não acrescenta
argumento comercial.

Único elemento gráfico: um orbe laranja a 8% com `blur-[120px]` atrás do cabeçalho.

## 6. Acessibilidade

- Lista real, com `<ul>` e `<li>`, não uma grade de `<div>`
- Ícones decorativos, ocultos para leitor de tela
- A faixa de cidades é texto, nunca imagem

## 7. Critérios de aceite

1. Os sete itens cabem sem rolagem interna em uma tela de 1366 × 768
2. A cobertura declarada é a mesma em toda a página, sem contradição entre seções
3. O item de demonstração é visualmente o mais proeminente dos sete
