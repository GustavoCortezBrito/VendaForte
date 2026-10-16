import BlogListing from '@/components/blog/BlogListing'
import { loadListing, listingMetadata, SITE_URL } from '@/lib/blog-listing'

/**
 * Os posts são lidos no servidor, então o HTML já sai com todos os artigos (o
 * Google vê a listagem pronta). Revalida a cada 10 minutos, e o admin força a
 * atualização na hora ao publicar.
 */
export const revalidate = 600

export async function generateMetadata() {
  const listing = await loadListing(undefined, 1)
  return listing ? listingMetadata(listing) : {}
}

export default async function BlogPage() {
  const listing = await loadListing(undefined, 1)
  if (!listing) return null

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Venda Forte',
    description:
      'Fichas técnicas explicadas, comparativos e guias de decisão sobre empilhadeiras elétricas de lítio EP Equipment.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Grupo Venda Forte',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    blogPost: listing.posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <BlogListing posts={listing.posts} />
    </>
  )
}
