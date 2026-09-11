# Seção 13 — FAQ

**Componente:** `components/promo/PromoFAQ.tsx`
**Âncora:** `#faq`

## 1. Objetivo

Quebrar as objeções que sobraram. A Apple resolve isso em notas de rodapé porque o
comprador dela decide sozinho. No B2B a pergunta precisa estar escrita com todas as
letras, porque quem lê vai repetir a resposta para outra pessoa dentro da empresa.

## 2. Layout

### Desktop, ≥ 1024 px

Coluna única centralizada, container `max-w-4xl`, seção com `py-24`.

Cada item em vidro, `rounded-2xl`. Cabeçalho clicável com pergunta à esquerda e seta à
direita. O item aberto recebe borda vermelha a 25% e fundo levemente mais claro. Resposta
separada por borda superior sutil.

Ao final, bloco de última conversão: texto à esquerda e botão à direita.

### Mobile, < 768 px

Mesmo layout, `p-5` no cabeçalho, pergunta em `text-base`.

## 3. Copy

- **Selo:** Tire suas dúvidas
- **Título:** Perguntas frequentes

1. **Como funciona a entrega das empilhadeiras e paleteiras?**
   Trabalhamos com pronta entrega para os modelos em campanha. O despacho é feito por
   transportadoras especializadas em maquinário pesado, com seguro total da carga.

2. **Como funciona a garantia da bateria de lítio?**
   A tecnologia de íon-lítio da EP Equipment tem até 5 anos de garantia de fábrica na
   bateria. Não exige água desmineralizada nem manutenção de ácido, e entrega vida útil
   acima de 3.000 ciclos com recarga de oportunidade.

3. **Quais são as condições de financiamento?**
   Faturamos direto para pessoa jurídica com linhas BNDES Finame, parcelamento bancário
   em até 60 vezes e leasing. Para a linha de paleteiras também há condição no cartão de
   crédito em até 12 vezes.

4. **Vocês fornecem assistência técnica e peças?**
   Sim. Somos representantes oficiais da EP Equipment, com estoque de peças multimarcas
   e equipe técnica especializada em manutenção preventiva e corretiva.

5. **Consigo testar o equipamento antes de fechar?**
   Sim. Agendamos demonstração técnica na sua operação para validar altura de elevação,
   largura de corredor e ciclo de trabalho antes do pedido.

6. **A bateria de lítio funciona em câmara fria?**
   Sim. A bateria de lítio mantém desempenho em baixa temperatura, situação em que o
   chumbo-ácido perde capacidade de forma acentuada. Confirme a faixa exata com o
   consultor técnico conforme a temperatura da sua câmara.

7. **Preciso de instalação elétrica especial para carregar?**
   Não. A DS3 recarrega em tomada comum no próprio setor, o que dispensa a sala de
   baterias exigida pelo chumbo-ácido. Confirme a bitola e o ponto disponível com o
   nosso técnico.

- **Fechamento:** Ficou alguma dúvida sobre modelo, prazo ou financiamento? Um consultor
  responde em minutos.
- **Botão:** Falar com um consultor
- **Mensagem:** Olá! Tenho uma dúvida sobre os equipamentos da campanha promocional.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Abertura | Altura de 0 para automática e `opacity 0→1`, `duration 0.35`, `ease "easeOut"`, com `AnimatePresence` |
| Fechamento | Mesma transição invertida. O contêiner mantém `overflow-hidden` durante toda a animação |
| Seta | Rotação de 180 graus e mudança para vermelho, 300 ms |
| Entrada dos itens | Escalonamento leve, `opacity 0→1`, `y 24→0` |

O primeiro item começa aberto. Um acordeão totalmente fechado parece seção vazia.

Com movimento reduzido: abre e fecha sem transição de altura.

## 5. Imagens

Nenhuma. Um orbe vermelho a 7% com `blur-[120px]` atrás da coluna, e o ícone de
interrogação no selo da seção.

## 6. Acessibilidade

- Cada cabeçalho é um `<button>` real, com estado expandido declarado e referência ao
  painel que controla
- O painel referencia de volta o botão que o controla
- Navegação por teclado abre e fecha com Enter e Espaço
- A resposta permanece no DOM quando fechada, ou, se removida, o conteúdo precisa estar
  disponível para indexação por outro meio

## 7. SEO

Marcar as sete perguntas com dados estruturados de FAQ em JSON-LD, no próprio componente
ou no layout da rota. A campanha recebe tráfego pago, mas a página também é indexável e
esse trecho costuma render resultado enriquecido.

## 8. Critérios de aceite

1. Abrir e fechar rapidamente não deixa item preso em altura intermediária
2. Todas as sete respostas são alcançáveis por teclado
3. O JSON-LD valida no teste de resultados enriquecidos do Google
