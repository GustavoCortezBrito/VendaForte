import type { Metadata } from 'next'
import AboutPageClient from '@/components/AboutPageClient'

export const metadata: Metadata = {
  title: 'Sobre a Venda Forte - Dealer EP Equipment em Chapecó e Joinville | Empilhadeiras SC',
  description: 'Conheça a Venda Forte, Dealer Autorizado EP Equipment em Chapecó-SC e Joinville. Mais de 20 anos de experiência em empilhadeiras elétricas, assistência técnica e locação no Sul do Brasil e São Paulo.',
  keywords: 'venda forte chapecó, empilhadeiras joinville, dealer ep equipment sc, empilhadeiras elétricas chapecó, assistência técnica joinville, locação empilhadeiras santa catarina, empilhadeiras sul do brasil',
  openGraph: {
    title: 'Sobre a Venda Forte - Dealer Oficial EP Equipment SC',
    description: 'Dealer Autorizado EP Equipment em Chapecó e Joinville. Empilhadeiras elétricas, assistência 24/7 e peças originais no Sul do Brasil.',
    type: 'website',
    locale: 'pt_BR',
  },
  alternates: {
    canonical: 'https://www.vendaforte.com/sobre'
  }
}

export default function SobrePage() {
  return <AboutPageClient />
}
