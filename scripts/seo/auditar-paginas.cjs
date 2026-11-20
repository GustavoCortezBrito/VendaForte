#!/usr/bin/env node
// Auditoria de SEO das páginas do site, só leitura. Rodar ANTES de publicar (ver docs/seo/CHECKLIST-ANTES-DE-PUBLICAR.md).
//
// Uso:
//   node scripts/seo/auditar-paginas.cjs                      # o site publicado (https://www.grupovendaforte.com)
//   node scripts/seo/auditar-paginas.cjs http://localhost:3000   # o servidor local (npm run dev ou next start)
//   --fichas=N   audita só N fichas de produto espalhadas pelo catálogo (padrão: todas)
//   --so=/blog   audita só as URLs que começam assim
//   --json       imprime o resultado em JSON
//
// Sai com código 1 se houver ERRO. AVISO também deve ser corrigido, a não ser que haja motivo escrito no commit.
const BASE_PADRAO = 'https://www.grupovendaforte.com'
const args = process.argv.slice(2)
const base = (args.find((a) => /^https?:\/\//.test(a)) || BASE_PADRAO).replace(/\/$/, '')
const opt = (nome) => (args.find((a) => a.startsWith(`--${nome}=`)) || '').split('=')[1]
const fichasMax = opt('fichas') ? Number(opt('fichas')) : Infinity
// --so=blog e --so=/blog valem igual (o Git Bash do Windows estraga argumentos que começam com barra)
const soBruto = opt('so') || ''
const so = soBruto && !soBruto.startsWith('/') ? '/' + soBruto : soBruto
const emJson = args.includes('--json')

// Limites (os mesmos que o Seobility e o Google usam na prática)
const TITULO_PX_MAX = 580
const DESC_MIN = 70
const DESC_MAX = 160
const ANCORA_MAX = 100
const PALAVRAS_MIN = 250
const PROIBIDOS = [/5549988395635/, /98839-?5635/] // WhatsApp antigo
// Páginas que não precisam de índice, descrição própria ou texto longo
const SEM_INDICE = /^\/(admin|api|blog\/busca)/

// Largura estimada do título na busca do Google (Arial 20 px), calibrada com o Seobility:
// "Venda de empilhadeiras em Chapecó e Joinville | Grupo Venda Forte" mede 618 px.
const ARIAL = { ' ': 278, a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500, A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611, '|': 260, ':': 278, '.': 278, ',': 278, '-': 333, '(': 333, ')': 333, '–': 556, '/': 278, '&': 667, '+': 584, '%': 889 }
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
const bruto = (s) => semAcento(s).split('').reduce((soma, ch) => soma + (ARIAL[ch] ?? (/\d/.test(ch) ? 556 : 556)), 0) * 0.02
const CALIBRA = 618 / bruto('Venda de empilhadeiras em Chapecó e Joinville | Grupo Venda Forte')
const larguraPx = (s) => Math.round(bruto(s) * CALIBRA)

const dec = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const atributo = (tag, nome) => {
  const m = tag.match(new RegExp(`\\s${nome}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'))
  return m ? dec(m[2] ?? m[3]) : null
}
const meta = (html, chave, valor) => {
  for (const t of html.match(/<meta\b[^>]*>/gi) || []) if ((atributo(t, chave) || '').toLowerCase() === valor) return atributo(t, 'content')
  return null
}
const texto = (html) => dec(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

async function lerPagina(url) {
  let res
  try {
    res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'auditoria-seo-interna' } })
  } catch (e) {
    return { url, status: 0, erro: String(e).slice(0, 80) }
  }
  if (res.status >= 300 && res.status < 400) return { url, status: res.status, destino: res.headers.get('location') }
  const html = await res.text()
  const titulo = dec((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').trim()
  const canon = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || [])[0]
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => texto(m[1]))
  const jsonld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      JSON.parse(m[1])
      return true
    } catch {
      return false
    }
  })
  const dentroDeLinkOuBotao = (indice) => {
    const abre = Math.max(html.lastIndexOf('<a ', indice), html.lastIndexOf('<button', indice))
    const fecha = Math.max(html.lastIndexOf('</a>', indice), html.lastIndexOf('</button>', indice))
    return abre > fecha
  }
  const todasImgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => ({ tag: m[0], dentro: dentroDeLinkOuBotao(m.index) }))
  const imgs = todasImgs.map((i) => i.tag)
  const ancoras = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({ href: atributo(m[1], 'href') || '', texto: texto(m[2]) }))
    .filter((a) => a.href.startsWith('/') || a.href.startsWith(base))
  return {
    url,
    status: res.status,
    titulo,
    desc: meta(html, 'name', 'description'),
    canonica: canon ? atributo(canon, 'href') : null,
    robots: meta(html, 'name', 'robots'),
    ogTitulo: meta(html, 'property', 'og:title'),
    ogImagem: meta(html, 'property', 'og:image'),
    lang: (html.match(/<html[^>]*\blang=["']([^"']+)/i) || [])[1] || null,
    h1,
    jsonldInvalidos: jsonld.filter((ok) => !ok).length,
    imgsSemAlt: imgs.filter((t) => atributo(t, 'alt') === null).map((t) => atributo(t, 'src') || '?'),
    // alt vazio só vale quando a imagem enfeita um link ou botão que já tem texto; fora disso é imagem sem descrição
    imgsAltVazio: todasImgs.filter((i) => atributo(i.tag, 'alt') === '' && !i.dentro).map((i) => atributo(i.tag, 'src') || '?'),
    ancorasLongas: ancoras.filter((a) => a.texto.length > ANCORA_MAX).map((a) => `${a.texto.length} car. → ${a.href}`),
    palavras: texto(html).split(' ').filter((w) => w.length > 1).length,
    proibidos: PROIBIDOS.filter((re) => re.test(html)).map(String),
  }
}

const caminho = (url) => url.replace(base, '').replace(/^https?:\/\/[^/]+/, '') || '/'
const semPagina = (url) => url.replace(/\?pagina=\d+/, '')

function avaliar(p) {
  const erros = []
  const avisos = []
  const rota = caminho(p.url)
  const publica = !SEM_INDICE.test(rota)
  if (p.status !== 200) return { erros: [`resposta ${p.status}${p.destino ? ' → ' + p.destino : ''}${p.erro ? ' ' + p.erro : ''}`], avisos }
  if (!p.titulo) erros.push('sem <title>')
  else if (larguraPx(p.titulo) > TITULO_PX_MAX) erros.push(`título com ~${larguraPx(p.titulo)} px (máx. ${TITULO_PX_MAX}): "${p.titulo}"`)
  if (publica) {
    if (!p.desc) erros.push('sem meta description')
    else if (p.desc.length > DESC_MAX) avisos.push(`description com ${p.desc.length} caracteres (máx. ${DESC_MAX})`)
    else if (p.desc.length < DESC_MIN) avisos.push(`description com ${p.desc.length} caracteres (mín. ${DESC_MIN})`)
    if (!p.canonica) erros.push('sem canonical')
    // compara só o caminho: no servidor local a canonical aponta para o domínio de produção, e isso é o certo
    else if (semPagina(caminho(p.canonica)).replace(/\/$/, '') !== semPagina(rota).replace(/\/$/, '')) erros.push(`canonical aponta para outra URL: ${p.canonica}`)
    if (!p.ogTitulo) erros.push('sem og:title')
    if (!p.ogImagem) erros.push('sem og:image (a prévia no WhatsApp fica sem foto)')
    if (/noindex/i.test(p.robots || '')) erros.push('marcada como noindex')
    if (p.palavras < PALAVRAS_MIN && !rota.startsWith('/promo')) avisos.push(`pouco texto (${p.palavras} palavras, mín. ${PALAVRAS_MIN})`)
  } else if (!/noindex/i.test(p.robots || '') && rota.startsWith('/admin')) erros.push('área do painel sem noindex')
  // /blog/busca (noindex) repete o h1 num bloco oculto só no servidor de desenvolvimento; no site publicado tem um
  if (p.h1.length !== 1 && !rota.startsWith('/blog/busca')) erros.push(`${p.h1.length} títulos h1 (precisa ser exatamente 1)`)
  if (!p.lang) erros.push('sem lang no <html>')
  if (p.jsonldInvalidos) erros.push(`${p.jsonldInvalidos} bloco(s) JSON-LD inválido(s)`)
  if (p.imgsSemAlt.length) erros.push(`${p.imgsSemAlt.length} imagem(ns) sem atributo alt: ${p.imgsSemAlt.slice(0, 3).join(', ')}`)
  if (p.imgsAltVazio.length && publica) avisos.push(`${p.imgsAltVazio.length} imagem(ns) com alt vazio (o Seobility conta como sem alt): ${p.imgsAltVazio.slice(0, 2).join(', ')}`)
  if (p.ancorasLongas.length) avisos.push(`${p.ancorasLongas.length} link(s) interno(s) com texto acima de ${ANCORA_MAX} caracteres: ${p.ancorasLongas.slice(0, 2).join(' | ')}`)
  if (p.proibidos.length) erros.push(`contém o WhatsApp antigo: ${p.proibidos.join(', ')}`)
  return { erros, avisos }
}

;(async () => {
  let sm
  try {
    sm = await (await fetch(base + '/sitemap.xml')).text()
  } catch {
    console.error(`Não consegui abrir ${base}/sitemap.xml. O servidor está no ar? (npm run dev; se o Next parar no aviso de segurança, rode de novo)`)
    process.exit(2)
  }
  // o sitemap publicado usa o domínio de produção; ao auditar o servidor local, troca pelo endereço local
  let urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base))
  const extras = ['/termos', '/privacidade', '/sobre', '/blog/busca', '/admin/login'].map((r) => base + r)
  urls = [...new Set([...urls, ...extras])]
  const ehFicha = (u) => /\/produtos\/(?!tipo\/)[^/?]+$/.test(u) && !u.endsWith('/produtos')
  const fichas = urls.filter(ehFicha)
  if (fichas.length > fichasMax) {
    const passo = fichas.length / fichasMax
    const escolhidas = new Set(Array.from({ length: fichasMax }, (_, i) => fichas[Math.floor(i * passo)]))
    urls = urls.filter((u) => !ehFicha(u) || escolhidas.has(u))
  }
  if (so) urls = urls.filter((u) => caminho(u).startsWith(so))

  const paginas = []
  let i = 0
  await Promise.all(
    Array.from({ length: 5 }, async () => {
      while (i < urls.length) paginas.push(await lerPagina(urls[i++]))
    })
  )
  paginas.sort((a, b) => a.url.localeCompare(b.url))
  if (!paginas.length) {
    console.error('Nenhuma página foi auditada: confira o endereço e o filtro --so. Isto NÃO é um "tudo certo".')
    process.exit(2)
  }

  const resultado = paginas.map((p) => ({ url: caminho(p.url), ...avaliar(p) }))
  // Repetições entre páginas
  const repetidos = (campo, severidade) => {
    const mapa = {}
    paginas.filter((p) => p.status === 200 && p[campo] && !SEM_INDICE.test(caminho(p.url))).forEach((p) => (mapa[p[campo]] ||= []).push(p.url))
    for (const [valor, lista] of Object.entries(mapa)) {
      if (lista.length < 2) continue
      for (const u of lista) resultado.find((r) => r.url === caminho(u))[severidade].push(`${campo === 'titulo' ? 'título' : 'description'} repetido em ${lista.length} páginas: "${valor.slice(0, 70)}"`)
    }
  }
  repetidos('titulo', 'erros')
  repetidos('desc', 'avisos')

  const comErro = resultado.filter((r) => r.erros.length)
  const comAviso = resultado.filter((r) => r.avisos.length)
  if (emJson) {
    console.log(JSON.stringify({ base, paginas: resultado.length, comErro: comErro.length, comAviso: comAviso.length, resultado: resultado.filter((r) => r.erros.length || r.avisos.length) }, null, 1))
  } else {
    console.log(`Auditoria de SEO: ${base}`)
    console.log(`${resultado.length} páginas | ${comErro.length} com ERRO | ${comAviso.length} com AVISO\n`)
    const agrupar = (lista, rotulo) => {
      const porMotivo = {}
      for (const r of lista) for (const m of r[rotulo]) (porMotivo[m.replace(/"[^"]*"|~?\d+( px| car\.| palavras| caracteres)?|→ \S+|: \S+$/g, '#').slice(0, 60)] ||= []).push({ url: r.url, m })
      return porMotivo
    }
    for (const [rotulo, nome] of [['erros', 'ERROS (corrigir antes de publicar)'], ['avisos', 'AVISOS (corrigir também, salvo motivo escrito)']]) {
      const g = agrupar(resultado, rotulo)
      const chaves = Object.keys(g)
      if (!chaves.length) continue
      console.log(`== ${nome}`)
      for (const k of chaves) {
        const itens = g[k]
        console.log(`\n  [${itens.length}x] ${itens[0].m}`)
        itens.slice(0, 6).forEach((it) => console.log(`       ${it.url}`))
        if (itens.length > 6) console.log(`       … e mais ${itens.length - 6}`)
      }
      console.log()
    }
    if (!comErro.length && !comAviso.length) console.log('Tudo certo: nenhum erro e nenhum aviso.')
  }
  process.exit(comErro.length ? 1 : 0)
})()
