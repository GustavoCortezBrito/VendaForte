/**
 * Listagem do blog no servidor: carrega os posts, valida a categoria e a página
 * de cada rota e monta os metadados. A lógica de montagem fica em `blog-list.ts`,
 * que o navegador também usa para filtrar sem trocar de página.
 *
 * Cada página é uma URL própria e estática, com links comuns entre elas: é o
 * que o Google consegue seguir, ao contrário de uma paginação feita só no
 * navegador.
 */
import type { Metadata } from 'next'
import { listPosts } from '@/lib/blog-data'
import { blogHref } from '@/lib/blog-format'
import { buildListing, listingTitle, type Listing } from '@/lib/blog-list'
import { SITE_URL } from '@/lib/site'

export { totalPagesFor, type Listing } from '@/lib/blog-list'

export { SITE_URL }

/** Carrega uma página da listagem, ou `null` se a categoria ou a página não existirem. */
export async function loadListing(categorySlug: string | undefined, page: number): Promise<Listing | null> {
  return buildListing(await listPosts(), categorySlug, page)
}

const BASE_DESCRIPTION =
  'Fichas técnicas explicadas, comparativos e guias de decisão sobre empilhadeiras elétricas de lítio EP Equipment, escritos pela equipe da Venda Forte.'

/**
 * Metadados de uma página da listagem: título e descrição próprios (páginas
 * repetidas confundem os buscadores), canonical apontando para si mesma e
 * links para a anterior e a próxima.
 */
export function listingMetadata({ category, page, totalPages }: Pick<Listing, 'category' | 'page' | 'totalPages'>): Metadata {
  const title = listingTitle({ category, page })
  const description = category
    ? `Artigos de ${category.name} no blog da Venda Forte: fichas técnicas, comparativos e guias sobre empilhadeiras elétricas.${page > 1 ? ` Página ${page}.` : ''}`
    : `${BASE_DESCRIPTION}${page > 1 ? ` Página ${page}.` : ''}`

  const hrefFor = (target: number) => `${SITE_URL}${blogHref({ category: category?.slug, page: target })}`
  const url = hrefFor(page)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    pagination: {
      ...(page > 1 && { previous: hrefFor(page - 1) }),
      ...(page < totalPages && { next: hrefFor(page + 1) }),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Venda Forte',
      type: 'website',
      images: [{ url: `${SITE_URL}/sede.png`, width: 1200, height: 630, alt: 'Blog Venda Forte' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/sede.png`] },
  }
}
