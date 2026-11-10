'use client'

import { useEffect } from 'react'

type Gtag = (command: 'event', name: string, params?: Record<string, string>) => void

const send = (name: string, params: Record<string, string>) => {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag === 'function') gtag('event', name, { transport_type: 'beacon', ...params })
}

const isWhatsApp = (url: string) => /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\b/i.test(url)

/**
 * Eventos do GA4 para as três ações que valem como contato: WhatsApp, telefone e formulário.
 * Fica num ponto só porque o site tem três formulários e links de WhatsApp espalhados por 15 arquivos.
 * Marque `click_whatsapp`, `click_phone` e `generate_lead` como eventos-chave no GA4.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]')
      if (!link) return
      const href = link.getAttribute('href') || ''
      const page = window.location.pathname
      if (isWhatsApp(href)) send('click_whatsapp', { link_url: href, page_path: page })
      else if (href.startsWith('tel:')) send('click_phone', { link_url: href, page_path: page })
    }
    document.addEventListener('click', onClick, true)

    // Alguns botões abrem o WhatsApp por window.open, sem link na página
    const originalOpen = window.open
    window.open = function (this: Window, url?: string | URL, ...rest: unknown[]) {
      const target = String(url ?? '')
      if (isWhatsApp(target)) send('click_whatsapp', { link_url: target, page_path: window.location.pathname })
      return (originalOpen as (...args: unknown[]) => Window | null).call(this, url, ...rest)
    } as typeof window.open

    // Formulário enviado com sucesso: os três formulários chamam /api/send-email
    const originalFetch = window.fetch
    window.fetch = async function (this: unknown, input: RequestInfo | URL, init?: RequestInit) {
      const response = await originalFetch.call(window, input, init)
      try {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url
        if (response.ok && url.includes('/api/send-email')) send('generate_lead', { page_path: window.location.pathname })
      } catch {
        // medir nunca pode atrapalhar o envio
      }
      return response
    }

    return () => {
      document.removeEventListener('click', onClick, true)
      window.open = originalOpen
      window.fetch = originalFetch
    }
  }, [])

  return null
}
