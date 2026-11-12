import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHeader from '@/components/site/PageHeader'
import { BTN_GHOST, BTN_WHATSAPP, PRODUCT_STAGE } from '@/components/site/styles'
import { stagePhoto } from '@/lib/product-photo'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/components/promo/promo.config'
import {
  TYPE_PAGES,
  TYPE_PAGE_SIZE,
  energyLabel,
  numberOf,
  productsOfType,
  statsOf,
  turningLabel,
  typePageBySlug,
} from '@/lib/catalog'
import { pageWindow } from '@/lib/blog-format'
import { formatLift } from '@/lib/product-seo'
import { SITE_URL } from '@/lib/site'

interface Props {
  params: Promise<{ tipo: string }>
  searchParams: Promise<{ pagina?: string }>
}

export function generateStaticParams() {
  return TYPE_PAGES.map((page) => ({ tipo: page.slug }))
}

/** `?pagina=2` vira 2; qualquer outra coisa vira 1. */
const pageNumber = (raw: string | undefined) => {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

const hrefOf = (slug: string, page: number) => `/produtos/tipo/${slug}${page > 1 ? `?pagina=${page}` : ''}`

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { tipo } = await params
  const page = typePageBySlug(tipo)
  if (!page) return { title: { absolute: 'Tipo não encontrado | Venda Forte' }, robots: { index: false } }

  const current = pageNumber((await searchParams).pagina)
  const stats = statsOf(productsOfType(page))
  const totalPages = Math.ceil(stats.count / TYPE_PAGE_SIZE)
  const suffix = current > 1 ? ` (página ${current})` : ''

  return {
    title: { absolute: `${page.label} EP: ${stats.count} modelos${suffix} | Venda Forte` },
    description: page.metaDescription(stats),
    // Cada página da lista tem canônica própria: a página 2 não é cópia da 1
    alternates: { canonical: hrefOf(page.slug, Math.min(current, totalPages)) },
    openGraph: {
      title: `${page.label} EP Equipment | Venda Forte`,
      description: page.metaDescription(stats),
      type: 'website',
      url: hrefOf(page.slug, current),
    },
  }
}

