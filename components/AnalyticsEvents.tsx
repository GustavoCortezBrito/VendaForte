'use client'

import { useEffect } from 'react'

type Gtag = (command: 'event', name: string, params?: Record<string, string>) => void

const send = (name: string, params: Record<string, string>) => {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag === 'function') gtag('event', name, { transport_type: 'beacon', ...params })
}

const isWhatsApp = (url: string) => /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\b/i.test(url)

const ORIGEM_KEY = 'vf_origem'
const clip = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value)

/** De onde a pessoa chegou: anúncio do Google, outro endereço marcado (utm) ou o site de onde veio. Vazio se não houver sinal. */
function detectOrigem(): string {
  const params = new URLSearchParams(window.location.search)
  const source = params.get('utm_source')
  const medium = params.get('utm_medium')
  const campaign = params.get('utm_campaign')
  const paidClick = params.has('gclid') || params.has('gbraid') || params.has('wbraid')
  if (paidClick || (source && /google/i.test(source) && /cpc|ppc|paid/i.test(medium ?? ''))) return 'Google Ads'
  if (source) return clip(`${[source, medium].filter(Boolean).join('/')}${campaign ? ` (${campaign})` : ''}`, 60)
  try {
    const ref = new URL(document.referrer)
    if (ref.host === window.location.host) return ''
    const host = ref.hostname.replace(/^www\./, '')
    if (/(^|\.)google\./.test(host)) return 'Google (busca)'
    if (/(^|\.)bing\.com$/.test(host)) return 'Bing'
    if (/instagram\.com$/.test(host)) return 'Instagram'
    if (/(facebook\.com|fb\.com)$/.test(host)) return 'Facebook'
    if (/(linkedin\.com|lnkd\.in)$/.test(host)) return 'LinkedIn'
    if (/youtube\.com$/.test(host)) return 'YouTube'
    return clip(host, 60)
  } catch {
    return ''
  }
}

// A origem vale para a visita toda: quem entra pelo anúncio e navega até o catálogo continua "Google Ads"
let origem = 'direto'

function rememberOrigem() {
  const found = detectOrigem()
  try {
    if (found) sessionStorage.setItem(ORIGEM_KEY, found)
    else if (!sessionStorage.getItem(ORIGEM_KEY)) sessionStorage.setItem(ORIGEM_KEY, 'direto')
    origem = sessionStorage.getItem(ORIGEM_KEY) || found || 'direto'
  } catch {
    origem = found || 'direto'
  }
}

const pagePath = () => window.location.pathname

/** Onde está o botão: menu, rodapé, flutuante ou o id da seção. */
function whereIs(el: Element | null): string {
  if (!el || el === document.body) return 'janela'
  if (el.closest('footer')) return 'rodapé'
  if (el.closest('header, nav')) return 'menu'
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    if (getComputedStyle(node).position === 'fixed') return 'flutuante'
  }
  return el.closest('section[id]')?.id || 'página'
}

/**
 * Acrescenta "Ref: origem · página" ao fim do texto pronto do WhatsApp, para quem atende ver de onde a pessoa veio.
 * Só mexe em links do WhatsApp e não repete a etiqueta. Link sem texto ganha a saudação padrão do site.
 */
function tagUrl(raw: string): string {
  try {
    const url = new URL(raw, window.location.href)
    const text = url.searchParams.get('text')
    if (text && /\bRef: /.test(text)) return raw
    const tagged = `${text ?? 'Olá! Vim pelo site da Venda Forte.'}\n\nRef: ${origem} · ${pagePath() === '/' ? 'home' : clip(pagePath(), 50)}`
    // monta a consulta à mão para manter %20 nos espaços (o WhatsApp lê assim, sem "+")
    const query = [...url.searchParams.keys()]
      .filter((key, index, all) => key !== 'text' && all.indexOf(key) === index)
      .map((key) => `${key}=${encodeURIComponent(url.searchParams.get(key) ?? '')}`)
      .concat(`text=${encodeURIComponent(tagged)}`)
      .join('&')
    return `${url.origin}${url.pathname}?${query}`
  } catch {
    return raw
  }
}

/**
 * Eventos do GA4 para as três ações que valem como contato: WhatsApp, telefone e formulário.
 * Fica num ponto só porque o site tem três formulários e links de WhatsApp espalhados por 15 arquivos.
 * Marque `click_whatsapp`, `click_phone` e `generate_lead` como eventos-chave no GA4.
 *
 * Parâmetros enviados (cadastre como dimensões personalizadas, escopo Evento): `pagina`, `botao` e `origem`.
 * O link do WhatsApp não vai mais no evento: ele carrega a mensagem que a pessoa digitou (nome, empresa).
 * A origem também entra no texto pronto do WhatsApp ("Ref: Google Ads · /promo"), para a equipe ver na conversa.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    rememberOrigem()

    // Clique normal, clique do meio e botão direito: a etiqueta entra no link antes de ele abrir; só os cliques contam no GA4
    const onPointer = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]')
      if (!link) return
      const href = link.getAttribute('href') || ''
      const counts = e.type === 'click' || (e.type === 'auxclick' && e.button === 1)
      if (isWhatsApp(href)) {
        link.setAttribute('href', tagUrl(href))
        if (counts) {
          const label = (link.textContent || '').trim().replace(/\s+/g, ' ')
          send('click_whatsapp', { pagina: pagePath(), botao: clip(`${whereIs(link)}${label ? `: ${label}` : ''}`, 80), origem })
        }
      } else if (counts && href.startsWith('tel:')) {
        send('click_phone', { link_url: href, pagina: pagePath(), botao: whereIs(link), origem })
      }
    }
    const kinds = ['click', 'auxclick', 'contextmenu'] as const
    kinds.forEach((kind) => document.addEventListener(kind, onPointer, true))

    // Alguns botões abrem o WhatsApp por window.open, sem link na página
    const originalOpen = window.open
    window.open = function (this: Window, url?: string | URL, ...rest: unknown[]) {
      let next: string | URL | undefined = url
      const target = String(url ?? '')
      if (isWhatsApp(target)) {
        send('click_whatsapp', { pagina: pagePath(), botao: whereIs(document.activeElement), origem })
        next = tagUrl(target)
      }
      return (originalOpen as (...args: unknown[]) => Window | null).call(this, next, ...rest)
    } as typeof window.open

    // Formulário enviado com sucesso: os três formulários chamam /api/send-email
    const originalFetch = window.fetch
    window.fetch = async function (this: unknown, input: RequestInfo | URL, init?: RequestInit) {
      const response = await originalFetch.call(window, input, init)
      try {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url
        if (response.ok && url.includes('/api/send-email')) send('generate_lead', { pagina: pagePath(), origem })
      } catch {
        // medir nunca pode atrapalhar o envio
      }
      return response
    }

    return () => {
      kinds.forEach((kind) => document.removeEventListener(kind, onPointer, true))
      window.open = originalOpen
      window.fetch = originalFetch
    }
  }, [])

  return null
}
