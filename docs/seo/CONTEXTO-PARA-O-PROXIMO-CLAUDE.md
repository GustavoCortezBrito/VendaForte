# Contexto para o próximo Claude: SEO e conteúdo da Venda Forte

Escrito em 23/10/2026, ao fim de uma sessão longa. Leia este arquivo inteiro antes de mexer em SEO, blog, catálogo ou nos documentos do plano. Os documentos vivos estão no Claude Docs (links na seção 8); as cópias em PDF estão em `docs/seo/arquivo/`.

## 1. Quem é quem

- **Projeto:** site do Grupo Venda Forte (Next.js 16.4.1, App Router, Supabase, deploy na Vercel a partir da `master`; repositório `GustavoCortezBrito/VendaForte`). Idioma: português do Brasil, inclusive comentários de código.
- **Gustavo** é o usuário e quem presta o serviço. Fechou um pacote de R$ 3 mil por mês (30 a 40 horas por semana), pago metade pela Venda Forte e metade pela GeoForte. **A GeoForte é outro projeto, tratado por outro Claude: não mexer nele.** A porta 3001 do computador é a do dev server dela.
- **Paulo** comanda a Venda Forte (tudo, menos o comercial). **Rodrigo** é o comercial. A empresa é **dealer oficial da EP Equipment**, com matriz em Chapecó e unidade em Joinville (afirmação do Paulo; a redação exata ainda precisa da aprovação dele).

## 2. Regras permanentes do usuário

- **Não fazer commit nem push sem o usuário pedir.** Confirmar antes de escrever no Supabase de produção.
- Responder em português do Brasil. Quando o usuário pede para "melhorar" algo, melhorar o que existe: ele já rejeitou redesenhos completos.
- Nunca publicar foto de pessoa identificável sem consentimento confirmado, nem inventar fato, preço ou número. Só usar dados do catálogo, das fichas oficiais da EP, do cliente ou de norma.
- Antes de escrever código Next.js, ler `node_modules/next/dist/docs/` (regra do `AGENTS.md`: esta versão tem mudanças que quebram o que se sabia).
- **O repositório é público** (conferido em 23/10/2026 pela API do GitHub). Nada de segredo, e os dados brutos do SEMrush e do AnswerThePublic ficam fora (`/dados-seo/` está no `.gitignore`). Uma senha antiga do painel admin ainda aparece em README e docs do repositório: varrer se o usuário pedir, sem repetir o valor.
- Windows: parar o dev server deste projeto (porta 3000) antes de `next build`; se o Turbopack falhar com `0xc0000142`, usar `next build --webpack`; para testar o fallback em markdown, construir com `SUPABASE_SERVICE_ROLE_KEY=invalid-key-for-local-test`; evitar laços de espera, que o usuário interrompe.

## 3. Respostas do Paulo (WhatsApp, 22/10/2026)

1. Locação: pode deixar no site.
2. Peças: a empresa trabalha com peças.
3. Preço: só nas promoções.
4. Post de BNDES/Finame: remover, porque só vendem empilhadeiras importadas.
5. Assistência técnica: página própria, porque precisam disso como dealer oficial da EP.

Reunião do Paulo com o Rodrigo marcada para 23/10 para alinhar o resto. Os detalhes que faltam estão na seção "O que depende do cliente" do plano.

## 4. O que já está feito (histórico resumido)

- **Blog:** busca, filtro por tema em cartões com arrastar, ordenar por recentes ou antigos, CTA escuro, capas 16:9. Posts vêm do **Supabase primeiro** e do `.md` em `content/blog` só se o banco estiver vazio. O script `scripts/seo/sb-sync.cjs` insere slugs novos e só atualiza post cujo conteúdo no banco ainda é igual ao do `.md` do commit base (variável `BASE_REF`); nunca toca em post que existe só no banco.
- **Fotos reais** no catálogo, no blog e na home (commit `e803840`), otimizadas em WebP; foto da seção Sobre trocada (`967d6a0`).
- **SEO técnico** (commit `79cd43c`): endereço único `https://www.grupovendaforte.com` (apex redireciona com 308), canonicals, sitemap com datas reais, robots sem bloqueios, título e Product por modelo.
- **Segurança:** senha do admin trocada no banco e porta dos fundos de login removida.
- **Nesta rodada (23/10):** pesquisa, análise e documentos. **Nenhum código do site foi alterado.** Foram adicionados apenas `docs/seo/`, `scripts/seo/` e uma linha no `CLAUDE.md`.

