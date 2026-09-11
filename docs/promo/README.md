# Especificação da landing page de campanha — EP Equipment

Especificação de implementação da rota `/promo`, servida em `promo.grupovendaforte.com`.
Um arquivo por seção, com layout, copy, animações e imagens.

Documentos de origem: análise das páginas de produto da Apple e documento de conteúdo
(copy, microcopy e mídias). Este diretório é a fonte técnica; onde houver divergência,
vale o que está aqui.

## Ordem das seções

A ordem mudou em relação ao documento de conteúdo. As duas primeiras seções passam a
compartilhar uma única animação de produto controlada pelo scroll, e os destaques
rápidos vêm depois delas.

| # | Arquivo | Seção | Componente |
|---|---|---|---|
| 00 | [00-header.md](00-header.md) | Barra de urgência e header | `PromoHeader.tsx` |
| 01 | [01-hero.md](01-hero.md) | Hero — fase A da sequência | `PromoHero.tsx` |
| 02 | [02-veja-de-perto.md](02-veja-de-perto.md) | Veja a DS3 de perto — fase B | `PromoCloseUp.tsx` |
| — | [sequencia-scroll-produto.md](sequencia-scroll-produto.md) | Animação compartilhada 01 + 02 | `PromoProductStage.tsx` |
| 03 | [03-destaques.md](03-destaques.md) | Destaques rápidos | `PromoHighlights.tsx` |
| 04 | [04-prova-de-economia.md](04-prova-de-economia.md) | Prova de economia | `PromoDS3Highlight.tsx` |
| 05 | [05-o-que-voce-usa-hoje.md](05-o-que-voce-usa-hoje.md) | O que você usa hoje | `PromoUpgradePath.tsx` |
| 06 | [06-aplicacoes.md](06-aplicacoes.md) | Aplicações por setor | `PromoSectors.tsx` |
| 07 | [07-vitrine.md](07-vitrine.md) | Linha completa em campanha | `PromoOffersGrid.tsx` |
| 08 | [08-por-que-venda-forte.md](08-por-que-venda-forte.md) | Por que fechar conosco | `PromoWhyUs.tsx` |
| 09 | [09-ficha-tecnica.md](09-ficha-tecnica.md) | Ficha técnica | `PromoSpecs.tsx` |
| 10 | [10-prova-social.md](10-prova-social.md) | Prova social | `PromoSocialProof.tsx` |
| 11 | [11-time-comercial.md](11-time-comercial.md) | Time comercial | `PromoSalesTeam.tsx` |
| 12 | [12-cotacao.md](12-cotacao.md) | Cotação expressa | `PromoQuoteForm.tsx` |
| 13 | [13-faq.md](13-faq.md) | FAQ | `PromoFAQ.tsx` |
| 14 | [14-rodape.md](14-rodape.md) | Rodapé e notas | `PromoFooter.tsx` |

## Dados reais da empresa

Confirmados em `INFORMACOES-REAIS.md` e no uso do site principal. Use estes valores,
não invente variação.

- **WhatsApp comercial:** `5549988395635`, exibido como (49) 98839-5635
- **Telefones:** Chapecó (49) 3323-9050 · Joinville (47) 3842-3333
- **E-mail:** comercial@grupovendaforte.com
- **Matriz:** Chapecó, SC
- **Pontos de atendimento:** Chapecó, Itajaí, Joinville, Maringá, Seberi, Esteio
- **Cobertura:** Sul do Brasil, três estados, seis pontos de atendimento
- **CEO:** Rodrigo Schilke
- **Clientes com logo já no repositório:** Adami, BRF, Copacol, GT Foods, JBS, Muffato,
  Randon, Seara, em `public/images/clients/`

## Pendências que bloqueiam publicação

1. **Número de WhatsApp.** Os componentes de `components/promo/` usam o placeholder
   `5511999999999`. Trocar por `5549988395635` em `components/promo/promo.config.ts`.
2. **Conflito de cobertura.** A página promocional afirma atendimento nacional e região
   Sudeste. O dado real da empresa é Sul do Brasil, três estados. Definir com o cliente
   se a campanha vende cobertura nacional. Até a definição, a copy destes arquivos usa
   a cobertura regional.
