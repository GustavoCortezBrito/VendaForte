# Seção 12 — Cotação expressa

**Componente:** `components/promo/PromoQuoteForm.tsx`
**Âncora:** `#cotacao`

## 1. Objetivo

Capturar quem não quer iniciar conversa sem contexto, e entregar ao consultor um lead já
qualificado por modelo, quantidade e prazo.

## 2. Layout

### Desktop, ≥ 1024 px

Bloco único em vidro, `rounded-3xl`, container `max-w-5xl`, `p-12`, seção com `py-28`.

1. Cabeçalho centralizado, `max-w-2xl`
2. Dois campos por linha: nome e WhatsApp, depois empresa e modelo
3. Três grupos de seleção em fileira de etiquetas: quantidade, prazo, consultor
4. Prévia da mensagem, em bloco escuro com borda
5. Botão primário em largura total
6. Linha de segurança abaixo do botão

### Mobile, < 768 px

Um campo por linha. Grupos de etiquetas quebram em várias linhas, com `gap-2`. Prévia da
mensagem com altura máxima de 176 px e rolagem interna.

## 3. Copy

- **Rótulo:** Proposta expressa
- **Título:** Receba uma cotação em minutos
- **Apoio:** Preencha os dados e enviamos a proposta em PDF com o valor de lote e a
  disponibilidade de pronta entrega.

| Campo | Rótulo | Texto de exemplo |
|---|---|---|
| Nome | Seu nome completo | Ex.: Carlos Silva |
| Telefone | WhatsApp com DDD | (49) 99999-9999 |
| Empresa | Empresa ou cidade | Ex.: Logística ABC, Chapecó |
| Modelo | Modelo de maior interesse | Lista com DS3, F4, EFL302 e consultoria de frota |
| Quantidade | Quantidade estimada | 1 unidade · 2 a 4 unidades · 5 ou mais |
| Prazo | Prazo de compra | Imediato · Em até 30 dias · Levantando orçamento |
| Consultor | Consultor que vai atender | Os três consultores da seção 11 |

- **Botão:** Solicitar proposta formal em PDF
- **Rótulo da prévia:** Prévia da mensagem enviada
- **Linha de segurança:** A conversa abre direto no WhatsApp do consultor. Sem cadastro e
  sem compromisso.
- **Sucesso:** Proposta enviada para [nome do consultor]. A conversa abriu no WhatsApp com
  a sua solicitação já preenchida. Se nada aconteceu, clique aqui para abrir.
- **Voltar:** Editar os dados e enviar de novo

### Mensagem montada

```
*Solicitação de proposta — Campanha EP Equipment*

*Nome:* [nome]
*Empresa / cidade:* [empresa ou "não informado"]
*WhatsApp:* [telefone]
*Modelo de interesse:* [modelo]
*Quantidade:* [quantidade]
*Prazo de compra:* [prazo]

Por favor, envie a proposta formal em PDF com preço de lote, prazo de entrega e
simulação de financiamento BNDES/Finame.
```

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada do bloco | Padrão, `opacity 0→1`, `y 28→0`, `duration 0.5` |
| Etiqueta selecionada | Borda, fundo e sombra em transição de 200 ms. Sem deslocamento |
| Prévia da mensagem | Atualiza a cada tecla, sem animação. Texto que anima a cada caractere fica ilegível |
| Botão | Escala 0.99 ao pressionar. Desabilitado enquanto inválido, com 40% de opacidade |
| Estado de sucesso | Troca por `AnimatePresence`, entrada em `opacity` e `y 8→0` |

## 5. Imagens

Nenhuma imagem. O bloco se sustenta em vidro sobre o fundo escuro, com dois orbes de
`blur-[120px]`, vermelho à esquerda e laranja à direita, ambos a 10%.

Ícones: documento no rótulo da prévia, avião de papel no botão, marca de confirmação no
estado de sucesso.

## 6. Comportamento

- Validação mínima: nome com mais de dois caracteres e telefone com pelo menos dez
  dígitos. Antes disso o botão fica desabilitado
- Máscara de telefone aplicada durante a digitação, aceitando fixo e celular
- A janela do WhatsApp abre dentro do gesto de clique, nunca dentro de um temporizador,
  senão o bloqueador de pop-up barra
- O estado de sucesso guarda o link, para o visitante reabrir se a janela foi bloqueada

## 7. Acessibilidade

- Todo campo tem rótulo associado por identificador, não apenas texto de exemplo
- Os grupos de etiquetas declaram o estado pressionado
- A prévia da mensagem é uma região viva educada, para o leitor de tela anunciar a
  atualização sem interromper a digitação
- Ordem de foco igual à ordem visual

## 8. Critérios de aceite

1. Com bloqueador de pop-up ativo, o visitante consegue chegar ao WhatsApp pelo link de
   recuperação
2. A prévia mostra exatamente o texto que será enviado, sem diferença de formatação
3. O formulário é preenchível inteiramente por teclado
4. O número de destino é o do consultor escolhido, não um número fixo
