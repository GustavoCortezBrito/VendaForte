/**
 * Classes do painel, as mesmas peças do site e da /promo (components/site/styles.ts) em tamanho de
 * ferramenta: um pouco mais compactas, sempre com foco visível e alvos de toque de 40 a 44 px.
 * Sem "use client", valem em servidor e cliente.
 */
export { CARD, CARD_LINK, EYEBROW, ICON_BADGE, INPUT, LABEL, TAG } from '@/components/site/styles'

const BTN =
  'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-50'

export const BTN_PRIMARY = `${BTN} bg-red-600 text-white hover:bg-red-700`
export const BTN_GHOST = `${BTN} border border-white/15 text-white hover:bg-white/10`
export const BTN_WHITE = `${BTN} bg-white text-ink hover:bg-neutral-200`

/** Botão só de ícone: 44 px, contorno fino. Sempre leva `aria-label`. */
export const BTN_ICON =
  'grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 text-neutral-300 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

/** Título de página do painel. */
export const PAGE_TITLE = 'text-balance text-3xl font-bold leading-[1.05] tracking-[-0.035em] text-white lg:text-4xl'

/** Pílula de filtro: ativa em branco, como no catálogo do site. */
export const CHIP_ON = 'cursor-pointer rounded-full border border-white bg-white px-4 py-2 text-sm font-medium text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50'
export const CHIP_OFF =
  'cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50'

/** Etiqueta de estado (rascunho, no ar). O tom vem do significado, não de enfeite. */
export const BADGE = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium'
export const BADGE_DRAFT = `${BADGE} border-amber-500/30 bg-amber-500/10 text-amber-300`
export const BADGE_LIVE = `${BADGE} border-emerald-500/30 bg-emerald-500/10 text-emerald-300`
export const BADGE_INFO = `${BADGE} border-white/10 text-neutral-300`
