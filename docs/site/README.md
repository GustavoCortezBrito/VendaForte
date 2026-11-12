# Visual do site: guia de design

O site público do Grupo Venda Forte segue o visual da campanha `/promo` (a página da DS3). Este guia
registra as regras, as peças e o caminho das imagens e vídeos, para qualquer seção nova nascer igual
às que já existem. A campanha em si está documentada em `docs/promo/`.

O painel `/admin` também segue este guia desde 12/11/2026 (seção 16): mesmo fundo escuro, mesmas peças e o mesmo cabeçalho de cápsula.

## 1. Princípios

1. **A /promo é a referência.** Fundo escuro, vermelho da marca como único acento, títulos grandes e
   apertados, cartões de canto bem redondo, botões em pílula.
2. **Pouca informação por tela.** Cada seção tem uma ideia, um título, no máximo uma frase de apoio e
   poucos itens à vista. O que sobra vai para "ver mais", uma fileira horizontal ou uma página própria.
3. **Movimento com função.** O movimento mostra a máquina, a fachada ou a entrada de um bloco. Nada
   gira, pula ou pulsa por enfeite, e tudo para quando o sistema pede movimento reduzido.
4. **Nada inventado.** Texto, número e foto vêm da empresa. Imagem gerada ou ampliada por IA é
   conferida antes de entrar (ver seção 6).
5. **Velocidade é parte do design.** A primeira imagem da página carrega com prioridade, vídeo nunca
   bloqueia a página e o celular recebe menos peso.

## 2. Cores

| Uso | Valor | Classe |
|---|---|---|
| Fundo da página | `#0D0D0D` | `bg-ink` |
| Cartão e painel | `#151515` | `bg-ink-raised` |
| Linha entre seções | branco a 6% | `border-white/[0.06]` |
| Borda de cartão | branco a 10% (25% no hover) | `border-white/10`, `hover:border-white/25` |
| Título | branco | `text-white` |
| Texto de apoio | `#A3A3A3` | `text-neutral-400` |
| Texto secundário | `#737373` | `text-neutral-500` |
| Acento (rótulo, ícone, destaque no título) | `#EF4444` | `text-red-500` |
| Botão principal | `#DC2626`, hover `#B91C1C` | `bg-red-600 hover:bg-red-700` |
| WhatsApp (só WhatsApp) | `#16A34A`, hover `#22C55E` | `bg-green-600 hover:bg-green-500` |

Não usar: degradê em botão, sombra colorida, outra cor de acento, verde fora do WhatsApp.

Fotos de produto do catálogo são recortes de fundo branco desenhados com `mix-blend-mode: multiply`.
O quadro da foto precisa ser `bg-white`; num quadro escuro o produto some.

## 3. Tipografia

Fonte: a do sistema (a mesma da /promo). Pesos: 400 texto, 500 e 600 rótulos e botões, 700 títulos.
Sem caixa alta e sem espaçamento largo em rótulos.

| Papel | Classes |
|---|---|
| Título de abertura (h1) | `text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-[-0.045em]` |
| Título de seção (h2) | `TITLE`: `text-4xl lg:text-5xl font-bold leading-[1.04] tracking-[-0.035em]` |
| Título de cartão (h3) | `text-lg` ou `text-xl font-semibold tracking-tight` |
| Rótulo acima do título | `EYEBROW`: `text-sm font-semibold text-red-500` |
| Frase de apoio | `LEAD`: `text-lg leading-relaxed text-neutral-400` |
| Número grande | `text-5xl font-bold tracking-[-0.045em]` |

## 4. Peças

Tudo em `components/site/styles.ts` (classes, valem em servidor e cliente) e
`components/site/PageHeader.tsx` (abertura das páginas internas). Em componentes de cliente,
`components/promo/ui.tsx` dá `Reveal` (entrada ao rolar), `WhatsAppLink`, `Shot` e `EASE_OUT`.

