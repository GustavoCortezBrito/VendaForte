import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ForkliftDetailClient from '@/components/ForkliftDetailClient'
import forkliftsData from '@/lib/data/electric-forklifts.json'
import { ForkliftProduct } from '@/components/ForkliftsCatalogClient'
import { LOCAL_PHOTOS } from '@/lib/data/local-photos'
import { productDescription, productJsonLd, productTitle } from '@/lib/product-seo'

interface Props {
  params: Promise<{ slug: string }>
}

const allProducts = forkliftsData as unknown as ForkliftProduct[]

/** Fotos reais do modelo (quando existem) entram na galeria logo depois da imagem principal. */
const withLocalPhotos = (product: ForkliftProduct): ForkliftProduct => {
  const photos = LOCAL_PHOTOS[product.slug]
  return photos ? { ...product, galleryImages: [...photos, ...(product.galleryImages || [])] } : product
}

export async function generateStaticParams() {
  return allProducts.map(p => ({
    slug: p.slug
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = allProducts.find(p => p.slug === slug)

  if (!product) {
    return { title: 'Produto não encontrado', robots: { index: false } }
  }

  const image = LOCAL_PHOTOS[product.slug]?.[0] ?? product.mainImage
  const title = productTitle(product)
  const description = productDescription(product)

  return {
    title: { absolute: title },
    description,
    // Sem isto, cada produto herdaria o canonical da página inicial e o Google trataria todos como cópia dela
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/produtos/${product.slug}`,
      images: [image],
    },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, LOCAL_PHOTOS[product.slug])) }}
      />
      <ForkliftDetailClient product={withLocalPhotos(product)} relatedProducts={relatedProducts} />
    </>
  )
}