## 5. Diagnóstico (números de 21 a 23/10/2026)

| Achado | Dado | Fonte |
| --- | --- | --- |
| Fichas sem link rastreável | 203 de 222 | Auditoria do SEMrush (páginas órfãs) e `ForkliftsCatalogClient.tsx` (12 por página, troca por botão) |
| Celular lento | Home nota 41 e LCP de 12,0 s; catálogo 60 e 6,0 s; ficha tvl151 58 e 13,2 s com 5,7 MB; post de tipos 61 e 7,1 s | Lighthouse local (`npx lighthouse@12 URL --form-factor=mobile`) |
| Tela de carregamento | `components/LoadingScreen.tsx` cobre toda página por mais de 2 s, com animações infinitas | Código |
| 19 erros de dados estruturados | Product sem `offers`, `review` ou `aggregateRating` (o Google exige um dos três) | Auditoria e documentação do Google |
| 14 fichas diesel descritas como lítio | Slugs `cpcd*`, "Drive: Diesel" na ficha técnica, "Li-Ion" no catálogo; o título e a descrição gerados em `lib/product-seo.ts` dizem "bateria 24 V (lítio)" | `lib/data/electric-forklifts.json` |
| 38 fichas de chumbo-ácido com texto "Íon-Lítio" | E 212 de 222 fichas repetem o mesmo parágrafo de abertura | Mesmo arquivo |
| Contatos não medidos | O GA4 (G-7JE64BV56H) só carrega a tag, sem eventos | `app/layout.tsx` |
| Painel admin linkado no menu | `components/Navbar.tsx` tem ícone com `rel="nofollow"` para `/admin`, em 53 páginas | Código |
| Metadados da home | Título "Empilhadeiras e Equipamentos"; descrição promete "assistência 24h no Sul e SP" (não confirmado) e há 40 termos de meta keywords | `app/metadata.ts` |
| Visibilidade | 2 palavras-chave no SEMrush, Authority Score 2, cerca de 230 impressões e 5 cliques no Search Console importado (75% por modelo ou marca) | SEMrush e Search Console |
| Backlinks | 1,9 mil, quase todos spam; não exigem ação sem ação manual no Search Console | SEMrush |

Falsos alarmes da auditoria: 98 "links externos quebrados" (todos responderam 200 em teste manual), "baixa proporção texto/HTML" (o Google diz que não é fator de ranking) e o arquivo `llms.txt` (o Google diz que não é preciso para aparecer em recursos de IA). A marcação de FAQ foi descontinuada pelo Google em maio de 2026.

## 6. Estratégia em seis frentes (detalhe nos PDFs e nos links)

1. **Base técnica:** tirar a tela de carregamento, acelerar o celular, corrigir dados das fichas e o Product.
2. **Catálogo rastreável:** páginas por tipo (`/produtos/tipo/[tipo]`), paginação com links reais e fichas ligadas ao tipo e a modelos parecidos.
3. **Páginas que vendem:** `/locacao-de-empilhadeiras`, `/assistencia-tecnica-ep`, `/pecas-e-baterias`, `/ep-equipment`.
4. **Conteúdo:** 23 posts em 13 semanas, um assunto e uma busca principal por post.
5. **Presença local e autoridade:** Perfil da Empresa no Google, avaliações dentro das regras, link no localizador de revendedores da EP, citações do setor.
6. **Medição:** WhatsApp, telefone e formulário como eventos-chave no GA4; UTM em todo link das redes; Search Console toda semana.

Não fazer: página por cidade sem conteúdo próprio (o Google trata como página-porta), texto gerado em massa sem checagem, avaliação paga ou incentivada, preço fora de promoção, qualquer menção a BNDES ou Finame, afirmar sobre marcas concorrentes.

## 7. Tarefas de código aguardando o ok do usuário