| Peça | Constante | Regra |
|---|---|---|
| Seção | `SECTION` | Linha fina no topo, `py-16 lg:py-24` |
| Largura | `CONTAINER` | `max-w-7xl px-6 lg:px-8` |
| Cartão | `CARD` | `rounded-[28px]`, borda branca a 10%, fundo `ink-raised` |
| Cartão que é link | `CARD_LINK` | Igual, a borda acende no hover e leva uma seta no canto |
| Ícone | `ICON_BADGE` | Círculo de 44 px, vermelho a 10%, ícone vermelho |
| Botão principal | `BTN_PRIMARY` | Pílula vermelha |
| Botão secundário | `BTN_GHOST` | Pílula de contorno branco |
| Botão de WhatsApp | `BTN_WHATSAPP` | Pílula verde |
| Filtro | `CHIP_ON` / `CHIP_OFF` | Ativo em branco com texto escuro |
| Etiqueta | `TAG` | Pílula de contorno, texto cinza claro |
| Campo de formulário | `INPUT`, `LABEL` | Canto `rounded-xl`, anel vermelho no foco |

Cabeçalho (`components/Navbar.tsx`) e rodapé (`components/Footer.tsx`) são versões do site do
`PromoHeader` e do `PromoFooter`: cápsula de vidro, aba ativa animada, linha de progresso e, no
celular, a barra fixa de WhatsApp. No computador há o botão flutuante da seção 12.

### Modelo de seção

```tsx
<section id="exemplo" className={SECTION}>
  <div className={CONTAINER}>
    <Reveal className="max-w-3xl">
      <p className={EYEBROW}>Rótulo</p>
      <h2 className={`mt-4 ${TITLE} text-white`}>Título da seção</h2>
      <p className={`mt-5 max-w-2xl ${LEAD}`}>Uma frase de apoio.</p>
    </Reveal>
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">…cartões…</ul>
  </div>
</section>
```

## 5. Movimento

| Onde | O que acontece | Como |
|---|---|---|
| Entrada de bloco | Sobe 32 px e aparece, uma vez | `Reveal` (framer-motion, curva `EASE_OUT`, 0,9 s) |
| Abertura da home | Fachada em vídeo ou com aproximação lenta, feixe de luz, parallax ao rolar | `components/Hero.tsx`, `.hero-kenburns` e `.hero-sweep` em `app/globals.css` |
| Cabeçalho | Aba ativa desliza, linha de progresso acompanha a rolagem | `layoutId`, `useScroll` |
| Números | Contam de zero ao entrar na tela | `components/Stats.tsx` |
| Abas e acordeão | Troca com subida curta, altura animada | `AnimatePresence` |
| /promo | Giro da DS3 quadro a quadro pela rolagem | `components/promo/ScrollSequence.tsx` |

Regras: no máximo uma animação contínua por tela; nada de escala em botão no hover; tudo respeita
`prefers-reduced-motion` (o layout público envolve o site em `PromoMotion`).

## 6. Imagens e vídeos (Higgsfield)

O Higgsfield está ligado ao projeto pelo `.mcp.json`. Ele gasta créditos da conta: confira o custo
com `get_cost: true` antes de gerar.

**O que já foi feito**

| Arquivo | Origem | Custo |
|---|---|---|
| `public/fotos/home/fachada.webp` (2560 px) | `public/sede.png` (680 px) ampliada para 4K no Higgsfield | 2 créditos |
| `public/fotos/home/fachada.mp4` | A fachada ampliada, animada no Seedance 2.5 (6 s, 1080p, sem som) | 96 créditos |

**Caminho para uma foto nova**

1. Enviar o arquivo (`media_upload`, `curl PUT`, `media_confirm`).
2. Ampliar com `upscale_image` (4K, 2 créditos). Ele não aceita descrição, então não inventa cena.
3. Conferir letreiros, logos e placas no resultado, com um recorte ampliado. Se uma letra mudou, não usar.
4. Converter para WebP com a `sharp` (largura de 2560 px, qualidade 82) e salvar em `public/fotos/`.

**Caminho para um vídeo de fundo**

1. Partir de uma foto real já ampliada, como imagem inicial e final (o loop fecha sem salto).
2. Pedir câmera parada e movimento só no que se move de verdade (nuvens, folhas). Sem pessoas, sem
   veículos andando, sem mudança em letreiro.
