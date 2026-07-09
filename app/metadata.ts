import type { Metadata } from "next";

const siteUrl = "https://grupovendaforte.com";
const siteName = "Grupo Venda Forte";
const siteDescription = "Empilhadeiras em Chapecó-SC: venda, locação e manutenção. Empilhadeira elétrica, empilhadeira diesel, transpaleteira, paleteira e empilhadeira autônoma.";
const siteKeywords = [
  // Palavras-chave principais (rastreamento GA/GSC)
  "empilhadeira diesel",
  "empilhadeira elétrica",
  "transpaleteira",
  "paleteira",
  "empilhadeira autônoma",
  // Palavras-chave secundárias
  "empilhadeiras Chapecó",
  "empilhadeiras Santa Catarina",
  "venda empilhadeiras",
  "locação empilhadeiras",
  "manutenção empilhadeiras",
  "peças empilhadeiras",
  "empilhadeiras elétricas",
  "empilhadeiras a gás",
  "equipamentos industriais",
  "movimentação de cargas",
  "Grupo Venda Forte",
  "empilhadeiras Joinville",
  "empilhadeiras Sul do Brasil",
  "assistência técnica empilhadeiras",
  "transpaleteira elétrica",
  "paleteira manual",
  "empilhadeira autônoma inteligente"
];

export const metadata: Metadata = {
  // Metadados Básicos
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Empilhadeiras e Equipamentos Industriais`,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  
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
    title: `${siteName} - Empilhadeiras e Equipamentos Industriais`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Empilhadeiras e Equipamentos Industriais`,
        type: 'image/jpeg',
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
    title: `${siteName} - Empilhadeiras e Equipamentos Industriais`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@grupovendaforte',
  },

  // Informações de Contato e Localização
  alternates: {
    canonical: siteUrl,
  },

  // Verificação e Analytics
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
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
    'ai:main_services': 'Venda, Locação, Manutenção, Assistência Técnica 24h',
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
    addressLocality: 'Chapecó',
    addressRegion: 'SC',
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
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chapecó',
    addressLocality: 'Chapecó',
    addressRegion: 'SC',
    postalCode: '89800-000',
    addressCountry: 'BR'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -27.0945,
    longitude: -52.6166
  },
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '17',
    bestRating: '5',
    worstRating: '1'
  }
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
