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

/** Estilo do corpo de um artigo (usado na página pública e na visualização de rascunhos do admin). */
export const PROSE = [
  'prose prose-lg max-w-none',
  'prose-headings:scroll-mt-28 prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900',
  'prose-h2:mb-5 prose-h2:mt-14 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl',
  'prose-p:leading-relaxed prose-p:text-gray-700',
  'prose-a:font-semibold prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline',
  'prose-strong:font-semibold prose-strong:text-gray-900',
  'prose-li:text-gray-700 prose-li:marker:text-gray-400',
  'prose-hr:my-12 prose-hr:border-gray-200',
  'prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-50/60 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-gray-800',
  // Sem as aspas decorativas que o plugin acrescenta antes e depois do parágrafo
  '[&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none',
  'prose-img:my-8 prose-img:h-auto prose-img:w-full prose-img:rounded-2xl prose-img:shadow-lg',
  'prose-thead:border-0 prose-th:bg-gray-900 prose-th:px-4 prose-th:py-3 prose-th:text-white prose-td:px-4 prose-td:py-3 prose-td:text-gray-700',
  '[&_tbody_tr:nth-child(even)]:bg-gray-50',
  // Tabelas feitas no editor do admin guardam o texto das células dentro de <p>
  '[&_td_p]:m-0 [&_th_p]:m-0 [&_th_p]:text-white',
  // Tabelas dentro de um contêiner que rola na horizontal (ver `enhanceHtml`)
  '[&_.blog-table]:my-8 [&_.blog-table]:overflow-x-auto [&_.blog-table]:rounded-2xl [&_.blog-table]:border [&_.blog-table]:border-gray-200 [&_.blog-table]:shadow-sm [&_.blog-table_table]:my-0 [&_.blog-table_table]:min-w-[34rem]',
  // Checklists do Markdown (- [ ] item)
  '[&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0 [&_.task-list-item]:flex [&_.task-list-item]:items-start [&_.task-list-item]:gap-3 [&_.task-list-item_input]:mt-2 [&_.task-list-item_input]:accent-red-600',
].join(' ')