3. 1080p, sem áudio, 6 segundos (16 créditos por segundo no Seedance 2.5).
4. Conferir o vídeo inteiro: fachada, placa e logo precisam ficar idênticos do começo ao fim.
5. Comprimir (H.264, sem áudio, cerca de 2 Mbps) e salvar em `public/fotos/home/`.
6. No site, o vídeo entra com a foto como pôster, `muted`, `loop`, `playsInline` e
   `preload="metadata"`. A foto é a imagem que conta para a velocidade; o vídeo chega depois.

**O que não gerar por IA:** pessoas, clientes, instalações que não existem, máquinas que a empresa
não vende, números ou selos. Foto real ampliada pode; cena inventada não.

## 7. Páginas

| Página | Arquivos | Abertura |
|---|---|---|
| Home | `app/(public)/page.tsx` e `components/{Hero,Stats,MonthlyHighlight,EPForkliftsSection,Services,About,Testimonials,FAQ,Contact}.tsx` | Fachada da matriz, de ponta a ponta |
| Sobre | `components/AboutPageClient.tsx` | Texto à esquerda, fachada à direita |
| Catálogo | `components/ForkliftsCatalogClient.tsx` | `PageHeader` + filtros em pílula |
| Tipo de produto | `app/(public)/produtos/tipo/[tipo]/page.tsx` | `PageHeader` com os botões |
| Ficha | `components/ForkliftDetailClient.tsx` | Foto em quadro branco + título grande |
| Blog | `components/blog/*` | `BlogHeader` centralizado por causa da busca |
| Privacidade e Termos | `components/{Privacidade,Termos}Client.tsx` | `PageHeader` |
| 404 | `app/not-found.tsx` | Escura, com os mesmos botões |

Ordem da home: abertura, faixa de números, destaques do mês, tipos do catálogo, soluções, sobre,
avaliações, perguntas frequentes, contato.

## 8. Velocidade

- A primeira imagem de cada página usa `next/image` com `priority`. As demais carregam sob demanda.
- Vídeo de fundo nunca é o maior elemento do primeiro quadro: o pôster é.
- O giro quadro a quadro da DS3 fica só na `/promo`.
- A home não envia o catálogo inteiro ao navegador: o servidor manda só as contagens por tipo.
- Antes de publicar: `npx tsc --noEmit`, ESLint nos arquivos alterados e `next build` numa cópia
  isolada (o servidor de desenvolvimento do usuário usa a pasta `.next` do projeto).

## 9. Lista de conferência para uma seção nova

- [ ] Usa `SECTION`, `CONTAINER`, `EYEBROW`, `TITLE` e, se precisar, `LEAD`.
- [ ] Tem uma ideia só e cabe em cerca de uma tela no computador.
- [ ] Cartões com `CARD` ou `CARD_LINK`; botões com `BTN_*`.
- [ ] Vermelho só como acento; verde só no WhatsApp.
- [ ] Entrada com `Reveal`; nenhuma animação contínua nova.
- [ ] Foto de produto em quadro branco.
- [ ] Conferida a 1440 px e a 390 px de largura.
- [ ] Todo número e toda afirmação vieram da empresa.

## 10. O que depende de terceiros

- **Números:** a abertura da página Sobre diz "10 anos de experiência" e a empresa existe desde 2014;
  a faixa de números diz "1.000+ equipamentos, 500+ clientes, 5.000+ manutenções, 98%". O Paulo
  precisa confirmar quais valem.
- **Pontos de atendimento:** o site lista 6 cidades; a `/promo` lista 3.
- **Foto nova da fachada:** a atual é uma foto de 680 px ampliada. Uma foto de celular atual, na
  horizontal, daria ainda mais nitidez e serviria de base para um vídeo melhor.

## 11. Princípios de design adaptados (skill frontend-design, da Anthropic)

Lida em 10/11/2026 (repositório público `anthropics/skills`) e instalada em `.claude/skills/` com a
autorização do usuário. O que serve ao nosso visual foi adaptado, e a `/promo` continua mandando quando
há conflito.

