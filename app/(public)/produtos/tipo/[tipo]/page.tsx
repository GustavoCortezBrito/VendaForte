import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
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
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-24 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <nav aria-label="Você está em" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-red-600">
              Início
            </Link>
            <ChevronRight size={13} aria-hidden="true" className="text-slate-400" />
            <Link href="/produtos" className="hover:text-red-600">
              Produtos
            </Link>
            <ChevronRight size={13} aria-hidden="true" className="text-slate-400" />
            <span className="font-bold text-slate-900">{page.label}</span>
          </nav>

          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {page.label} EP Equipment
          </h1>
          <div className="mt-4 max-w-3xl space-y-3 text-base leading-relaxed text-slate-700">
            {page.intro(stats).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={quoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-colors hover:bg-green-700"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Pedir cotação no WhatsApp
            </a>
            <Link
              href="/produtos"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Filtrar o catálogo completo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <section aria-labelledby="modelos">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 id="modelos" className="text-2xl font-extrabold tracking-tight text-slate-900">
              {stats.count} modelos
            </h2>
            <p className="text-sm text-slate-500">
              Mostrando {(current - 1) * TYPE_PAGE_SIZE + 1} a {Math.min(current * TYPE_PAGE_SIZE, products.length)} de {products.length}
            </p>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">
                {page.label} EP: capacidade, elevação, energia e raio de giro de cada modelo
              </caption>
              <thead className="bg-slate-900 text-xs uppercase tracking-wider text-white">
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
              <tbody className="divide-y divide-slate-100">
                {visible.map((product) => (
                  <tr key={product.slug} className="hover:bg-slate-50">
                    <th scope="row" className="px-4 py-2.5 font-semibold text-slate-900">
                      <Link href={`/produtos/${product.slug}`} className="flex items-center gap-3 hover:text-red-600">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          <Image
                            src={product.mainImage}
                            alt=""
                            fill
                            sizes="48px"
                            loading="lazy"
                            className="object-contain p-1"
                            style={{ mixBlendMode: 'multiply' }}
                          />
                        </span>
                        <span>EP {product.title}</span>
                      </Link>
                    </th>
                    {showKind && (
                      <td className="px-4 py-2.5 text-slate-600">
                        {product.type === 'Rebocador Elétrico' ? 'Rebocador' : 'Selecionadora'}
                      </td>
                    )}
                    <td className="px-4 py-2.5 tabular-nums text-slate-700">{product.capacity}</td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-700">{formatLift(product.liftingHeight)}</td>
                    <td className="px-4 py-2.5 text-slate-700">{energyLabel(product)}</td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-700">{turningLabel(product.turningRadius)}</td>
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
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:text-red-600"
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                  Anterior
                </Link>
              ) : null}
              {pageWindow(current, totalPages).map((item, index) =>
                item === 'gap' ? (
                  <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-slate-400">
                    …
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={hrefOf(page.slug, item)}
                    aria-current={item === current ? 'page' : undefined}
                    className={`grid h-9 w-9 place-items-center rounded-xl border text-xs font-bold ${
                      item === current
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:text-red-600'
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
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:text-red-600"
                >
                  Próxima
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
          )}
        </section>

        <section aria-labelledby="perguntas" className="mt-14">
          <h2 id="perguntas" className="text-2xl font-extrabold tracking-tight text-slate-900">
            Perguntas frequentes
          </h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {page.faq(stats).map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <dt className="font-bold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-700">
                  {item.a}
                  {item.link && (
                    <>
                      {' '}
                      <Link href={item.link.href} className="font-semibold text-red-600 hover:underline">
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
            <h2 id="outros" className="text-xl font-extrabold tracking-tight text-slate-900">
              Outros tipos de equipamento
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={hrefOf(item.slug, 1)}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Leia também</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {page.reading.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-semibold text-red-600 hover:underline">
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
