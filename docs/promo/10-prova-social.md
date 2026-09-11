# Seção 10 — Prova social

**Componente:** `components/promo/PromoSocialProof.tsx`
**Âncora:** `#clientes`

## 1. Objetivo

Credenciar o Grupo Venda Forte, não a EP. A marca do fabricante já se sustenta sozinha.
O que o visitante precisa saber é se pode confiar em quem vai faturar, entregar e dar
assistência.

## 2. Layout

### Desktop, ≥ 1024 px

Três blocos empilhados, container `max-w-7xl`, seção com `py-24`.

1. **Números:** quatro colunas, número grande em `text-4xl font-black` e rótulo em
   `text-xs uppercase tracking-wider`
2. **Logos:** faixa única de oito logos, `grid-cols-8`, altura uniforme de 40 px,
   espaçamento generoso
3. **Depoimento:** bloco em vidro, `max-w-3xl`, centralizado, com aspas, frase em
   `text-xl`, e assinatura com nome, cargo e empresa

### Mobile, < 768 px

- Números em duas colunas
- Logos em `grid-cols-3`, com o oitavo centralizado na última linha
- Depoimento em largura total, frase em `text-lg`

## 3. Copy

- **Rótulo:** Quem confia
- **Título:** Empresas que operam com a gente
- **Apoio:** Indústria alimentícia, cooperativa, frigorífico, varejo e transporte no Sul
  do Brasil.

### Números

Todos pendentes de confirmação, exceto os dois já registrados na empresa:

- 3 estados de atuação
- 6 pontos de atendimento
- [x] máquinas entregues
- [x] anos de mercado

Publicar apenas o que for auditável. Se apenas dois números tiverem lastro, exibir dois.
Uma linha com quatro números, dois deles inventados, é pior que uma linha com dois.

### Clientes com logo já disponível no repositório

Adami · BRF · Copacol · GT Foods · JBS · Muffato · Randon · Seara

### Depoimento

Formato: uma frase objetiva sobre o problema resolvido, seguida de nome, cargo e empresa.
Pendente de coleta e de autorização por escrito. Não publicar depoimento genérico
montado a partir de característica da empresa.

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Números | Contador de 0 até o valor, 1.6 s, disparado uma vez por `useInView`. Mesmo componente usado no hero |
| Logos | Entrada com escalonamento de 0.05, apenas `opacity 0→1`. Sem deslocamento, oito elementos subindo ao mesmo tempo cria ruído |
| Logo no hover | Sai de escala de cinza para colorido, `duration 0.3`. No mobile, sempre coloridos, já que não existe hover |
| Depoimento | Entrada padrão, `opacity 0→1`, `y 28→0` |

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/images/clients/adami.png` | Logo Adami S/A | Altura de 40 px | `object-contain`, `grayscale` fora do hover | Adami |
| `public/images/clients/brf.png` | Logo BRF | idem | idem | BRF |
| `public/images/clients/copacol.png` | Logo Copacol | idem | idem | Copacol |
| `public/images/clients/gtfoods.png` | Logo GT Foods | idem | idem | GT Foods |
| `public/images/clients/jbs.png` | Logo JBS | idem | idem | JBS |
| `public/images/clients/muffato.png` | Logo Muffato | idem | idem | Muffato |
| `public/images/clients/randon.png` | Logo Randon | idem | idem | Randon |
| `public/images/clients/seara.png` | Logo Seara | idem | idem | Seara |
| Foto do depoente | Retrato na operação, enquadramento de ombros para cima | 800 × 800 | Circular, 64 px | [Nome], [cargo] na [empresa] |

Os oito logos já existem no repositório e são reaproveitados. Em fundo escuro, logo com
fundo branco embutido precisa de tratamento. Preferir a versão monocromática branca ou
aplicar filtro de inversão controlado, nunca colar um retângulo branco.

**Sem foto real do depoente, não publicar o depoimento.** Retrato de banco de imagens em
seção de prova social derruba a credibilidade de toda a página.

## 6. Acessibilidade

- Cada logo com alt igual ao nome da empresa, sem a palavra "logo"
- Números com o rótulo associado, legível na ordem correta
- O depoimento usa `<blockquote>` com `<cite>` na assinatura

## 7. Critérios de aceite

1. Nenhum número sem lastro é publicado
2. Nenhum logo aparece sem autorização de uso registrada para peça publicitária
3. Os oito logos ficam legíveis sobre o fundo escuro, verificado um a um
4. Sem depoimento autorizado, a seção renderiza só números e logos, sem espaço vazio
