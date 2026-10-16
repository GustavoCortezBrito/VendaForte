import { notFound, permanentRedirect } from 'next/navigation'
import BlogListing from '@/components/blog/BlogListing'
import { listPosts } from '@/lib/blog-data'
import { blogHref } from '@/lib/blog-format'
import { listingMetadata, loadListing, totalPagesFor } from '@/lib/blog-listing'

/** Páginas 2 em diante da listagem geral: /blog/page/2. A primeira é /blog. */
export const revalidate = 600

export async function generateStaticParams() {
  const posts = await listPosts()
  return Array.from({ length: totalPagesFor(posts) - 1 }, (_, index) => ({ page: String(index + 2) }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const listing = await loadListing(undefined, Number(page))
  return listing ? listingMetadata(listing) : {}
}

export default async function BlogPageN({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  if (!/^\d+$/.test(page)) notFound()
  // "/blog/page/1" é a mesma página que "/blog": redirecionamento permanente (308)
  if (Number(page) === 1) permanentRedirect(blogHref())

  const listing = await loadListing(undefined, Number(page))
  if (!listing) notFound()
  return <BlogListing posts={listing.posts} />
}
