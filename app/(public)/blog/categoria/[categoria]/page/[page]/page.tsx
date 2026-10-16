import { notFound, permanentRedirect } from 'next/navigation'
import BlogListing from '@/components/blog/BlogListing'
import { listPosts } from '@/lib/blog-data'
import { blogHref, categoryList } from '@/lib/blog-format'
import { listingMetadata, loadListing, totalPagesFor } from '@/lib/blog-listing'

/** Páginas 2 em diante de uma categoria: /blog/categoria/<categoria>/page/2. */
export const revalidate = 600

export async function generateStaticParams() {
  const posts = await listPosts()
  return categoryList(posts).flatMap((category) =>
    Array.from({ length: totalPagesFor(posts, category.name) - 1 }, (_, index) => ({
      categoria: category.slug,
      page: String(index + 2),
    }))
  )
}

type Params = Promise<{ categoria: string; page: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { categoria, page } = await params
  const listing = await loadListing(categoria, Number(page))
  return listing ? listingMetadata(listing) : { robots: { index: false } }
}

export default async function BlogCategoryPageN({ params }: { params: Params }) {
  const { categoria, page } = await params
  if (!/^\d+$/.test(page)) notFound()
  if (Number(page) === 1) permanentRedirect(blogHref({ category: categoria }))

  const listing = await loadListing(categoria, Number(page))
  if (!listing) notFound()
  return <BlogListing posts={listing.posts} />
}
