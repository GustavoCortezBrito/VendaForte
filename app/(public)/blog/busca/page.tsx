import { Suspense } from 'react'
import type { Metadata } from 'next'
import BlogHeader from '@/components/blog/BlogHeader'
import SearchPage from '@/components/blog/SearchPage'
import { listPosts } from '@/lib/blog-data'
import { categoryList } from '@/lib/blog-format'
import { SITE_URL } from '@/lib/blog-listing'

export const revalidate = 600

// Páginas de resultado de busca não devem aparecer no Google
export const metadata: Metadata = {
  title: { absolute: 'Buscar no blog | Venda Forte' },
  description: 'Busque nos artigos do blog da Venda Forte.',
  alternates: { canonical: `${SITE_URL}/blog/busca` },
  robots: { index: false, follow: true },
}

export default async function BlogSearchRoute() {
  const posts = await listPosts()

  return (
    // `useSearchParams` exige o Suspense; até o navegador ler a busca, aparece a abertura vazia
    <Suspense fallback={<BlogHeader eyebrow="Busca" title="Buscar no blog" />}>
      <SearchPage posts={posts} categories={categoryList(posts)} />
    </Suspense>
  )
}
