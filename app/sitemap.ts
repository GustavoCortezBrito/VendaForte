import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { getAllPosts as getAllPostsFromFiles } from '@/lib/blog'
import { listPosts } from '@/lib/blog-data'
import { blogHref, categoryList } from '@/lib/blog-format'
import { totalPagesFor } from '@/lib/blog-listing'
import { SITE_URL } from '@/lib/site'
import forkliftsData from '@/lib/data/electric-forklifts.json'

type PostDates = { updated_at?: string; created_at?: string; date?: string }

/** Data real do post: a última edição, ou a de publicação. */
const postDate = (post: PostDates): Date | undefined => {
  const raw = post.updated_at ?? post.created_at ?? post.date
  return raw ? new Date(raw) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  // Páginas fixas. Sem `lastModified`: não há data real de alteração, e uma data de "hoje" em todas as URLs
  // faz o Google desconfiar das datas do sitemap. Âncoras (#) não entram: o Google as trata como a mesma página.
  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/produtos`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/promo`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/sobre`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacidade`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/termos`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Uma página por modelo do catálogo
  const productUrls: MetadataRoute.Sitemap = (forkliftsData as { slug: string }[]).map((product) => ({
    url: `${baseUrl}/produtos/${product.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Buscar todos os posts do blog para inclusão dinâmica no sitemap
  let blogUrls: MetadataRoute.Sitemap = []
  try {
    let postsList: Array<{ slug: string; updated_at?: string; created_at?: string; date?: string }> = []

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: posts } = await supabaseAdmin
        .from('posts')
        .select('slug, created_at, updated_at')
        .eq('published', true)

      if (posts && posts.length > 0) {
        postsList = posts
      }
    }

    if (postsList.length === 0) {
      const filePosts = getAllPostsFromFiles()
      postsList = filePosts.map(p => ({ slug: p.slug, date: p.date }))
    }

    blogUrls = postsList.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate(post),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erro ao listar posts para o sitemap:', error)
  }

  // Páginas da listagem: categorias e páginas numeradas, todas com link próprio
  let listingUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await listPosts()
    const newest = posts.length ? new Date(Math.max(...posts.map((post) => new Date(post.date).getTime()))) : undefined
    const lists: { category?: string; pages: number }[] = [
      { pages: totalPagesFor(posts) },
      ...categoryList(posts).map((category) => ({
        category: category.slug,
        pages: totalPagesFor(posts, category.name),
      })),
    ]

    listingUrls = lists
      .flatMap(({ category, pages }) =>
        Array.from({ length: pages }, (_, index) => ({
          url: `${baseUrl}${blogHref({ category, page: index + 1 })}`,
          lastModified: newest,
          changeFrequency: 'weekly' as const,
          priority: category ? 0.6 : 0.7,
        }))
      )
      // A primeira página da listagem geral já consta nas páginas principais
      .filter((entry) => entry.url !== `${baseUrl}/blog`)
  } catch (error) {
    console.error('Erro ao listar as páginas do blog para o sitemap:', error)
  }

  return [...staticUrls, ...productUrls, ...listingUrls, ...blogUrls]
}
