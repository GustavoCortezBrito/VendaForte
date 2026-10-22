// Schemas adicionais para Rich Results do Google

import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

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
