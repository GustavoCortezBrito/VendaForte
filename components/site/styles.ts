/**
 * Classes do site público, as mesmas da campanha /promo (components/promo/ui.tsx e seções).
 * Ficam num arquivo sem "use client" para valerem também em componentes de servidor.
 */

/** Seção padrão: fundo ink, linha fina no topo e o mesmo respiro da campanha. */
export const SECTION = 'scroll-mt-24 border-t border-white/[0.06] bg-ink py-16 lg:py-24'

export const CONTAINER = 'mx-auto max-w-7xl px-6 lg:px-8'

/** Título de seção da campanha. */
export const TITLE =
  'text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] lg:text-5xl'

/** Rótulo acima do título: texto simples, vermelho, sem caixa. */
export const EYEBROW = 'text-sm font-semibold text-red-500'

/** Parágrafo de abertura logo abaixo do título. */
export const LEAD = 'text-pretty text-lg leading-relaxed text-neutral-400'

/** Cartão da campanha. */
export const CARD = 'rounded-[28px] border border-white/10 bg-ink-raised'

/** Cartão que é link: a borda acende no hover. */
export const CARD_LINK =
  'group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised transition-colors duration-500 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60'

/** Círculo do ícone dos cartões. */
export const ICON_BADGE = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500'

const BTN =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const BTN_PRIMARY = `${BTN} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-500`
export const BTN_GHOST = `${BTN} border border-white/15 text-white hover:bg-white/10 focus-visible:outline-white`
/** Verde é exclusivo do WhatsApp. */
export const BTN_WHATSAPP = `${BTN} bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-500`

/** Pílula de filtro: ativa em branco, como as abas de assunto do FAQ da campanha. */
export const CHIP =
  'cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50'
export const CHIP_ON = `${CHIP} border-white bg-white text-ink`
export const CHIP_OFF = `${CHIP} border-white/10 text-neutral-400 hover:border-white/25 hover:text-white`

/**
 * Fundo de estúdio das fotos de produto: as fotos do catálogo são recortes de fundo branco desenhados com
 * `mix-blend-mode: multiply`, então o quadro precisa ser claro. O degradê suave dá a luz de um estúdio, em
 * vez do branco chapado que parecia um adesivo no site escuro.
 */
/**
 * Palco escuro para o produto sem fundo (ver lib/product-photo.ts): um foco de luz suave no centro, como o
 * estúdio da DS3 na /promo.
 */
export const PRODUCT_STAGE = 'bg-[radial-gradient(ellipse_at_50%_42%,#2d2d33_0%,#18181b_58%,#0d0d0f_100%)]'

export const PHOTO_STUDIO = 'bg-[radial-gradient(ellipse_at_50%_38%,#ffffff_0%,#f1f2f5_62%,#e3e6eb_100%)]'

/** Etiqueta neutra (cidade, assunto). */
export const TAG = 'rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-neutral-300'

export const INPUT =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder:text-ink-muted transition-colors focus:border-red-500/70 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-red-500/15'

export const LABEL = 'mb-2 block text-sm font-medium text-neutral-300'
