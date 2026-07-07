// Schemas adicionais para Rich Results do Google

const baseUrl = 'https://grupovendaforte.com';

// Schema de Produtos (para aparecer em buscas de produtos)
export const productsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Product",
      "position": 1,
      "name": "Empilhadeira Elétrica",
      "description": "Empilhadeiras elétricas de 1.5 a 3.5 toneladas, ideais para ambientes fechados com zero emissões.",
      "brand": {
        "@type": "Brand",
        "name": "Grupo Venda Forte"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "Consultar",
          "priceCurrency": "BRL"
        }
      },
      "category": "Empilhadeiras",
      "url": `${baseUrl}#services`
    },
    {
      "@type": "Product",
      "position": 2,
      "name": "Empilhadeira a Gás (GLP)",
      "description": "Empilhadeiras a gás de 1.5 a 5.0 toneladas, versáteis para uso interno e externo.",
      "brand": {
        "@type": "Brand",
        "name": "Grupo Venda Forte"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock"
      },
      "category": "Empilhadeiras"
    },
    {
      "@type": "Product",
      "position": 3,
      "name": "Empilhadeira a Diesel",
      "description": "Empilhadeiras diesel de 2.5 a 10 toneladas para trabalhos pesados em ambientes externos.",
      "brand": {
        "@type": "Brand",
        "name": "Grupo Venda Forte"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock"
      },
      "category": "Empilhadeiras"
    }
  ]
};

// Schema de Serviços
export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Venda e Locação de Empilhadeiras",
  "provider": {
    "@type": "Organization",
    "name": "Grupo Venda Forte",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "telephone": "+55-49-3323-9050",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chapecó",
      "addressRegion": "SC",
      "addressCountry": "BR"
    }
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Chapecó"
    },
    {
      "@type": "City",
      "name": "Joinville"
    },
    {
      "@type": "City",
      "name": "Itajaí"
    },
    {
      "@type": "City",
      "name": "Maringá"
    },
    {
      "@type": "City",
      "name": "Seberi"
    },
    {
      "@type": "City",
      "name": "Esteio"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de Empilhadeiras",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Venda de Empilhadeiras Novas",
          "description": "Importação direta de empilhadeiras novas com melhor custo-benefício"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Locação de Empilhadeiras",
          "description": "Aluguel flexível (diário, mensal, anual) com manutenção incluída"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Manutenção de Empilhadeiras",
          "description": "Manutenção preventiva e corretiva multimarcas 24h"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Peças e Acessórios",
          "description": "Estoque completo de peças originais multimarcas"
        }
      }
    ]
  }
};

// Breadcrumb para navegação
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Produtos",
      "item": `${baseUrl}#services`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Sobre",
      "item": `${baseUrl}#about`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Contato",
      "item": `${baseUrl}#contact`
    }
  ]
};

// Schema de Artigo/Página para melhor indexação
export const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Grupo Venda Forte - Empilhadeiras e Equipamentos Industriais",
  "description": "Venda, locação e manutenção de empilhadeiras em Chapecó-SC. Equipamentos elétricos, a gás e diesel. 20+ anos de experiência.",
  "url": baseUrl,
  "mainEntity": {
    "@type": "Organization",
    "name": "Grupo Venda Forte"
  },
  "specialty": [
    "Empilhadeiras Elétricas",
    "Empilhadeiras a Gás",
    "Empilhadeiras Diesel",
    "Locação de Equipamentos",
    "Manutenção de Empilhadeiras",
    "Peças Multimarcas"
  ],
  "keywords": "empilhadeiras, equipamentos industriais, locação, manutenção, Chapecó, Santa Catarina"
};