Semana 1 (cerca de dois dias): remover `LoadingScreen` do `app/layout.tsx`; tirar o ícone de `/admin` do `Navbar.tsx`; trocar o Product por BreadcrumbList em `lib/product-seo.ts`; corrigir diesel e chumbo-ácido lendo `specs["Drive"]` e o tipo real de bateria; reescrever título e descrição da home e apagar meta keywords em `app/metadata.ts`; eventos `generate_lead`, `click_whatsapp` e `click_phone` no GA4; dados reais da empresa no JSON-LD (rua, CEP, telefone com +55); retirar o post de BNDES (Supabase, redirecionamento 301 em `next.config.ts`, e menções em dois posts e em `components/MonthlyHighlight.tsx`).

Semanas 2 a 7: páginas por tipo e catálogo com links reais; ficha ligada ao tipo; texto de abertura gerado dos dados; imagens rápidas (foto principal com prioridade, primeira linha do catálogo sem carregamento tardio, fundo da home em WebP); menos JavaScript (animações de entrada em CSS); campo `seo_title` nos posts; páginas comerciais; unir os dois posts de lítio.

A tabela completa, com onde mexer e como saber que está pronto, está na aba Instruções do plano (`docs/seo/arquivo/plano-de-seo--aba-instrucoes.pdf`).

## 8. Documentos vivos (Claude Docs) e como editá-los

- **Plano de SEO:** https://claude.ai/artifact/2UvePQBXxkhQqLaP2UvzbZ (doc `0bff47b4-d4a1-4eaa-a897-1e083142d870`). Aba Plano: arquivo `19fb06fe-f07c`, corpo `2c12b8f6-db73`. Aba Instruções: arquivo `14a81df3-5238`, corpo `9846e959-a252`. Dois gráficos desenhados (widgets `2e7554ff-5d4d` e `a52d5a50-2ca5`).
- **Calendário de conteúdo:** https://claude.ai/artifact/K9fLHGUWLwLzU9YZ3yQ27T (doc `92fa11b9-52cc-49ef-9fae-c74891939e72`). Abas Calendário (`b49f34bf-3fb5`, corpo `7bd9c713-0808`), Briefings (`32b7009a-9119`, corpo `99d81677-9f28`) e Manual de publicação (`9f0e46bc-5b52`, corpo `0c73707d-4fa4`).
- Cópias em PDF de cada aba: `docs/seo/arquivo/` (têm texto, legível com `pypdf`).
- Dicas do conector: editar sempre o documento existente, nunca recriar; `update` com `replace` por `find` ou por id de bloco (com `ifHash` e `ifRev` para bloco inteiro); pipe dentro de célula de tabela precisa de `\|`; se o `find` for ambíguo, usar `nth`; o export em Markdown troca os gráficos por texto, e o export em PDF grande é salvo em arquivo (decodificar o `bytes_b64` com Node).

## 9. Calendário dos 23 posts (resumo; briefings completos na aba Briefings)

| # | Data | Título | Busca principal |
| --- | --- | --- | --- |
| 1 | 27/10 | Paleteira elétrica: 1.500 ou 2.000 kg? | paleteira elétrica |
| 2 | 29/10 | Empilhadeira retrátil: o que é, como funciona e quando usar | empilhadeira retrátil |
| 3 | 03/11 | Empilhadeira patolada: o que é e a diferença para a semi-elétrica | empilhadeira patolada |
| 4 | 05/11 | Paleteira elétrica ou manual: quando a troca compensa | paleteira manual |
| 5 | 10/11 | Aluguel de empilhadeira: o que entra no valor e como pedir uma proposta | aluguel de empilhadeira |
| 6 | 12/11 | Manutenção de empilhadeira elétrica: o que revisar e com que frequência | manutenção de empilhadeira |
| 7 | 17/11 | Empilhadeira elétrica de 2 a 3 toneladas: o que pesa no preço | empilhadeira elétrica preço |
| 8 | 19/11 | Bateria da empilhadeira elétrica: como carregar, quanto dura e quando trocar | bateria empilhadeira elétrica |
| 9 | 24/11 | Selecionadora de pedidos: o que é e quando compensa | selecionadora de pedidos |
| 10 | 26/11 | EP JX1: a ficha técnica explicada | jx1 |
| 11 | 01/12 | Rebocador elétrico: o que é e quando usar | rebocador elétrico |
| 12 | 03/12 | EP ESL122: a ficha técnica explicada | esl122 |
| 13 | 08/12 | Empilhadeira a diesel: quando escolher e quais capacidades | empilhadeira a diesel |
| 14 | 10/12 | Guia do operador: como ligar, operar e carregar | como ligar/operar empilhadeira elétrica |
| 15 | 15/12 | Checklist para pedir cotação de empilhadeira ou paleteira | (conversão) |
| 16 | 17/12 | EP CQD20LB: a retrátil de 12 metros explicada | cqd20lb |
| 17 | 22/12 | Empilhadeira usada ou nova: o que avaliar | empilhadeira usada |
| 18 | 05/01 | Como comparar duas empilhadeiras pela ficha técnica | centro de carga empilhadeira |
| 19 | 07/01 | Locação com ou sem operador: como funciona | locação de empilhadeira com operador |
| 20 | 12/01 | Caso de cliente: a operação antes e depois | (prova) |
| 21 | 14/01 | EP TVL151 e TVL181: as fichas explicadas | tvl151, tvl181 |
| 22 | 19/01 | Pauta escolhida pelo Search Console | a definir |
| 23 | 21/01 | "Locação de empilhadeira ou compra" ampliado | locação de empilhadeira |

