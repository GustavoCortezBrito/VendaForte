/**
 * Helpers puros do blog. Sem `fs` nem Supabase, então servem ao servidor e ao
 * navegador.
 */

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  /** `AAAA-MM-DD` (posts em arquivo) ou data e hora ISO (posts do Supabase). */
  date: string
  author: string
  image: string
  category: string
  tags: string[]
  readingTime: string
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Data por extenso em português. Uma data sem hora (`2026-08-08`) é lida como
 * UTC pelo JavaScript; formatá-la no fuso local mostrava sempre o dia anterior.
 * Datas com hora seguem o horário de Brasília.
 */
export function formatPostDate(date: string, style: 'long' | 'short' = 'long'): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: DATE_ONLY.test(date) ? 'UTC' : 'America/Sao_Paulo',
  })
}

/** Atributo `datetime` para a tag `<time>`. */
export function postDateTime(date: string): string {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}

/** Texto sem acentos, minúsculo e com hifens, para ids de títulos. */
export function slugifyText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Categoria vazia vira "Geral", como já acontecia no cadastro. */
export function categoryOf(post: Pick<BlogPostSummary, 'category'>): string {
  return post.category?.trim() || 'Geral'
}

/** Artigos por página, fora o destaque da primeira. */
export const POSTS_PER_PAGE = 9

export interface CategoryInfo {
  name: string
  /** Trecho do endereço: /blog/categoria/<slug>. */
  slug: string
  count: number
}

/** Categorias com seus totais, das mais cheias às mais vazias. */
export function categoryList(posts: BlogPostSummary[]): CategoryInfo[] {
  const bySlug = new Map<string, CategoryInfo>()
  for (const post of posts) {
    const name = categoryOf(post)
    const slug = slugifyText(name) || 'geral'
    const current = bySlug.get(slug)
    if (current) current.count += 1
    else bySlug.set(slug, { name, slug, count: 1 })
  }
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'))
}

/** Endereço de uma página da listagem: /blog, /blog/page/2, /blog/categoria/x/page/2. */
export function blogHref({ category, page = 1 }: { category?: string; page?: number } = {}): string {
  const base = category ? `/blog/categoria/${category}` : '/blog'
  return page > 1 ? `${base}/page/${page}` : base
}

/**
 * Números de página a exibir: todos quando são poucos; do contrário a primeira,
 * a última e a vizinhança da atual, com reticências no meio.
 */
export function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const pages = new Set([1, total, current - 1, current, current + 1])
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page))
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((page) => pages.add(page))

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  return sorted.flatMap((page, index) => {
    const skipped = index > 0 ? page - sorted[index - 1] - 1 : 0
    if (skipped === 0) return [page]
    // Reticências no lugar de uma página só seriam pior do que mostrar a página
    return skipped === 1 ? [page - 1, page] : ['gap' as const, page]
  })
}

/**
 * Posts parecidos com o atual: mesma categoria pesa mais que tags em comum.
 * Sem nenhuma afinidade, completa com os mais recentes.
 */
export function relatedPosts<T extends BlogPostSummary>(all: T[], current: BlogPostSummary, count = 3): T[] {
  const currentTags = new Set(current.tags.map((tag) => tag.toLowerCase()))
  const scored = all
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length
      const sameCategory = categoryOf(post) === categoryOf(current) ? 3 : 0
      return { post, score: sameCategory + sharedTags }
    })
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())

  return scored.slice(0, count).map(({ post }) => post)
}

export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

/** Foto do catálogo da EP (fundo branco), servida pelo CDN deles. */
export function isStudioProductShot(src: string): boolean {
  try {
    return new URL(src).hostname === 'cdn.ep-portal.net'
  } catch {
    return false
  }
}

/** Hosts em que `next/image` pode otimizar (os mesmos de `next.config.ts`). */
const OPTIMIZABLE_HOSTS = [/^cdn\.ep-portal\.net$/, /\.supabase\.co$/]

/**
 * `next/image` falha em hosts fora da lista, e o admin aceita qualquer URL de
 * imagem. Fora da lista, o chamador cai numa `<img>` comum.
 */
export function canOptimizeImage(src: string): boolean {
  if (src.startsWith('/')) return true
  try {
    const { hostname } = new URL(src)
    return OPTIMIZABLE_HOSTS.some((pattern) => pattern.test(hostname))
  } catch {
    return false
  }
}
