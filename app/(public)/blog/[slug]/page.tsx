import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import BlogCta from '@/components/blog/BlogCta'
import PostCard from '@/components/blog/PostCard'
import PostImage from '@/components/blog/PostImage'
import TableOfContents from '@/components/blog/TableOfContents'
import { BTN_LINE, CONTAINER } from '@/components/blog/styles'
import { whatsappUrl } from '@/components/promo/promo.config'
import { getPost, listPosts } from '@/lib/blog-data'
import { categoryOf, formatPostDate, postDateTime, relatedPosts, slugifyText } from '@/lib/blog-format'
import { productForPost } from '@/lib/blog-products'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupovendaforte.com'

/** Revalida a cada 10 minutos; o admin força a atualização na hora ao publicar. */
export const revalidate = 600

export async function generateStaticParams() {
  const posts = await listPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

const absoluteUrl = (path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: { absolute: 'Artigo não encontrado | Venda Forte' },
      description: 'O artigo que você procura não foi encontrado.',
      robots: { index: false },
    }
  }

  // `absolute` ignora o modelo "%s | Grupo Venda Forte" do layout raiz, que
  // somava o nome da empresa duas vezes ao título. A marca só entra se o título
  // couber nos cerca de 58 caracteres que os buscadores exibem.
  const withBrand = `${post.title} | Venda Forte`
  const title = [...withBrand].length <= 58 ? withBrand : post.title
  const canonical = `${siteUrl}/blog/${post.slug}`
  const image = absoluteUrl(post.image || '/sede.png')

  return {
    title: { absolute: title },
    description: post.description,
    keywords: post.tags.length > 0 ? post.tags : ['empilhadeira', 'EP Equipment', 'Venda Forte'],
    authors: [{ name: post.author }],
    alternates: { canonical },
    openGraph: {
      title,
      description: post.description,
      url: canonical,
      siteName: 'Venda Forte',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title, description: post.description, images: [image] },
  }
}