Posts às terças e quintas, 9h. Pausa de 24/12 a 04/01. Feriados sem publicação: 02/11, 20/11, 25/12 e 01/01. Páginas por tipo no ar até 13/11 (paleteiras, patoladas e retráteis) e 20/11 (contrabalançadas e selecionadoras e rebocadores); locação em 09/11, assistência técnica EP em 11/11, peças e baterias em 16/11, EP Equipment em 04/12; diesel em 11/12 (depende do Rodrigo).

## 10. Dados brutos e ferramentas

- **`dados-seo/`** (fora do git, no computador do Gustavo): `AnswerthePublic/` (12 CSV de 22/10/2026) e `Semrush/` (análise em lote de 60 termos, Keyword Magic Tool, Strategy Builder, Search Console importado, ideias do On Page SEO Checker em xlsx, mega export e PDF da auditoria de 22/10/2026, e resumos em CSV feitos à mão).
- **`scripts/seo/`:** `atp-load.cjs` (lê os CSV do AnswerThePublic), `sb-sync.cjs` (sincroniza `content/blog` com o Supabase; simula por padrão, grava com `--apply`; precisa de `.env.local`), `xlsx-read.cjs` (lê planilha .xlsx descompactada).
- Não funcionou nesta sessão: API do PageSpeed Insights (sem cota; usar `npx lighthouse@12`), DuckDuckGo (bloqueia) e a busca da ferramenta WebSearch (só resultados dos EUA, inútil para concorrentes locais).
- Concorrentes diretos ficaram sem análise: pedir ao cliente de 5 a 10 domínios.

## 11. Erros nossos já corrigidos nos documentos (não repetir)

- O Product sem preço, adicionado na rodada de SEO anterior, é a causa dos 19 erros da auditoria.
- O título e a descrição das fichas diesel dizem "lítio" porque `lib/product-seo.ts` confia no campo de bateria do catálogo, que está errado para esses modelos.
- O número (49) 98839-5635 **existe** no código (WhatsApp, via `wa.me`); os endereços `http://grupovendaforte.com/tel:(49)98839-5635` que aparecem no índice do SEMrush devem vir de links externos mal formados.
- As posições #4 a #9 que o SEMrush marcou em cinco buscas locais não aparecem no Search Console e não foram usadas.
- O blog já tinha os posts de elétrica contra GLP e de tipos de empilhadeira: o plano revisa, não recria.

## 12. Próximos passos

1. O usuário decide se começa a lista da semana 1; só então mexer no código, com teste local e sem commit antes do pedido dele.
2. Depois da reunião do Paulo com o Rodrigo, atualizar a seção "O que depende do cliente" e o calendário.
3. Confirmar com o usuário a retirada do post de BNDES (envolve Supabase de produção).
4. Quando os 5 a 10 concorrentes chegarem, rodar Visão geral do domínio e Lacunas de palavras-chave no SEMrush.
5. Em 23/11 (30 dias) e 22/01 (90 dias): revisão com os números do Search Console e do GA4.