| Princípio da skill | Como ficou aqui |
|---|---|
| Não destacar só uma palavra do título em cor | Títulos da abertura e da página Sobre agora são todos brancos. O vermelho fica nos rótulos, ícones e botões |
| Movimento só onde chama atenção | Uma animação de abertura (o vídeo da fachada) e respostas a ações (menu, painel do WhatsApp, abas). Sem animação contínua nova |
| Estrutura que informa | Linhas, bordas e números só quando carregam informação; cartões idênticos só para itens equivalentes |
| Um ponto de ousadia | A fachada animada da matriz na abertura; o resto é calmo |
| Qualidade mínima | Teste a 390 e 1440 px, foco visível, movimento reduzido respeitado |
| Rótulo em caixa alta, setinha `→` em todo botão, pontos entre metadados | Evitados |

Não adotados, por contrariarem a `/promo`: trocar a tipografia por uma combinação de serifa e sans, e
um fundo diferente do `#0D0D0D`.

## 12. Botão de WhatsApp

`components/site/WhatsAppFab.tsx`: botão redondo de 64 px nas cores oficiais do WhatsApp (verde `#25D366`,
ícone branco) no canto inferior direito. Ao clicar abre uma janela com animação (Radix Popover, que cuida de
foco, Esc, clique fora e leitor de tela, mais framer-motion) com quatro assuntos prontos (cotar, locação,
peças, assistência) e um campo para escrever a mensagem. Tudo abre o WhatsApp por link direto `wa.me` com o
texto pronto, então o `AnalyticsEvents` conta o `click_whatsapp` no GA4. O cabeçalho da janela usa o verde
escuro padrão do WhatsApp (`#075E54`) para o texto branco ter contraste. Some no celular, onde a barra fixa
do cabeçalho faz esse papel.

Histórico: a versão anterior do botão (verde apagado, 48 px) foi trocada por duas bibliotecas de terceiros
(`react-floating-whatsapp` e `@carlos8a/react-whatsapp-floating-button`) que o usuário não aprovou; voltou-se
à versão própria com Radix, maior e com as cores padrão.

## 13. Auditoria Vercel Web Interface Guidelines (10/11/2026)

Aplicada nos arquivos públicos. Corrigido: `transition: all` global e `transition-all` em 14
componentes (agora com propriedades listadas), `touch-action: manipulation`, link "Pular para o
conteúdo", `theme-color`, reticências `…` nos textos, `spellCheck` e `inputMode` nos campos e
dimensões nas logos de clientes. Já estava certo: vídeo mudo em loop que para com movimento
reduzido, foto como alternativa, rótulos e `autocomplete` nos campos, foco visível e
`color-scheme: dark`.

## 14. Skills usadas e o que mudou por causa delas (10/11/2026)

Instaladas em `.claude/skills/` com a autorização do usuário: `frontend-design`, `theme-factory`,
`ui-ux-pro-max` e `web-design-guidelines` (Vercel). A `venda-forte-visual` é nossa, no formato do
skill-creator: resume este guia em uma página para as próximas sessões.

- **ui-ux-pro-max** (`search.py --design-system`, domínio `ux`): sugeriu o padrão "Trust & Authority +
  Conversion" (abertura, provas, soluções, caminho claro até o contato), que a home já segue. A paleta
  azul-marinho clara e a Plus Jakarta Sans que ele sugere **não** foram adotadas: contrariam a `/promo`.
  Adotada a lista de conferência:
  - texto pequeno cinza passou de `neutral-500` (4,1:1) para `ink-muted` `#8C8C8C` (5,4:1), em todo o site
    público e nos campos (`placeholder`); o ícone de engrenagem do cabeçalho subiu de 40% para 60% de branco;
  - alvos de toque de 44 px (antes 36 a 40 px): menu do celular, engrenagem, redes do rodapé, setas dos
    depoimentos e dos carrosséis, fechar da janela de vídeo, do zoom e da busca do blog;
  - vídeo da abertura: botão de pausar/reproduzir (44 px, no canto inferior esquerdo) e o vídeo só roda
    com a abertura na tela; some com movimento reduzido.
