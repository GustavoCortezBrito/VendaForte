import type { Metadata } from 'next'
import AboutPageClient from '@/components/AboutPageClient'

export const metadata: Metadata = {
  title: { absolute: 'Sobre a Venda Forte | Dealer EP em Chapecó e Joinville' },
  description: 'Conheça a Venda Forte, Dealer EP Equipment em Chapecó e Joinville. Mais de 20 anos em empilhadeiras elétricas, locação e assistência no Sul e SP.',
  keywords: 'venda forte chapecó, empilhadeiras joinville, dealer ep equipment sc, empilhadeiras elétricas chapecó, assistência técnica joinville, locação empilhadeiras santa catarina, empilhadeiras sul do brasil',
  openGraph: {
    title: 'Sobre a Venda Forte - Dealer Oficial EP Equipment SC',
    description: 'Dealer EP Equipment em Chapecó e Joinville. Empilhadeiras elétricas, assistência técnica e peças originais no Sul do Brasil e SP.',
    type: 'website',
    locale: 'pt_BR',
  },
  alternates: {
    canonical: '/sobre'
  }
}

export default function SobrePage() {
  return <AboutPageClient />
}
