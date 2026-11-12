import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPostSummary } from '@/lib/blog-format'
import type { BlogProduct } from '@/lib/blog-products'
import { Reveal } from '@/components/promo/ui'
import { CONTAINER, EYEBROW, H2 } from './styles'

export interface Guide {
  product: BlogProduct
  post: BlogPostSummary
}

/** "Guias por máquina": o post mais recente de cada máquina da campanha, com a capa em 16:9 sem molduras. */
export default function GuideCards({ guides }: { guides: Guide[] }) {
  return (
    <section className="bg-ink pt-16 lg:pt-24" aria-labelledby="guias-maquina">
      <div className={CONTAINER}>
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className={EYEBROW}>Guias por máquina</span>
          <h2 id="guias-maquina" className={`${H2} mt-5 text-balance`}>
            As três máquinas da campanha, explicadas
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {guides.map(({ product, post }, index) => (
            <li key={product.id}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised transition-colors duration-500 hover:border-white/25 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2">
              <div className="relative m-2 aspect-[16/9] overflow-hidden rounded-[22px] bg-ink-raised">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="text-xs font-bold text-red-500">{product.category}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">EP {product.shortName}</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {product.capacity} · {product.tagline}
                </p>
                <div className="mt-auto flex flex-col items-start gap-3 pt-7 text-sm font-bold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-red-500 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-red-300 focus-visible:outline-none"
                  >
                    Ler o guia da {product.shortName}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {/* Acima da área clicável do cartão, para continuar sendo um link à parte */}
                  <Link
                    href={product.href}
                    className="relative z-10 font-semibold text-neutral-400 transition-colors hover:text-white"
                  >
                    Ver a {product.shortName} na campanha
                  </Link>
                </div>
              </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