const PROSE = [
  'prose prose-lg max-w-none',
  'prose-headings:scroll-mt-28 prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900',
  'prose-h2:mb-5 prose-h2:mt-14 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl',
  'prose-p:leading-relaxed prose-p:text-gray-700',
  'prose-a:font-semibold prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline',
  'prose-strong:font-semibold prose-strong:text-gray-900',
  'prose-li:text-gray-700 prose-li:marker:text-gray-400',
  'prose-hr:my-12 prose-hr:border-gray-200',
  'prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-50/60 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-gray-800',
  // Sem as aspas decorativas que o plugin acrescenta antes e depois do parágrafo
  '[&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none',
  'prose-img:rounded-2xl prose-img:shadow-lg',
  'prose-thead:border-0 prose-th:bg-gray-900 prose-th:px-4 prose-th:py-3 prose-th:text-white prose-td:px-4 prose-td:py-3 prose-td:text-gray-700',
  '[&_tbody_tr:nth-child(even)]:bg-gray-50',
  // Tabelas feitas no editor do admin guardam o texto das células dentro de <p>
  '[&_td_p]:m-0 [&_th_p]:m-0 [&_th_p]:text-white',
  // Tabelas dentro de um contêiner que rola na horizontal (ver `enhanceHtml`)
  '[&_.blog-table]:my-8 [&_.blog-table]:overflow-x-auto [&_.blog-table]:rounded-2xl [&_.blog-table]:border [&_.blog-table]:border-gray-200 [&_.blog-table]:shadow-sm [&_.blog-table_table]:my-0 [&_.blog-table_table]:min-w-[34rem]',
  // Checklists do Markdown (- [ ] item)
  '[&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0 [&_.task-list-item]:flex [&_.task-list-item]:items-start [&_.task-list-item]:gap-3 [&_.task-list-item_input]:mt-2 [&_.task-list-item_input]:accent-red-600',
].join(' ')

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const all = await listPosts()
  const related = relatedPosts(all, post, 3)
  const product = productForPost(post)
  const category = categoryOf(post)
  const categoryHref = `/blog/categoria/${slugifyText(category) || 'geral'}`
  const canonical = `${siteUrl}/blog/${post.slug}`
  // Só os títulos principais: subtítulos repetidos ("O problema", "Como evitar") poluem o índice
  const tocHeadings = post.headings.filter((heading) => heading.level === 2)
  const showToc = tocHeadings.length >= 3
  const quoteUrl = whatsappUrl(`Olá! Li o artigo "${post.title}" no blog da Venda Forte e quero falar com um consultor.`)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: [absoluteUrl(post.image || '/sede.png')],
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: post.author },
      publisher: {
        '@type': 'Organization',
        name: 'Grupo Venda Forte',
        logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Blog', item: `${siteUrl}/blog` },
        { '@type': 'ListItem', position: 2, name: category, item: `${siteUrl}${categoryHref}` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ],
    },
  ]

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------------- Cabeçalho do artigo ---------------- */}
      <header className={`${CONTAINER} pt-32 lg:pt-36`}>
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <Link href="/blog" className="transition-colors hover:text-red-600">
            Blog Venda Forte
          </Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          <Link href={categoryHref} className="transition-colors hover:text-red-600">
            {category}
          </Link>
        </nav>

        <div className="mt-8 max-w-4xl">
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 max-w-3xl text-pretty text-xl leading-relaxed text-gray-600">{post.description}</p>
          )}
          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500">
            <span
              aria-hidden="true"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 font-bold text-white"
            >
              {post.author.charAt(0).toUpperCase()}
            </span>
            <p>
              <span className="block font-semibold text-gray-900">{post.author}</span>
              <time dateTime={postDateTime(post.date)}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true"> · </span>
              {post.readingTime}
            </p>
          </div>
        </div>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 shadow-xl">
          <PostImage src={post.image || '/sede.png'} alt={post.title} sizes="(max-width: 1280px) 100vw, 1216px" priority />
        </div>
      </header>

      {/* ---------------- Corpo ---------------- */}
      <div className={`${CONTAINER} grid gap-x-12 py-14 lg:grid-cols-12 lg:py-20`}>
        {showToc && (
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <TableOfContents headings={tocHeadings} />
            </div>
          </aside>
        )}

        <article className={showToc ? 'min-w-0 lg:col-span-9' : 'mx-auto max-w-3xl lg:col-span-12'}>
          {/* Largura de leitura confortável, centrada no espaço ao lado do índice */}
          <div className={showToc ? 'max-w-3xl lg:mx-auto' : undefined}>
            <div className={PROSE} dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-gray-200 pt-8" aria-label="Assuntos">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {/* Máquina de que o artigo trata */}
            {product && (
              <aside className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm sm:flex">
                <div className="relative aspect-[16/9] bg-gray-900 sm:aspect-auto sm:w-2/5">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 280px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600">Na campanha</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">EP {product.shortName}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {product.category} · {product.capacity}
                  </p>
                  <Link
                    href={product.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-red-600 transition-colors hover:text-red-700"
                  >
                    Ver preço e ficha na campanha
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </aside>
            )}

            {/* Chamada para falar com um consultor */}
            <div className="mt-8">
              <BlogCta
                variant="compact"
                title="Quer aplicar isso na sua operação?"
                text="Um consultor da Venda Forte avalia o seu corredor, a sua carga e o seu turno e indica a máquina certa."
                primary={{ href: '/promo#cotacao', label: 'Pedir cotação' }}
                whatsappHref={quoteUrl}
              />
            </div>
          </div>
        </article>
      </div>

      {/* ---------------- Continue lendo ---------------- */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16 lg:py-24" aria-labelledby="continue-lendo">
          <div className={CONTAINER}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="continue-lendo" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Continue <span className="text-red-600">lendo</span>
              </h2>
              <Link href="/blog" className={BTN_LINE}>
                Ver todos os artigos
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
