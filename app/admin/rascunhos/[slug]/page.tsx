import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight, ListChecks, XCircle } from 'lucide-react'
import DraftsHeader from '@/components/admin/DraftsHeader'
import PostActions from '@/components/admin/PostActions'
import BlogCta from '@/components/blog/BlogCta'
import PostImage from '@/components/blog/PostImage'
import TableOfContents from '@/components/blog/TableOfContents'
import { CONTAINER, PROSE } from '@/components/blog/styles'
import { whatsappUrl } from '@/components/promo/promo.config'
import { getCurrentUser } from '@/lib/auth'
import { formatPostDate } from '@/lib/blog-format'
import { isLocalRequest, LOCAL_BLOCK_MESSAGE } from '@/lib/environment'
import { getPostPreview } from '@/lib/drafts'

export const metadata: Metadata = {
  title: 'Visualizar post | Painel Venda Forte',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const LEVEL = {
  ok: { Icon: CheckCircle2, color: 'text-green-600', label: 'Certo' },
  aviso: { Icon: AlertTriangle, color: 'text-amber-600', label: 'Atenção' },
  erro: { Icon: XCircle, color: 'text-red-600', label: 'Corrigir' },
} as const

export default async function PostPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await getCurrentUser())) redirect('/admin/login')

  const { slug } = await params
  const post = await getPostPreview(slug)
  if (!post) notFound()

  const errors = post.checks.filter((check) => check.level === 'erro').length
  const blockedReason = isLocalRequest(await headers()) ? LOCAL_BLOCK_MESSAGE : undefined
  const tocHeadings = post.headings.filter((heading) => heading.level === 2)
  const showToc = tocHeadings.length >= 3
  const quoteUrl = whatsappUrl(`Olá! Li o artigo "${post.title}" no blog da Venda Forte e quero falar com um consultor.`)
  // Um post já publicado mostra a data em que foi ao ar; um rascunho, a de hoje, que será a da publicação
  const shownDate = post.published ? (post.publishedAt ?? post.updatedAt ?? '') : new Date().toISOString()

  const banner = post.published
    ? { tone: 'border-green-200 bg-green-50 text-green-900', text: 'Publicado: este post está no ar. Esta é uma visualização dentro do painel.' }
    : post.source === 'arquivo'
      ? { tone: 'border-blue-200 bg-blue-50 text-blue-900', text: 'Texto pronto, ainda fora do painel. Importe para poder editar e publicar.' }
      : { tone: 'border-amber-200 bg-amber-50 text-amber-900', text: 'Rascunho: só aparece para quem está logado no painel. No site, este texto ainda não existe.' }

  return (
    <div className="min-h-screen bg-white">
      <DraftsHeader />

      <div className={`border-b ${banner.tone}`}>
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-3 py-3`}>
          <p className="text-sm font-semibold">{banner.text}</p>
          <Link href="/admin/rascunhos" className="inline-flex items-center gap-1.5 text-sm font-bold underline-offset-2 hover:underline">
            <ArrowLeft size={15} aria-hidden="true" />
            Todos os rascunhos
          </Link>
        </div>
      </div>

      {/* Quadro de conferência e ações */}
      <section className={`${CONTAINER} mt-8`} aria-labelledby="conferencia">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="conferencia" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
                <ListChecks size={20} className="text-red-600" aria-hidden="true" />
                {post.published ? 'Conferência do post' : 'Antes de publicar'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Endereço: <span className="font-mono font-semibold text-gray-800">/blog/{post.slug}</span>
                {post.plannedDate && <> · previsto para {formatPostDate(post.plannedDate)}</>}
              </p>
            </div>
            <PostActions slug={post.slug} source={post.source} published={post.published} errors={errors} blockedReason={blockedReason} />
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {post.source === 'arquivo' && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">O que falta ({post.pending.length})</h3>
                {post.pending.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-600">Nenhuma pendência anotada.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {post.pending.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-800">
                        <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-gray-300 bg-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className={post.source === 'arquivo' ? undefined : 'md:col-span-2'}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Conferência automática</h3>
              <ul className="mt-3 space-y-2">
                {post.checks.map((check) => {
                  const { Icon, color, label } = LEVEL[check.level]
                  return (
                    <li key={check.text} className="flex items-start gap-2.5 text-sm text-gray-800">
                      <Icon size={17} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" />
                      <span>
                        <span className="sr-only">{label}: </span>
                        {check.text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Como fica no site ---------------- */}
      <header className={`${CONTAINER} pt-10`}>
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <span>Blog Venda Forte</span>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{post.category}</span>
        </nav>

        <div className="mt-8 max-w-4xl">
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          {post.description && <p className="mt-6 max-w-3xl text-pretty text-xl leading-relaxed text-gray-600">{post.description}</p>}
          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500">
            <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-600 font-bold text-white">
              {post.author.charAt(0).toUpperCase()}
            </span>
            <p>
              <span className="block font-semibold text-gray-900">{post.author}</span>
              {shownDate && <time dateTime={shownDate.slice(0, 10)}>{formatPostDate(shownDate)}</time>}
              {shownDate && <span aria-hidden="true"> · </span>}
              {post.readingTime}
            </p>
          </div>
        </div>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 shadow-xl">
          <PostImage src={post.image || '/sede.png'} alt={post.title} sizes="(max-width: 1280px) 100vw, 1216px" priority />
        </div>
      </header>

      <div className={`${CONTAINER} grid gap-x-12 py-14 lg:grid-cols-12 lg:py-20`}>
        {showToc && (
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <TableOfContents headings={tocHeadings} />
            </div>
          </aside>
        )}

        <article className={showToc ? 'min-w-0 lg:col-span-9' : 'mx-auto max-w-3xl lg:col-span-12'}>
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
    </div>
  )
}
