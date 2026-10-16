import { notFound } from 'next/navigation'
import BlogListing from '@/components/blog/BlogListing'
import { listPosts } from '@/lib/blog-data'
import { categoryList } from '@/lib/blog-format'
import { listingMetadata, loadListing } from '@/lib/blog-listing'

/** Primeira página de uma categoria: /blog/categoria/<categoria>. */
export const revalidate = 600

export async function generateStaticParams() {
  const posts = await listPosts()
  return categoryList(posts).map((category) => ({ categoria: category.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params
  const listing = await loadListing(categoria, 1)
  return listing ? listingMetadata(listing) : { robots: { index: false } }
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params
  const listing = await loadListing(categoria, 1)
  if (!listing) notFound()
  return <BlogListing posts={listing.posts} />
}
