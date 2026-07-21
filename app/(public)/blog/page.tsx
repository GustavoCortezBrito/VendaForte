import { Metadata } from 'next'
import BlogListingClient from '@/components/BlogListingClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupovendaforte.com'

export const metadata: Metadata = {
  title: 'Blog Venda Forte | Dicas de Empilhadeiras e Movimentação de Cargas',
  description: 'Confira artigos, tutoriais e dicas especializadas sobre manutenção preventiva, operação segura, locação e tecnologia de empilhadeiras e equipamentos industriais.',
  keywords: [
    'blog empilhadeiras',
    'manutenção de empilhadeiras',
    'operação segura empilhadeira',
    'equipamentos industriais',
    'locação de empilhadeiras',
    'movimentação de cargas',
    'Venda Forte blog',
    'Chapecó empilhadeiras'
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog Venda Forte | Dicas de Empilhadeiras e Movimentação de Cargas',
    description: 'Confira artigos, tutoriais e dicas especializadas sobre manutenção preventiva, operação segura, locação e tecnologia de empilhadeiras.',
    url: `${siteUrl}/blog`,
    siteName: 'Venda Forte',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/sede.png`,
        width: 1200,
        height: 630,
        alt: 'Blog Venda Forte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Venda Forte | Dicas de Empilhadeiras e Movimentação de Cargas',
    description: 'Confira artigos, tutoriais e dicas especializadas sobre manutenção preventiva, operação segura, locação e tecnologia de empilhadeiras.',
    images: [`${siteUrl}/sede.png`],
  },
}

export default function BlogPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Blog Venda Forte',
    'description': 'Dicas, novidades e conteúdo especializado sobre empilhadeiras e equipamentos industriais.',
    'url': `${siteUrl}/blog`,
    'publisher': {
      '@type': 'Organization',
      'name': 'Grupo Venda Forte',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`
      }
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Início',
        'item': siteUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': `${siteUrl}/blog`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogListingClient />
    </>
  )
}
