import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/promo/ui'
import { BTN_GHOST, CARD_LINK, CONTAINER, EYEBROW, LEAD, SECTION, TITLE } from '@/components/site/styles'

/** Catálogo na home: só os tipos, com o número de modelos. Os modelos ficam nas páginas de cada tipo. */

export interface CatalogCategory {
  label: string
  href: string
  count: number
}

export default function EPForkliftsSection({ total, categories }: { total: number; categories: CatalogCategory[] }) {
  return (
    <section id="produtos" className={SECTION}>
      <div className={CONTAINER}>
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className={EYEBROW}>Catálogo EP Equipment</p>
            <h2 className={`mt-4 ${TITLE} text-white`}>{total} equipamentos, por tipo</h2>
            <p className={`mt-5 ${LEAD}`}>Compare capacidade e elevação e encontre o modelo certo para a sua operação.</p>
          </div>
          <Link href="/produtos" className={`${BTN_GHOST} self-start lg:self-auto`}>
            Ver o catálogo completo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => (
            <li key={category.href}>
              <Reveal delay={(index % 5) * 0.05} className="h-full">
                <Link href={category.href} className={`${CARD_LINK} p-6`}>
                  <p className="text-5xl font-bold tracking-[-0.045em] text-white">{category.count}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{category.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">modelos</p>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="absolute right-5 top-5 h-5 w-5 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
