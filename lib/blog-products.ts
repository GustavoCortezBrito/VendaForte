/**
 * Liga posts às três máquinas da campanha, pelas tags do post. Os dados vêm de
 * `promo.config.ts`, a mesma fonte da página /promo, para não divergirem.
 */
import { PRODUCTS, type ProductId } from '@/components/promo/promo.config'
import type { BlogPostSummary } from '@/lib/blog-format'

export interface BlogProduct {
  id: ProductId
  name: string
  shortName: string
  category: string
  capacity: string
  tagline: string
  /** Âncora da máquina na página da campanha. */
  href: string
  /** Capa 16:9 do guia da máquina, a mesma do post. */
  image: string
  imageAlt: string
  /** Tags que ligam um post a esta máquina, em minúsculas. */
  tags: string[]
}

/**
 * Capas 16:9 em vez das fotos de estúdio da campanha: estas são quadradas e,
 * dentro de um cartão largo, ficavam pequenas no meio de uma faixa preta.
 */
const IMAGES: Record<ProductId, { src: string; alt: string }> = {
  ds3: { src: '/blog/covers/ds3-guia.webp', alt: 'Empilhadeira patolada EP DS3 com o mastro elevado' },
  efl302b3: { src: '/blog/covers/efl302b3-guia.webp', alt: 'Empilhadeira contrabalançada EP EFL302 B3 em vista três quartos' },
  f4: { src: '/blog/covers/f4-guia.webp', alt: 'Paleteira elétrica EP F4 entre as estantes de um armazém' },
}

const TAGS: Record<ProductId, string[]> = {
  ds3: ['ds3'],
  efl302b3: ['efl302 b3', 'efl302b3'],
  f4: ['f4'],
}

export const BLOG_PRODUCTS: BlogProduct[] = (['ds3', 'efl302b3', 'f4'] as const).map((id) => ({
  id,
  name: PRODUCTS[id].name,
  shortName: PRODUCTS[id].shortName,
  category: PRODUCTS[id].category,
  capacity: PRODUCTS[id].capacity,
  tagline: PRODUCTS[id].tagline,
  href: `/promo#${id}`,
  image: IMAGES[id].src,
  imageAlt: IMAGES[id].alt,
  tags: TAGS[id],
}))

const hasProductTag = (post: Pick<BlogPostSummary, 'tags'>, product: BlogProduct) =>
  post.tags.some((tag) => product.tags.includes(tag.trim().toLowerCase()))

const productsOf = (post: Pick<BlogPostSummary, 'tags'>) =>
  BLOG_PRODUCTS.filter((product) => hasProductTag(post, product))

/**
 * A máquina de que o post trata. Um comparativo cita mais de uma, então não
 * aponta para nenhuma em especial.
 */
export function productForPost(post: Pick<BlogPostSummary, 'tags'>): BlogProduct | null {
  const found = productsOf(post)
  return found.length === 1 ? found[0] : null
}

/**
 * O post mais recente de cada máquina, para o bloco "guias por máquina".
 * Prefere o post só daquela máquina ao comparativo que cita todas.
 */
export function guidesByProduct(posts: BlogPostSummary[]): { product: BlogProduct; post: BlogPostSummary }[] {
  return BLOG_PRODUCTS.flatMap((product) => {
    const post =
      posts.find((candidate) => productForPost(candidate)?.id === product.id) ??
      posts.find((candidate) => hasProductTag(candidate, product))
    return post ? [{ product, post }] : []
  })
}
