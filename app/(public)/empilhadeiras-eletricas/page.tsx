import { Metadata } from 'next'
import ForkliftsCatalogClient, { ForkliftProduct } from '@/components/ForkliftsCatalogClient'
import forkliftsData from '@/lib/data/electric-forklifts.json'

export const metadata: Metadata = {
  title: 'Catálogo Completo de Empilhadeiras Elétricas | VendaForte',
  description: 'Conheça o catálogo completo com mais de 100 modelos de empilhadeiras elétricas com bateria de Íon-Lítio 80V/48V, motores duplos PMSM e alta manobrabilidade.',
  openGraph: {
    title: 'Catálogo Completo de Empilhadeiras Elétricas | VendaForte',
    description: 'Catálogo completo de empilhadeiras elétricas de 1.0T a 25.0T com tecnologia Lithium-Ion e motores PMSM.',
    images: ['https://cdn.ep-portal.net/products/attr_5/1764929800525-5hh3iv.webp'],
  }
}

export default function ElectricForkliftsPage() {
  return <ForkliftsCatalogClient initialProducts={forkliftsData as unknown as ForkliftProduct[]} />
}