- **frontend-design**: ver seção 11.
- **web-design-guidelines**: ver seção 13.
- **theme-factory**: o tema do site foi descrito no formato dele (cores, tipografia, uso) na skill
  `venda-forte-visual`; nenhum dos 10 temas prontos serve, porque a referência é a `/promo`.
- Véu da abertura clareado (esquerda `ink/95` a transparente, base `ink/45` no computador) para a fachada
  aparecer mais; o título continua legível.

### Segunda rodada (10/11/2026): as skills rodadas de verdade

Diretrizes da Vercel buscadas na hora (`command.md`) e aplicadas a Hero, Navbar, Footer, Services, Contact,
FAQ, Testimonials, EPForkliftsSection e WhatsAppFab, mais as buscas da ui-ux-pro-max (`ux`: foco coberto por
cabeçalho fixo, botão só de ícone, vídeo que toca sozinho, carrossel) e a crítica da frontend-design.

- Botão flutuante de WhatsApp cobria "Privacidade / Termos / Voltar ao topo" no fim da página: o rodapé ganhou
  `md:pb-24`.
- Foco coberto pelo cabeçalho fixo: `scroll-padding-top: 6rem` no `html`.
- Foco visível padrão em todo o site escuro (`:where(.theme-ink) :focus-visible`, peso baixo, não briga com as
  classes do Tailwind). Rolagem suave desligada com movimento reduzido (CSS e setas dos depoimentos).
- Janela do YouTube (Services): o foco entra nela, Tab não escapa, Esc fecha, o foco volta ao cartão,
  `overscroll-contain`.
- Fileira de depoimentos focável pelo teclado (`tabIndex`); cartões de tipo no catálogo com nome acessível
  ("Empilhadeiras elétricas: 12 modelos"); cidades do rodapé como itens de lista; `<select>` do contato com
  fundo escuro nas opções; campo do WhatsApp com `name`; botões do cabeçalho com 44 px; textos a 40% e 50% de
  branco subiram para 60% e 70%.
- Não mexido de propósito: títulos e botões em sentença (o guia da Vercel pede Title Case, regra do inglês);
  animação de altura do acordeão do FAQ (conteúdo curto, e a /promo faz igual); rótulo com ponto no meio e
  entrada com subida em toda seção, que a frontend-design chama de padrão genérico mas são da /promo, e a
  /promo manda. Pendente com o Paulo: o FAQ declara 10 perguntas no JSON-LD e mostra 5 até clicar em "Ver todas".
- `components/promo/` (a campanha) e o `/admin` não foram tocados.

## 15. Imagens sem gastar a cota da Vercel (12/11/2026)

Em 12/11 a conta Hobby estourou "Image Optimization – Transformations" (5,1K de 5K em 30 dias; 99,7% do
`venda-forte`, com pico de 2,2 mil em 06/11). Sem a cota, imagens novas deixam de ser geradas. Em vez de
depender do otimizador da Vercel, o site tem o seu:

- `scripts/gen-images.mjs` (roda sozinho em `npm run dev` e `npm run build`, via `predev`/`prebuild`) lê as
  imagens de `public/` e grava WebP de 384, 640, 1080 e 1920 px em `public/_img/<largura>/...` (pasta ignorada
  pelo git; só refaz o que mudou; cerca de 2 min na primeira vez, 88 MB).
- `image-loader.ts` (`images.loader: "custom"` no `next.config.ts`) manda cada `<Image>` para o arquivo da
  largura certa. São arquivos estáticos: zero transformação. O catálogo da EP (`cdn.ep-portal.net`, já WebP de
  cerca de 60 KB) vai direto da CDN deles. Só imagens de outros hosts (Supabase) ainda usam o otimizador.
- Ao mudar as larguras, mude juntas as três listas: `WIDTHS` no script e no loader e `deviceSizes`/`imageSizes`
  no `next.config.ts`. Foto nova em `public/` não precisa de nada: o prebuild gera as versões.
- Quem roda `next dev` já aberto precisa reiniciar o servidor para pegar a configuração nova.

## 16. Painel administrativo, termos e privacidade (12/11/2026)

