# Checklist de SEO antes de publicar

**Regra do projeto (pedido do Gustavo, 20/11/2026):** toda vez que mexermos em páginas (texto, título, imagem, link, rota, post), rodamos a auditoria de SEO **antes** de commitar e subir. Se aparecer erro ou aviso, corrigimos antes de ir ao ar. Só sobe com a auditoria limpa, ou com o motivo de cada exceção escrito na mensagem do commit.

Vale para quem for mexer no site, inclusive o Claude: não diga que terminou sem ter rodado a auditoria.

## Como rodar (uns 2 minutos)

1. Suba o site local: `npm run dev` (porta 3000). Se o Next imprimir o aviso de segurança e parar, rode o mesmo comando de novo.
2. Em outro terminal: `npm run seo:auditar -- http://localhost:3000`
   - Só as páginas de um trecho: `-- http://localhost:3000 --so=blog` (sem a barra inicial, por causa do Git Bash)
   - Amostra das fichas de produto (mais rápido): `-- http://localhost:3000 --fichas=30`
3. Leia o resultado. A saída para quando está tudo certo: `Tudo certo: nenhum erro e nenhum aviso.`
4. Corrija o que aparecer e rode de novo, até zerar.
5. Depois do deploy, rode no site publicado (`npm run seo:auditar`, sem endereço) e confira que continua limpo.

O script é só leitura (`scripts/seo/auditar-paginas.cjs`). Ele lê o `sitemap.xml` e abre cada página. **Página nova entra no sitemap** (`app/sitemap.ts`); se for uma rota fora do sitemap, acrescente em `extras` dentro do script.

## O que a auditoria confere

**ERRO** (impede de publicar):

| Regra | Limite | Como corrigir |
|---|---|---|
| Título (`<title>`) | até **580 px** na busca do Google (cerca de 60 caracteres) | Use `fitTitle(...)` de `lib/seo-title.ts`, com versões do título da mais completa para a mais curta. Não passe de 580 px: o Google corta o fim. |
| Título repetido | cada página tem o seu | Inclua o que diferencia a página (modelo, tipo, número da página). |
| Meta description | existir | Escreva na `metadata` da página. |
| Canonical | existir e apontar para a própria página | Defina em `alternates.canonical`. Páginas de lista apontam para si mesmas, não para a 1. |
| `og:title` e `og:image` | existir | **Quem define `openGraph` próprio apaga o da raiz**: repita `images: [{ url: SITE_URL + '/sede.png', width: 1200, height: 630, alt: '...' }]`. Sem isso a prévia no WhatsApp fica sem foto. |
| Um único `h1` | exatamente 1 por página | Um h1 só, com o assunto da página. |
| `lang` no `<html>` | `pt-BR` | Já vem do layout raiz. |
| JSON-LD | JSON válido | Confira vírgulas e aspas ao editar dados estruturados. |
| `alt` | toda `<img>` tem o atributo | Descreva a imagem. |
| Página indexável | sem `noindex` | `noindex` só em painel, busca e páginas técnicas. |
| Painel (`/admin`) | sempre `noindex` | Está em `app/admin/layout.tsx`. |
| WhatsApp antigo | não pode aparecer | O número do site é `WHATSAPP_CENTRAL`, em `components/promo/promo.config.ts`. Nunca escreva o número à mão num componente nem num post. |
| Resposta do servidor | 200 | Rota quebrada, redirecionamento no sitemap ou erro. |

**AVISO** (corrigir também, salvo motivo escrito):

| Regra | Limite | Como corrigir |
|---|---|---|
| Description | de 70 a 160 caracteres | Reescreva mais curta ou mais completa. |
| Description repetida | cada página tem a sua | Mesmo critério do título. |
| Texto do link interno | até 100 caracteres | **Não embrulhe o cartão inteiro num link.** Faça só o título ser o link e estique a área com `after:absolute after:inset-0` (modelo: `components/Services.tsx`). |
| Imagem com `alt=""` | só vale se enfeitar um link ou botão que já tem texto | Imagem solta precisa de descrição (ex.: foto da fachada na abertura da home). |
| Pouco texto | pelo menos 250 palavras | Páginas de conteúdo precisam de texto de verdade. |

## Regras para criar ou mudar páginas

- **Título e descrição próprios** em toda página nova, com a palavra que a pessoa digita na busca no começo.
- **Título curto o bastante**: passe pelo `fitTitle`. Na dúvida, o título cabe em ~58 caracteres.
- **Um h1**, com o assunto da página, e títulos menores (`h2`, `h3`) em ordem.
- **Imagens com `alt`** que descrevem o que se vê. Foto decorativa dentro de link com texto pode ter `alt=""`.
- **Links com texto curto e claro.** Nada de parágrafo inteiro dentro de um `<a>`.
- **Imagem de compartilhamento** (`og:image`) sempre; se a página define `openGraph`, repetir a imagem.
- **Lista paginada** (`?pagina=2`): canonical própria, título e descrição com o número da página.
- **Post novo do blog**: título do post até ~60 caracteres (o título do post é o `<title>`), descrição de 70 a 160, categoria, capa 16:9 com `alt`, e links internos para uma página que vende (ficha, tipo ou /promo).
- **Número de WhatsApp, telefone, endereço e horário**: uma única fonte; mudou, muda no código **e** nos posts do banco (ver `scripts/seo/sb-trocar-whatsapp.cjs`).
- **Não mexer na /promo** sem pedido explícito do Gustavo (ver `docs/seo/CONTEXTO-PARA-O-PROXIMO-CLAUDE.md`).

## Conferência manual, de vez em quando

- **Seobility** (https://www.seobility.net/en/seocheck/): cole a home e uma ficha. Referência de 20/11/2026: título era o único erro da home (618 px), mais uma imagem sem `alt` e links longos; tudo corrigido. O que sobra lá é fator externo (poucos backlinks), que código não resolve.
- **Search Console**: cobertura (páginas indexadas), mobile e Core Web Vitals, uma vez por semana enquanto a campanha estiver no ar.
- **PageSpeed** (celular): home e uma ficha, depois de mudanças pesadas (imagens, vídeo, scripts).

## Quando a ferramenta e o Google discordam

A estimativa de largura do título é a do Seobility (Arial 20 px). O Google reescreve alguns títulos por conta própria; isso não é falha da página. O critério do projeto é o título caber, não o Google exibi-lo exatamente.
