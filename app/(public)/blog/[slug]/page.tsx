import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

interface BlogPost {
  id?: string
  slug: string
  title: string
  description: string
  content: string
  image: string
  category: string
  tags?: string[]
  author: string
  published?: boolean
  reading_time: string
  created_at: string
  published_at?: string
}

import { supabaseAdmin } from '@/lib/supabase'
import { getPostBySlug as getPostBySlugFromFiles, getAllPosts as getAllPostsFromFiles } from '@/lib/blog'

// Função para buscar post do banco (ou fallback de arquivos)
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: post, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!error && post) {
        return post as BlogPost
      }
    }

    const filePost = await getPostBySlugFromFiles(slug)
    if (filePost) {
      return {
        slug: filePost.slug,
        title: filePost.title,
        description: filePost.description,
        content: filePost.content,
        image: filePost.image,
        category: filePost.category,
        tags: filePost.tags,
        author: filePost.author,
        reading_time: filePost.readingTime,
        created_at: filePost.date
      }
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar post por slug:', error)
    return null
  }
}

// Função para buscar todos os posts (para generateStaticParams)
async function getAllPosts(): Promise<BlogPost[]> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: posts, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('published', true)

      if (!error && posts && posts.length > 0) {
        return posts as BlogPost[]
      }
    }

    const filePosts = getAllPostsFromFiles()
    return filePosts.map(p => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      content: '',
      image: p.image,
      category: p.category,
      tags: p.tags,
      author: p.author,
      reading_time: p.readingTime,
      created_at: p.date
    }))
  } catch (error) {
    console.error('Erro ao buscar todos os posts:', error)
    return []
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post não encontrado | Blog Venda Forte',
      description: 'O artigo que você procura não foi encontrado.'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupovendaforte.com'
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = post.image?.startsWith('http') ? post.image : `${siteUrl}${post.image || '/sede.png'}`
  const keywords = (post.tags && post.tags.length > 0) ? post.tags : ['empilhadeira', 'manutenção', 'equipamentos industriais', 'Venda Forte']

  return {
    title: `${post.title} | Blog Venda Forte`,
    description: post.description,
    keywords: keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Blog Venda Forte`,
      description: post.description,
      url: canonicalUrl,
      siteName: 'Venda Forte',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.published_at || post.created_at,
      authors: [post.author],
      tags: post.tags || [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Blog Venda Forte`,
      description: post.description,
      images: [imageUrl],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Converter markdown para HTML
  const processedContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(post.content || '')
  const contentHtml = processedContent.toString()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupovendaforte.com'
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = post.image?.startsWith('http') ? post.image : `${siteUrl}${post.image || '/sede.png'}`

  // Schema.org Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'image': [imageUrl],
    'datePublished': post.created_at,
    'dateModified': post.published_at || post.created_at,
    'author': {
      '@type': 'Person',
      'name': post.author
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Grupo Venda Forte',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl
    }
  }

  const tagsList = post.tags || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero com imagem */}
      <div className="relative min-h-[500px] bg-gray-900 flex flex-col">
        <img
          src={post.image || '/sede.png'}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between pt-24 pb-12">
          {/* Link voltar no topo */}
          <div className="mb-6">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para o blog
            </Link>
          </div>
          
          {/* Conteúdo centralizado */}
          <div className="space-y-6">
            {/* Categoria */}
            <div>
              <span className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                {post.category}
              </span>
            </div>
            
            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
              {post.title}
            </h1>
            
            {/* Meta informações */}
            <div className="flex items-center gap-4 text-white/90 text-sm bg-black/40 backdrop-blur-md inline-flex px-6 py-3 rounded-full border border-white/10 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
                  {post.author ? post.author.charAt(0).toUpperCase() : 'V'}
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <span>•</span>
              <time className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </time>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.reading_time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tagsList.map((tag: string) => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Conteúdo do post */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-600 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-red-600 
              prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
              prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 
              prose-code:rounded prose-code:text-sm prose-code:text-red-600
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
              prose-img:w-full prose-img:h-auto
            "
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Autor e data no final */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.author ? post.author.charAt(0).toUpperCase() : 'V'}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{post.author}</div>
                <div className="text-sm text-gray-500">
                  Publicado em {new Date(post.created_at).toLocaleDateString('pt-BR', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/blog"
              className="flex-1 bg-gray-100 text-gray-700 text-center py-4 sm:py-3 rounded-xl hover:bg-gray-200 active:scale-95 transition-all font-semibold text-base sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ver todos os posts
            </Link>
            <a
              href="https://vendaforte.com.br/#contact"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-4 sm:py-3 rounded-xl hover:from-red-700 hover:to-red-800 active:scale-95 transition-all font-bold text-base sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Entre em Contato
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}
