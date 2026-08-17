import { Metadata } from 'next'
import ForkliftsCatalogClient, { ForkliftProduct } from '@/components/ForkliftsCatalogClient'
import forkliftsData from '@/lib/data/electric-forklifts.json'

export const metadata: Metadata = {
  title: 'Catálogo de Empilhadeiras Elétricas, Paleteiras & Stackers EP | VendaForte',
  description: 'Catálogo de empilhadeiras elétricas, transpaleteiras, stackers e retráteis EP Equipment com bateria Íon-Lítio. Venda e locação no Sul e SP.',
  openGraph: {
    title: 'Catálogo Completo de Equipamentos Industriais EP | VendaForte',
    description: 'Empilhadeiras elétricas, transpaleteiras, stackers e retráteis EP Equipment de 1.0T a 25.0T com tecnologia Íon-Lítio.',
    images: ['https://cdn.ep-portal.net/products/attr_5/1764929800525-5hh3iv.webp'],
  }
}

export default function ElectricForkliftsPage() {
  return <ForkliftsCatalogClient initialProducts={forkliftsData as unknown as ForkliftProduct[]} />
}
