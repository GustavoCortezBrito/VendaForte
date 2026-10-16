/**
 * Classes compartilhadas do blog, no tema claro do site principal: fundo branco
 * e cinza, texto cinza-900, vermelho-600 como cor de destaque. Ficam num módulo
 * comum (sem "use client") para componentes de servidor e de cliente usarem.
 */

/** Etiqueta acima dos títulos, igual à das seções da página inicial. */
export const EYEBROW =
  'inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-600'

const BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const BTN_RED = `${BTN} bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 focus-visible:outline-red-600`
export const BTN_GREEN = `${BTN} bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700 focus-visible:outline-green-600`
export const BTN_LINE = `${BTN} border border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-gray-900`
/** Botão branco para fundos vermelhos. */
export const BTN_WHITE = `${BTN} bg-white text-red-600 hover:bg-red-50 focus-visible:outline-white`
/** Botão de contorno para fundos escuros. */
export const BTN_DARK_LINE = `${BTN} border border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 focus-visible:outline-white`

/** Largura e respiro lateral das seções. */
export const CONTAINER = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'

/** Título de seção, no peso e no tamanho da página inicial. */
export const H2 = 'text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl'
