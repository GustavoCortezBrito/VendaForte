import type { Metadata } from "next";
import { SITE_URL } from '@/lib/site';

const siteUrl = SITE_URL;
const siteName = "Grupo Venda Forte";
const siteTitle = `Venda de empilhadeiras em Chapecó e Joinville | ${siteName}`;
const siteDescription = "Venda e locação de empilhadeiras e paleteiras EP Equipment em Chapecó e Joinville, com assistência técnica e peças. Peça sua cotação.";


export const metadata: Metadata = {
  // Metadados Básicos
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  
  // Favicon e ícones
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  
  // Robots e Indexação
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (Facebook, LinkedIn, etc)
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/sede.png`,
        width: 1200,
        height: 630,
        alt: `Empilhadeiras e Equipamentos - ${siteName}`,
        type: 'image/png',
      },
      {
        url: `${siteUrl}/logo.png`,
        width: 800,
        height: 600,
        alt: `Logo ${siteName}`,
        type: 'image/png',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/sede.png`],
    creator: '@grupovendaforte',
  },

  // Informações de Contato e Localização
  alternates: {
    canonical: siteUrl,
  },

  // Outros
  category: 'business',
  classification: 'Equipamentos Industriais',

  // Schema.org para mecanismos de IA (ChatGPT, Perplexity, etc)
  other: {
    // Informações Estruturadas para IA
    'ai:business_type': 'Industrial Equipment Supplier',
    'ai:service_area': 'Chapecó, Joinville, Itajaí, Maringá, Seberi, Esteio - Sul do Brasil',
    'ai:main_products': 'Empilhadeira Elétrica, Empilhadeira Diesel, Empilhadeira a Gás, Transpaleteira, Paleteira, Empilhadeira Autônoma, Peças Multimarcas',
    'ai:main_services': 'Venda, Locação, Manutenção, Assistência Técnica',
    'ai:experience_years': '20+',
    'ai:contact_phone': '+55 49 3323-9050',
    'ai:contact_whatsapp': '+55 49 98839-5635',
    'ai:contact_email': 'comercial@grupovendaforte.com',
    'ai:headquarters': 'Chapecó - Santa Catarina - Brasil',
    
    // JSON-LD Schema para buscadores e IA
    'application-name': siteName,
  }
};

// Schema.org JSON-LD para SEO de IA
export const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Xanxerê, 267e - Líder',
    addressLocality: 'Chapecó',
    addressRegion: 'SC',
    postalCode: '89805-270',
    addressCountry: 'BR',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+55-49-3323-9050',
      contactType: 'sales',
      areaServed: 'BR',
      availableLanguage: 'Portuguese'
    },
    {
      '@type': 'ContactPoint',
      telephone: '+55-49-98839-5635',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
      contactOption: 'TollFree'
    }
  ],
  sameAs: [
    'https://www.facebook.com/grupovendaforte',
    'https://www.instagram.com/grupovendaforte',
    'https://www.linkedin.com/company/grupo-venda-forte'
  ]
};


export const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': siteUrl,
  name: siteName,
  image: `${siteUrl}/sede.png`,
  description: siteDescription,
  url: siteUrl,
  telephone: '+55-49-3323-9050',
  priceRange: '$$',
  // Endereço da matriz, igual ao do Perfil da Empresa no Google. As coordenadas são as do pino do perfil
  // (link informado em 02/11/2026); as antigas eram do centro da cidade.
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Xanxerê, 267e - Líder',
    addressLocality: 'Chapecó',
    addressRegion: 'SC',
    postalCode: '89805-270',
    addressCountry: 'BR'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -27.06831,
    longitude: -52.62568
  },
  hasMap: 'https://maps.app.goo.gl/qahXxhmh5KUb2HUPA',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00'
    }
  ],
  // Sem aggregateRating: o Google ignora a nota que uma empresa dá a si mesma no próprio site (self-serving)
  // e a marcação precisa descrever avaliações visíveis na página. A nota real (5,0, 17 avaliações) está no Perfil da Empresa.
};

export const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  publisher: {
    '@type': 'Organization',
    name: siteName,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`
    }
  }
};
