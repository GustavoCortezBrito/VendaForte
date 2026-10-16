import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPostSummary } from '@/lib/blog-format'
import type { BlogProduct } from '@/lib/blog-products'
import { CONTAINER, EYEBROW, H2 } from './styles'

export interface Guide {
  product: BlogProduct
  post: BlogPostSummary
}

/** "Guias por máquina": o post mais recente de cada máquina da campanha, com a capa em 16:9 sem molduras. */
export default function GuideCards({ guides }: { guides: Guide[] }) {
  return (
    <section className="bg-white pt-16 lg:pt-24" aria-labelledby="guias-maquina">
      <div className={CONTAINER}>
        <div className="mx-auto max-w-3xl text-center">
          <span className={EYEBROW}>Guias por máquina</span>
          <h2 id="guias-maquina" className={`${H2} mt-5 text-balance`}>
            As três máquinas da campanha, <span className="text-red-600">explicadas</span>
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {guides.map(({ product, post }) => (
            <li
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-900">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">{product.category}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">EP {product.shortName}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {product.capacity} · {product.tagline}
                </p>
                <div className="mt-auto flex flex-col items-start gap-3 pt-7 text-sm font-bold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-red-600 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-red-700 focus-visible:outline-none"
                  >
                    Ler o guia da {product.shortName}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {/* Acima da área clicável do cartão, para continuar sendo um link à parte */}
                  <Link
                    href={product.href}
                    className="relative z-10 font-semibold text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Ver a {product.shortName} na campanha
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
