# Seção 11 — Time comercial

**Componente:** `components/promo/PromoSalesTeam.tsx`
**Âncora:** `#vendedores`
**Fonte de dados:** `components/promo/promo.config.ts`, constante `SALES_TEAM`

## 1. Objetivo

Dar rosto e canal direto ao atendimento. Equivale ao atendimento guiado e ao agendamento
de demonstração da Apple, em versão mais pessoal, que é o que funciona no B2B brasileiro.

## 2. Layout

### Desktop, ≥ 768 px

Três cartões em `grid-cols-3`, `gap-8`, container `max-w-7xl`, seção com `py-28`.

Cada cartão, em vidro com gradiente vertical, `rounded-3xl`, `p-8`:

1. Linha superior: retrato circular de 56 px à esquerda, selo de disponibilidade à direita
2. Nome em `text-xl font-bold`
3. Função, na cor de acento do cartão
4. Região em `text-xs text-neutral-400`
5. Bloco separado por borda: especialidade e telefone, com ícone
6. Botão de WhatsApp em esmeralda, largura total, ancorado na base

Cada cartão tem uma cor de acento: vermelho, laranja e esmeralda. As classes precisam ser
completas no código, o Tailwind não resolve nome de classe montado em tempo de execução.

### Mobile, < 768 px

Coluna única, `gap-6`. Mesma ordem interna.

## 3. Copy

- **Selo de seção:** Canal direto com especialistas
- **Título:** Fale direto com quem entende de empilhadeira
- **Apoio:** Escolha o consultor da sua necessidade e receba uma proposta técnica no
  mesmo dia útil.

### Cartão 1

Rodrigo Schilke · Gestão comercial e grandes frotas · Atendimento corporativo no Sul do
Brasil · Especialidade: contratos de frota e locação

### Cartão 2

[Nome pendente] · Linha elétrica e armazenagem vertical · Chapecó, Itajaí e Joinville ·
Especialidade: dimensionamento da DS3 e da F4

### Cartão 3

[Nome pendente] · Faturamento CNPJ, leasing e Finame · Maringá, Seberi e Esteio ·
Especialidade: simulação BNDES em até 60x

As regiões acima foram corrigidas para os pontos de atendimento reais. A versão anterior
citava São Paulo e região Sudeste, que não corresponde à operação da empresa.

### Comum

- **Selo de disponibilidade:** Online agora
- **Botão:** Conversar no WhatsApp
- **Mensagem:** Olá, [nome]! Vim pela campanha promocional da EP Equipment e gostaria de
  atendimento sobre as máquinas em oferta.
- **Selo de rodapé:** Atendimento B2B com catálogo técnico e cotação formal em PDF
  enviados no mesmo dia útil.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada dos cartões | Escalonamento de 0.12, `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Selo de disponibilidade | Ponto duplo em esmeralda: um estático e um em expansão contínua por trás, criando o pulso |
| Hover do cartão | `y: -8`, `duration 0.4`, mais brilho esmeralda surgindo acima do cartão |
| Borda no hover | Muda para a cor de acento do cartão a 40% |

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/promo/consultor-rodrigo.webp` | Retrato de Rodrigo Schilke | 800 × 800 | Circular, 56 px, `object-cover` | Rodrigo Schilke, gestão comercial do Grupo Venda Forte |
| `public/promo/consultor-tecnico.webp` | Retrato do consultor técnico | 800 × 800 | idem | [Nome], consultor técnico |
| `public/promo/consultor-financiamento.webp` | Retrato do consultor de financiamento | 800 × 800 | idem | [Nome], consultor de financiamento |

Diretriz de produção: enquadramento de ombros para cima, fundo escuro uniforme,
iluminação lateral suave, mesma distância de câmera nos três. Foto real converte mais que
inicial em círculo.

Enquanto não houver retrato, manter as iniciais sobre fundo da cor de acento. Não usar
avatar ilustrado nem foto de banco de imagens, pela mesma razão da seção de prova social.

## 6. Acessibilidade

- O selo de disponibilidade não pode ser apenas cor. O texto "Online agora" é obrigatório
- Se a disponibilidade passar a ser calculada por horário comercial, o estado precisa ser
  definido depois da montagem no cliente, para não divergir do que foi renderizado no
  servidor
- Telefone como link de discagem no mobile

## 7. Critérios de aceite

1. As três regiões correspondem aos pontos de atendimento reais da empresa
2. A mensagem de WhatsApp traz o nome do consultor correto
3. As cores de acento estão escritas por extenso no código, sem montagem dinâmica
4. Com movimento reduzido, o pulso do selo para, e o texto permanece
