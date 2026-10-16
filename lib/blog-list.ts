/**
 * Lógica da listagem do blog, pura e sem dependências do servidor: roda no
 * navegador, que filtra e pagina sem trocar de página, e no servidor, que
 * entrega o HTML completo de cada endereço para o Google.
 *
 * Na primeira página de "todos" o post mais recente vira destaque e não entra
 * na contagem das páginas.
 */
import {
  POSTS_PER_PAGE,
  categoryList,
  categoryOf,
  type BlogPostSummary,
  type CategoryInfo,
} from './blog-format'

export interface Listing {
  /** Todos os posts: alimentam a busca e as contagens das categorias. */
  posts: BlogPostSummary[]
  categories: CategoryInfo[]
  category: CategoryInfo | null
  page: number
  totalPages: number
  featured: BlogPostSummary | null
  /** Cartões da página, sem o destaque. */
  items: BlogPostSummary[]
  /** Faixa exibida ("10–14 de 14"). */
  range: { from: number; to: number; total: number }
}

/** Quantas páginas a listagem tem, para `generateStaticParams`. */
export function totalPagesFor(posts: BlogPostSummary[], categoryName?: string): number {
  const pool = categoryName ? posts.filter((post) => categoryOf(post) === categoryName) : posts.slice(1)
  return Math.max(1, Math.ceil(pool.length / POSTS_PER_PAGE))
}

/** Monta uma página da listagem, ou `null` se a categoria ou a página não existirem. */
export function buildListing(posts: BlogPostSummary[], categorySlug: string | undefined, page: number): Listing | null {
  const categories = categoryList(posts)

  const category = categorySlug ? (categories.find((item) => item.slug === categorySlug) ?? null) : null
  if (categorySlug && !category) return null

  const pool = category ? posts.filter((post) => categoryOf(post) === category.name) : posts
  const rest = category ? pool : pool.slice(1)
  const totalPages = Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE))
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null

  const items = rest.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  const featured = !category && page === 1 ? (pool[0] ?? null) : null

  // Posições, dentro de `pool`, do primeiro e do último artigo exibidos (1 = o mais recente).
  // Na primeira página geral o destaque é o 1º e os cartões seguem a partir do 2º.
  const offset = (category ? 0 : 1) + (page - 1) * POSTS_PER_PAGE
  const from = featured ? 1 : offset + 1
  const to = featured ? 1 + items.length : offset + items.length

  return { posts, categories, category, page, totalPages, featured, items, range: { from, to, total: pool.length } }
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