O painel `/admin` deixou de ser claro e segue o visual do site e da `/promo`.

**Base.** `app/admin/layout.tsx` usa o mesmo invólucro do site (`theme-ink bg-ink font-sans`). Em `app/globals.css`, os campos sem classe de
cor (`input`, `textarea`, `select`) ficam escuros por regra de peso baixo (`:where`), e o editor de texto do blog usa `prose-invert`.

**Peças do painel** (`components/admin/`):

| Peça | Arquivo | Para que serve |
|---|---|---|
| Barra do painel | `AdminNav.tsx` | Cápsula de vidro igual à do site. Abas, rastro da tela (`crumb`), linha de progresso (`progress`) e ações à direita (`children`). Todas as telas usam; as de edição já não copiam a barra |
| Classes | `ui.ts` | Botões em pílula (`BTN_PRIMARY`, `BTN_GHOST`, `BTN_WHITE`, `BTN_ICON` de 44 px), `CHIP_ON/OFF`, `BADGE_*`, `PAGE_TITLE`; reexporta `CARD`, `INPUT`, `EYEBROW` do site |
| Avisos e confirmações | `Feedback.tsx` | `notify("texto")` no lugar do `alert` e `await askConfirm("texto", { confirmLabel })` no lugar do `confirm`. O `FeedbackHost` fica no layout do painel; sem ele, cai nas janelas do navegador |

**Regras.** Título todo branco e rótulo vermelho sem caixa alta; um botão vermelho por tela; botão só de ícone sempre com `aria-label`; sem emoji como
ícone; sem `transition-all`; fotos de produto em quadro claro (`bg-white`, com `mix-blend-multiply`).

**Termos de uso e política de privacidade** usam `components/site/LegalLayout.tsx`: abertura da campanha, índice fixo à esquerda que acompanha a
leitura (no celular vira um botão que abre a lista), seções separadas por linhas finas e o contato num cartão. O texto de cada seção é JSX comum
em `TermosClient.tsx` e `PrivacidadeClient.tsx`; o texto jurídico não foi alterado. Atenção: a linha "Última atualização" mostra a data de hoje a cada
visita (já era assim), o que não é a data real da última revisão do texto: vale trocar por uma data fixa quando o Paulo confirmar.

**Fotos de produto sem fundo.** As 222 fotos do catálogo vêm da CDN da EP (`cdn.ep-portal.net`) como recortes sobre fundo branco. A rota
`app/api/foto` (`?u=<foto>&w=384|640|1080`) tira o fundo claro ligado à borda, transforma a sombra do chão em preto suave e devolve um WebP com
transparência, cacheado por um ano na CDN (cada foto é processada uma vez e não usa a cota de otimização de imagens da Vercel). `lib/product-photo.ts`
(`stagePhoto`) monta o endereço e `PRODUCT_STAGE` (`components/site/styles.ts`) é o palco escuro com foco de luz, como o estúdio da DS3 na /promo.
Vale para o catálogo, a ficha do modelo, os relacionados, as miniaturas e a janela de ampliação. Só aceita o host da EP. `PHOTO_STUDIO` (degradê
claro) ficou para quadros que ainda mostrem foto com fundo branco.

**Fileira de categorias do catálogo:** sem barra de rolagem; esmaecido e seta (`sm` em diante) só no lado em que ainda há o que rolar, arraste com
o mouse, dedo ou roda, e a categoria escolhida rola para o centro.

**Blog:** a abertura entra em cascata (classe `rise`, CSS puro); os cartões entram ao rolar em cascata (`whileInView`, uma vez); o cartão segue o
padrão da /promo (canto de 28 px, capa inset com rótulo sobre a imagem); a capa do artigo ganha a aproximação lenta da abertura da home. Tudo
respeita `prefers-reduced-motion`.

**Outros ajustes.** Palavras em vermelho dentro de títulos do blog saíram (o vermelho fica em rótulo, ícone e botão); a `meta theme-color` vermelha do
`app/layout.tsx` conflitava com a escura do `viewport` e foi removida; `lib/social.ts` ganhou os tons escuros dos estados dos textos das redes.
