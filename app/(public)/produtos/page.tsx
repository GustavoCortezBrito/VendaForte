import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ForkliftsCatalogClient from '@/components/ForkliftsCatalogClient'
import { TYPE_PAGES, allProducts, productsOfType, toCatalogItem } from '@/lib/catalog'

const ITEMS_PER_PAGE = 12
const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE)

interface Props {
  searchParams: Promise<{ pagina?: string }>
}

/** `?pagina=2` vira 2; qualquer outra coisa vira 1. */
const pageNumber = (raw: string | undefined) => {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const current = Math.min(pageNumber((await searchParams).pagina), totalPages)
  const suffix = current > 1 ? ` (página ${current})` : ''
  return {
    title: { absolute: `Catálogo EP: ${allProducts.length} empilhadeiras e paleteiras${suffix} | Venda Forte` },
    description:
      'Catálogo EP Equipment: empilhadeiras contrabalançadas, retráteis e patoladas, paleteiras, selecionadoras e rebocadores. Veja a ficha técnica e peça cotação.',
    // Cada página da lista tem canônica própria: a página 2 não é cópia da 1
    alternates: { canonical: current > 1 ? `/produtos?pagina=${current}` : '/produtos' },
    openGraph: {
      title: 'Catálogo de Produtos EP Equipment | VendaForte',
      description:
        'Empilhadeiras elétricas, paleteiras, patoladas, retráteis e equipamentos industriais EP Equipment, com ficha técnica de cada modelo.',
      images: ['https://cdn.ep-portal.net/products/attr_5/1764929800525-5hh3iv.webp'],
    },
  }
}

export default async function ProdutosPage({ searchParams }: Props) {
  const requested = pageNumber((await searchParams).pagina)
  if (requested > totalPages) notFound()

  return (
    <ForkliftsCatalogClient initialProducts={allProducts.map(toCatalogItem)} initialPage={requested}>
      {/* Links por tipo, no HTML do servidor: levam a todas as fichas, com ou sem JavaScript */}
      <section aria-labelledby="por-tipo" className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="por-tipo" className="text-xl font-bold tracking-tight text-white">
          Veja por tipo de equipamento
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TYPE_PAGES.map((type) => (
            <li key={type.slug}>
              <Link
                href={`/produtos/tipo/${type.slug}`}
                className="block rounded-2xl border border-white/10 bg-ink-raised p-4 transition-colors hover:border-red-500/30"
              >
                <span className="block font-bold text-white">{type.label}</span>
                <span className="mt-1 block text-xs text-neutral-400">{productsOfType(type).length} modelos com ficha técnica</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ForkliftsCatalogClient>
  )
}
