/**
 * Lógica da listagem do blog, pura e sem dependências do servidor: roda no
 * navegador, que filtra e pagina sem trocar de página, e no servidor, que
 * entrega o HTML completo de cada endereço para o Google.
 *
 * Na primeira página de "todos" o primeiro post da ordem escolhida (o mais recente
 * ou o mais antigo) vira destaque e não entra na contagem das páginas. A conta é a
 * mesma nas duas ordens, então os endereços /blog/page/N existem em ambas.
 */
import {
  POSTS_PER_PAGE,
  categoryList,
  categoryOf,
  type BlogPostSummary,
  type CategoryInfo,
} from './blog-format'

/** Ordem da lista: do mais novo ao mais velho (padrão) ou o contrário. */
export type SortOrder = 'recentes' | 'antigos'

/** Parâmetro do endereço que guarda a ordem: /blog?ordem=antigos. */
export const SORT_PARAM = 'ordem'

/** Lê a ordem de um trecho de busca do endereço (`?ordem=antigos`). */
export function sortFromSearch(search: string): SortOrder {
  return new URLSearchParams(search).get(SORT_PARAM) === 'antigos' ? 'antigos' : 'recentes'
}

/** Trecho a somar ao endereço para manter a ordem; vazio na ordem padrão. */
export function sortSuffix(sort: SortOrder): string {
  return sort === 'antigos' ? `?${SORT_PARAM}=antigos` : ''
}

export interface Listing {
  /** Todos os posts: alimentam a busca e as contagens das categorias. */
  posts: BlogPostSummary[]
  categories: CategoryInfo[]
  category: CategoryInfo | null
  sort: SortOrder
  page: number
  totalPages: number
  featured: BlogPostSummary | null
  /** Cartões da página, sem o destaque. */
  items: BlogPostSummary[]
  /** Faixa exibida ("10–14 de 14"), contada na ordem escolhida. */
  range: { from: number; to: number; total: number }
}

/** Quantas páginas a listagem tem, para `generateStaticParams`. */
export function totalPagesFor(posts: BlogPostSummary[], categoryName?: string): number {
  const pool = categoryName ? posts.filter((post) => categoryOf(post) === categoryName) : posts.slice(1)
  return Math.max(1, Math.ceil(pool.length / POSTS_PER_PAGE))
}

/** Monta uma página da listagem, ou `null` se a categoria ou a página não existirem. */
export function buildListing(
  posts: BlogPostSummary[],
  categorySlug: string | undefined,
  page: number,
  sort: SortOrder = 'recentes'
): Listing | null {
  const categories = categoryList(posts)

  const category = categorySlug ? (categories.find((item) => item.slug === categorySlug) ?? null) : null
  if (categorySlug && !category) return null

  // `posts` chega do mais recente ao mais antigo; "antigos" só inverte
  const ordered = sort === 'antigos' ? [...posts].reverse() : posts
  const pool = category ? ordered.filter((post) => categoryOf(post) === category.name) : ordered
  const rest = category ? pool : pool.slice(1)
  const totalPages = Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE))
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null

  const items = rest.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  const featured = !category && page === 1 ? (pool[0] ?? null) : null

  // Posições, dentro de `pool`, do primeiro e do último artigo exibidos (1 = o primeiro da ordem).
  // Na primeira página geral o destaque é o 1º e os cartões seguem a partir do 2º.
  const offset = (category ? 0 : 1) + (page - 1) * POSTS_PER_PAGE
  const from = featured ? 1 : offset + 1
  const to = featured ? 1 + items.length : offset + items.length

  return { posts, categories, category, sort, page, totalPages, featured, items, range: { from, to, total: pool.length } }
}

/**
 * Lê categoria e página de um endereço da listagem:
 * /blog, /blog/page/2, /blog/categoria/x, /blog/categoria/x/page/2.
 */
export function parseBlogPath(pathname: string): { category?: string; page: number } {
  const parts = pathname.split('/').filter(Boolean)
  let at = 1 // parts[0] é "blog"

  let category: string | undefined
  if (parts[at] === 'categoria' && parts[at + 1]) {
    category = decodeURIComponent(parts[at + 1])
    at += 2
  }

  const number = parts[at] === 'page' ? parts[at + 1] : undefined
  return { category, page: number && /^\d+$/.test(number) ? Number(number) : 1 }
}

/** Título da aba do navegador para uma página da listagem. */
export function listingTitle({ category, page }: { category: CategoryInfo | null; page: number }): string {
  const suffix = page > 1 ? ` – Página ${page}` : ''
  return category
    ? `${category.name} | Blog Venda Forte${suffix}`
    : `Blog Venda Forte | Guias sobre empilhadeiras elétricas${suffix}`
}

