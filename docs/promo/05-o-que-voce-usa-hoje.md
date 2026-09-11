# Seção 05 — O que você usa hoje

**Componente:** `components/promo/PromoUpgradePath.tsx`
**Âncora:** `#trocar`
**Prioridade:** máxima. É a seção de maior impacto identificada na análise

## 1. Objetivo

Personalizar o ganho para a realidade do visitante e qualificar o lead antes do primeiro
contato. O visitante se declara, a página responde, e essa declaração viaja junto na
mensagem de WhatsApp.

## 2. Layout

### Desktop, ≥ 1024 px

Bloco único em vidro, `rounded-3xl`, container `max-w-5xl`, seção com `py-28`.

- **Topo:** rótulo, título e apoio, centralizados
- **Seletor:** quatro botões lado a lado, `grid-cols-4`, `gap-3`. O ativo recebe borda
  laranja, fundo em gradiente vermelho para laranja a 25% e sombra
- **Painel:** grade de dois por dois com os quatro ganhos, cada um com ícone de
  confirmação, título curto em branco e uma linha de apoio em cinza
- **Rodapé do painel:** botão de ação em largura total

Altura mínima do painel fixada pelo conteúdo mais alto, para a página não pular ao
trocar de opção.

### Mobile, < 768 px

- Seletor vira lista rolável na horizontal, com `scroll-snap`, o ativo centralizado
- Painel em coluna única, quatro ganhos empilhados
- Botão em largura total, fixo ao final do painel

## 3. Copy

- **Rótulo:** Caminho de troca
- **Título:** Nunca foi tão fácil trocar
- **Apoio:** Selecione o que a sua operação usa hoje e veja o que muda com a DS3.

### Opção 1, Paleteira manual

1. Elimina o esforço físico e o afastamento por lesão de esforço repetitivo.
2. Verticaliza até 3,3 metros, o que a paleteira manual não faz.
3. Multiplica a quantidade de pallets movimentados por hora.
4. Libera o operador para tarefas de maior valor no armazém.

### Opção 2, Empilhadeira chumbo-ácido

1. Recarrega em 2 a 3 horas contra 8 a 10 horas, com recarga de oportunidade.
2. Libera a sala de baterias e devolve essa área para a operação.
3. Acaba a manutenção semanal de água e o risco de vazamento de ácido.
4. Mais de 3.000 ciclos de vida útil contra cerca de 1.200.

### Opção 3, Combustão a GLP

1. Troca o custo do GLP pela tarifa elétrica, que é estável e previsível.
2. Zero emissão, o que libera a operação em ambiente fechado e em câmara fria.
3. Fim das revisões de óleo, filtros, velas e correias.
4. Operação silenciosa, com ganho direto em turno noturno e em varejo.

### Opção 4, Locação mensal

1. A parcela do BNDES no lugar do aluguel, com o ativo no seu balanço ao fim.
2. Sem reajuste anual de contrato de locação.
3. Garantia de fábrica de até 5 anos na bateria.
4. Simulação comparando a sua mensalidade atual com a parcela em até 60x.

### Ação

- **Botão:** Simular a troca para a minha operação
- **Mensagem:** Olá! Hoje a minha operação usa [opção selecionada] e quero simular a
  troca para a EP DS3.

A opção selecionada entra na mensagem. É isso que transforma a seção em qualificação.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Troca de painel | Saída em `opacity 1→0`, `y 0→8`, 0.2 s. Entrada em `opacity 0→1`, `y 8→0`, 0.3 s. Usar `AnimatePresence` com `mode="wait"` |
| Ganhos do painel | Escalonamento de 0.06 entre os quatro, entrada em `opacity` e `x -12→0` |
| Botão do seletor | Fundo e borda em `transition-all` de 200 ms. Sem deslocamento no hover, para não parecer clique |
| Entrada da seção | Bloco inteiro em `opacity 0→1`, `y 28→0`, `duration 0.5` |

Com movimento reduzido: a troca de painel é instantânea, sem transição.

## 5. Imagens

Nenhuma fotografia. Um ícone de traço fino por opção do seletor, 18 px, herdando a cor
do estado.

Ícones sugeridos: paleteira manual, bateria, botijão de gás, calendário.

## 6. Acessibilidade

- O seletor é um grupo de botões com estado pressionado declarado, não um conjunto de
  `<div>` clicáveis
- Navegação por seta esquerda e direita dentro do grupo
- A troca de painel anuncia a mudança para leitor de tela por região viva educada
- O painel inativo é removido do DOM, não apenas ocultado, para não poluir a leitura

## 7. Critérios de aceite

1. A altura do bloco não muda ao alternar entre as quatro opções
2. A opção escolhida aparece corretamente na mensagem de WhatsApp
3. Navegação completa por teclado, incluindo a troca de opção
4. Ao carregar a página, a primeira opção já vem selecionada e o painel preenchido
