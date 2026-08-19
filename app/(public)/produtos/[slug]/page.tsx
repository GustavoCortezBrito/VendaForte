import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ForkliftDetailClient from '@/components/ForkliftDetailClient'
import forkliftsData from '@/lib/data/electric-forklifts.json'
import { ForkliftProduct } from '@/components/ForkliftsCatalogClient'

interface Props {
  params: Promise<{ slug: string }>
}

const allProducts = forkliftsData as unknown as ForkliftProduct[]

export async function generateStaticParams() {
  return allProducts.map(p => ({
    slug: p.slug
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = allProducts.find(p => p.slug === slug)

  if (!product) {
    return { title: 'Produto não encontrado | VendaForte' }
  }

  return {
    title: `${product.title} (${product.capacity}) — EP Equipment | VendaForte`,
    description: `Ficha técnica e especificações completas do equipamento ${product.title}. Bateria ${product.batteryVoltage} Lítio-Íon, elevação de ${product.liftingHeight} e capacidade para ${product.capacity}.`,
    openGraph: {
      title: `${product.title} — EP Equipment`,
      description: product.description,
      images: [product.mainImage],
    }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = allProducts.find(p => p.slug === slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = allProducts
    .filter(p => p.slug !== slug && p.categorySlug === product.categorySlug)
    .slice(0, 3)
    .concat(allProducts.filter(p => p.slug !== slug && p.categorySlug !== product.categorySlug).slice(0, 3))
    .slice(0, 3)

  return <ForkliftDetailClient product={product} relatedProducts={relatedProducts} />
}