export default async function TypePage({ params, searchParams }: Props) {
  const { tipo } = await params
  const page = typePageBySlug(tipo)
  if (!page) notFound()

  const products = productsOfType(page).sort((a, b) => numberOf(a.capacity) - numberOf(b.capacity) || a.title.localeCompare(b.title))
  const stats = statsOf(products)
  const totalPages = Math.ceil(products.length / TYPE_PAGE_SIZE)
  const current = pageNumber((await searchParams).pagina)
  if (current > totalPages) notFound()

  const visible = products.slice((current - 1) * TYPE_PAGE_SIZE, current * TYPE_PAGE_SIZE)
  const showKind = page.slug === 'selecionadoras-e-rebocadores'
  const others = TYPE_PAGES.filter((item) => item.slug !== page.slug)
  const quoteUrl = whatsappUrl(`Olá! Vi a página de ${page.label.toLowerCase()} no site e quero uma cotação.`)

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: `${SITE_URL}/produtos` },
      { '@type': 'ListItem', position: 3, name: page.label, item: `${SITE_URL}${hrefOf(page.slug, 1)}` },
    ],
  }

  return (
    <div className="min-h-screen bg-ink pb-24 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHeader
        before={
          <nav aria-label="Você está em" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <Link href="/" className="transition-colors hover:text-white">
              Início
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/produtos" className="transition-colors hover:text-white">
              Produtos
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-neutral-300">{page.label}</span>
          </nav>
        }
        eyebrow={`${stats.count} modelos no catálogo`}
        title={<>{page.label} EP Equipment</>}
        lead={
          <div className="space-y-3">
            {page.intro(stats).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={quoteUrl} target="_blank" rel="noopener noreferrer" className={BTN_WHATSAPP}>
            <MessageCircle size={16} aria-hidden="true" />
            Pedir cotação no WhatsApp
          </a>
          <Link href="/produtos" className={BTN_GHOST}>
            Filtrar o catálogo completo
          </Link>
        </div>
      </PageHeader>

      <main className="mx-auto max-w-7xl px-6 pt-16 lg:px-8">
        <section aria-labelledby="modelos">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 id="modelos" className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
              {stats.count} modelos
            </h2>
            <p className="text-sm text-neutral-400">
              Mostrando {(current - 1) * TYPE_PAGE_SIZE + 1} a {Math.min(current * TYPE_PAGE_SIZE, products.length)} de {products.length}
            </p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[28px] border border-white/10 bg-ink-raised">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">
                {page.label} EP: capacidade, elevação, energia e raio de giro de cada modelo
              </caption>
              <thead className="bg-ink-raised text-xs text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Modelo
                  </th>
                  {showKind && (
                    <th scope="col" className="px-4 py-3 font-bold">
                      Tipo
                    </th>
                  )}
                  <th scope="col" className="px-4 py-3 font-bold">
                    Capacidade
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Elevação
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Energia
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Raio de giro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {visible.map((product) => (
                  <tr key={product.slug} className="hover:bg-white/5">
                    <th scope="row" className="px-4 py-2.5 font-semibold text-white">
                      <Link href={`/produtos/${product.slug}`} className="flex items-center gap-3 hover:text-red-400">
                        <span className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 ${PRODUCT_STAGE}`}>
                          <Image
                            src={stagePhoto(product.mainImage, 384)}
                            alt=""
                            fill
                            sizes="48px"
                            loading="lazy"
                            className="object-contain p-1"
                          />
                        </span>
                        <span>EP {product.title}</span>
                      </Link>
                    </th>
                    {showKind && (
                      <td className="px-4 py-2.5 text-neutral-400">
                        {product.type === 'Rebocador Elétrico' ? 'Rebocador' : 'Selecionadora'}
                      </td>
                    )}
                    <td className="px-4 py-2.5 tabular-nums text-neutral-300">{product.capacity}</td>
                    <td className="px-4 py-2.5 tabular-nums text-neutral-300">{formatLift(product.liftingHeight)}</td>
                    <td className="px-4 py-2.5 text-neutral-300">{energyLabel(product)}</td>
                    <td className="px-4 py-2.5 tabular-nums text-neutral-300">{turningLabel(product.turningRadius)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav aria-label="Páginas da lista" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
              {current > 1 ? (
                <Link
                  href={hrefOf(page.slug, current - 1)}
                  rel="prev"
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                  Anterior
                </Link>
              ) : null}
              {pageWindow(current, totalPages).map((item, index) =>
                item === 'gap' ? (
                  <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-ink-muted">
                    …
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={hrefOf(page.slug, item)}
                    aria-current={item === current ? 'page' : undefined}
                    className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                      item === current
                        ? 'border-white bg-white text-ink'
                        : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
              {current < totalPages ? (
                <Link
                  href={hrefOf(page.slug, current + 1)}
                  rel="next"
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Próxima
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
          )}
        </section>

        <section aria-labelledby="perguntas" className="mt-14">
          <h2 id="perguntas" className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
            Perguntas frequentes
          </h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {page.faq(stats).map((item) => (
              <div key={item.q} className="rounded-3xl border border-white/10 bg-ink-raised p-6 sm:p-7">
                <dt className="font-bold text-white">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-300">
                  {item.a}
                  {item.link && (
                    <>
                      {' '}
                      <Link href={item.link.href} className="font-semibold text-red-500 hover:underline">
                        {item.link.label}
                      </Link>
                      .
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="outros" className="mt-14 grid gap-8 md:grid-cols-2">
          <div>
            <h2 id="outros" className="text-2xl font-bold tracking-[-0.03em] text-white">
              Outros tipos de equipamento
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={hrefOf(item.slug, 1)}
                    className="inline-flex rounded-full border border-white/10 bg-ink-raised px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-red-500/30 hover:text-red-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white">Leia também</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {page.reading.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-semibold text-red-500 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