3. **Nomes dos consultores.** Dois dos três cards usam cargo genérico.
4. **Premissas do cálculo de economia.** Turnos por dia, tarifa de energia e preço do GLP.
5. **Ficha técnica e catálogo em PDF** da DS3, a partir do material oficial EP.
6. **Autorização de uso** dos logos de clientes na peça de campanha.

## Tokens compartilhados

### Cor

| Token | Valor | Uso |
|---|---|---|
| Fundo | `#05070B` | Fundo de todas as seções |
| Vermelho EP | `#DC2626` | Ação primária, destaque de marca |
| Rosa EP | `#E11D48` | Gradiente de apoio |
| Laranja industrial | `#EA580C` | Rótulo de seção, ícone |
| Laranja claro | `#F97316` | Gradiente de apoio |
| Âmbar | `#FBBF24` | Início de gradiente em título |
| Esmeralda | `#10B981` | Exclusivo de WhatsApp e confirmação |
| Texto primário | `#FFFFFF` | Título |
| Texto secundário | `neutral-400` | Corpo |
| Texto terciário | `neutral-500` | Rótulo, legenda |

Regra: verde esmeralda é reservado para ação de WhatsApp e estado de sucesso. Não usar
como cor decorativa, senão o botão de conversão perde destaque.

### Superfície

- Vidro: `bg-white/[0.03] border border-white/10 backdrop-blur-xl`
- Vidro em destaque: `bg-gradient-to-b from-white/[0.06] to-white/[0.02]`
- Raio: `rounded-2xl` em card interno, `rounded-3xl` em bloco de seção
- Orbe volumétrico: `blur-[120px]`, opacidade de 7% a 25%, nunca sobre texto

### Movimento

| Token | Valor |
|---|---|
| Entrada padrão | `opacity 0→1`, `y 24→0`, `duration 0.5`, `ease "easeOut"` |
| Escalonamento | `staggerChildren` de 0.08 a 0.12 |
| Gatilho de viewport | `{ once: true, margin: "-80px" }` |
| Hover de card | `y: -8`, `duration 0.4` |
| Flutuação de produto | `y: [0,-14,0]`, `duration 7`, `repeat: Infinity` |
| Transição de cor | `transition-colors duration-300` via CSS |

Toda seção respeita `useReducedMotion()`. Com movimento reduzido: sem flutuação, sem
sequência de scroll, sem parallax. As entradas viram aparição imediata.

### Grade

- Container: `max-w-7xl mx-auto px-6 lg:px-8`
- Espaçamento vertical de seção: `py-28` no desktop, `py-20` no mobile
- Breakpoints Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280

### Imagem

- Diretório: `public/promo/`
- Formato: WebP para foto, PNG com transparência para recorte de produto, MP4 H.264 para vídeo
- Todo `next/image` com `fill` recebe `sizes`
- Imagem acima da dobra usa `preload`. O prop `priority` foi descontinuado no Next 16
- Nenhum `quality` customizado sem antes declarar o valor em `images.qualities` no
  `next.config.ts`, senão a otimização falha em produção

## Produção de mídia

Todas as imagens e vídeos de produto hoje no repositório são **referência**, não peça
final. Isso inclui `hero-ds3.png`, `bg-dark.png` e as fotos de produto servidas pelo CDN
`cdn.ep-portal.net`.

As peças finais serão geradas pelo **MCP do Higgsfield**, já configurado em
`.agents/mcp_config.json` apontando para `https://mcp.higgsfield.ai/mcp`.

Consequências para a implementação:

- As dimensões e nomes de arquivo das tabelas de imagem de cada seção são o alvo de
  geração, não a descrição do que existe hoje
- A sequência de frames de `public/promo/sequencia/` é integralmente pendente de geração
- Todo componente precisa funcionar com o arquivo ausente, sem espaço vazio e sem erro
  no console, porque a substituição vai acontecer em lotes
- Foto de cliente, retrato de consultor e logo de cliente ficam fora do escopo de
  geração. São material real e não podem ser sintetizados

## Identidade visual

A paleta, a tipografia, os botões e o tom de voz da marca estão em
[identidade-visual.md](identidade-visual.md), extraídos do site principal deste projeto.
Onde este README e aquele documento divergirem, vale a identidade da marca.
