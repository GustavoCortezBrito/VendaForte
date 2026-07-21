import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { getAllPosts as getAllPostsFromFiles } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupovendaforte.com'
  const currentDate = new Date()

  // Páginas estáticas principais
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

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
      lastModified: post.updated_at ? new Date(post.updated_at) : (post.created_at ? new Date(post.created_at) : (post.date ? new Date(post.date) : currentDate)),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erro ao listar posts para o sitemap:', error)
  }

  return [...staticUrls, ...blogUrls]
}
