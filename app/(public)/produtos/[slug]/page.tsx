import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ForkliftDetailClient from '@/components/ForkliftDetailClient'
import { allProducts, guideFor, similarProducts, toCatalogItem, typePageOf } from '@/lib/catalog'
import type { ForkliftProduct } from '@/lib/catalog'
import { LOCAL_PHOTOS } from '@/lib/data/local-photos'
import { productDescription, productIntro, productJsonLd, productTitle } from '@/lib/product-seo'

interface Props {
  params: Promise<{ slug: string }>
}

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

  // Toda ficha liga à página do seu tipo e a 4 modelos do mesmo tipo com capacidade próxima
  const type = typePageOf(product)
  const typeLink = type ? { href: `/produtos/tipo/${type.slug}`, label: type.label } : undefined
  const related = similarProducts(product, 4).map(toCatalogItem)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product, type ? { name: type.label, path: `/produtos/tipo/${type.slug}` } : undefined)),
        }}
      />
      <ForkliftDetailClient
        product={withLocalPhotos(product)}
        relatedProducts={related}
        typeLink={typeLink}
        intro={productIntro(product)}
        guide={guideFor(product.slug)}
      />
    </>
  )
}
