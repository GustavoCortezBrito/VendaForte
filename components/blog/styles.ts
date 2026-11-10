/**
 * Classes compartilhadas do blog, no tema claro do site principal: fundo branco
 * e cinza, texto cinza-900, vermelho-600 como cor de destaque. Ficam num módulo
 * comum (sem "use client") para componentes de servidor e de cliente usarem.
 */

/** Etiqueta acima dos títulos, igual à das seções da página inicial. */
/** Rótulo da campanha: texto simples, vermelho, sem caixa. */
export const EYEBROW = 'text-sm font-semibold text-red-500'

const BTN =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const BTN_RED = `${BTN} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600`
export const BTN_GREEN = `${BTN} bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-500`
export const BTN_LINE = `${BTN} border border-white/15 text-white hover:bg-white/10 focus-visible:outline-white`
/** Botão branco para fundos vermelhos. */
export const BTN_WHITE = `${BTN} bg-ink-raised text-red-500 hover:bg-red-500/10 focus-visible:outline-white`
/** Botão de contorno para fundos escuros. */
export const BTN_DARK_LINE = `${BTN} border border-white/15 text-white hover:bg-white/10 focus-visible:outline-white`

/** Largura e respiro lateral das seções. */
export const CONTAINER = 'mx-auto max-w-7xl px-6 lg:px-8'

/** Título de seção, no peso e no tamanho da página inicial. */
export const H2 = 'text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl'

/** Estilo do corpo de um artigo (usado na página pública e na visualização de rascunhos do admin). */
export const PROSE = [
  'prose prose-lg max-w-none',
  'prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white',
  'prose-h2:mb-5 prose-h2:mt-14 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl',
  'prose-p:leading-relaxed prose-p:text-neutral-300',
  'prose-a:font-semibold prose-a:text-red-500 prose-a:no-underline hover:prose-a:underline',
  'prose-strong:font-semibold prose-strong:text-white',
  'prose-li:text-neutral-300 prose-li:marker:text-ink-muted',
  'prose-hr:my-12 prose-hr:border-white/10',
  'prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-50/60 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-white',
  // Sem as aspas decorativas que o plugin acrescenta antes e depois do parágrafo
  '[&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none',
  'prose-img:my-8 prose-img:h-auto prose-img:w-full prose-img:rounded-2xl prose-img:shadow-lg',
  'prose-thead:border-0 prose-th:bg-ink-raised prose-th:px-4 prose-th:py-3 prose-th:text-white prose-td:px-4 prose-td:py-3 prose-td:text-neutral-300',
  '[&_tbody_tr:nth-child(even)]:bg-white/5',
  // Tabelas feitas no editor do admin guardam o texto das células dentro de <p>
  '[&_td_p]:m-0 [&_th_p]:m-0 [&_th_p]:text-white',
  // Tabelas dentro de um contêiner que rola na horizontal (ver `enhanceHtml`)
  '[&_.blog-table]:my-8 [&_.blog-table]:overflow-x-auto [&_.blog-table]:rounded-2xl [&_.blog-table]:border [&_.blog-table]:border-white/10 [&_.blog-table]:shadow-sm [&_.blog-table_table]:my-0 [&_.blog-table_table]:min-w-[34rem]',
  // Checklists do Markdown (- [ ] item)
  '[&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0 [&_.task-list-item]:flex [&_.task-list-item]:items-start [&_.task-list-item]:gap-3 [&_.task-list-item_input]:mt-2 [&_.task-list-item_input]:accent-red-600',
].join(' ')
