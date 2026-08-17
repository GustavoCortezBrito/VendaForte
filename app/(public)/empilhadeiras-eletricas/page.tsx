import { Metadata } from 'next'
import ForkliftsCatalogClient, { ForkliftProduct } from '@/components/ForkliftsCatalogClient'
import forkliftsData from '@/lib/data/electric-forklifts.json'

export const metadata: Metadata = {
  title: 'Catálogo Completo de Equipamentos Industriais | Empilhadeiras, Paleteiras, Retráteis & Stackers | VendaForte',
  description: 'Conheça o catálogo completo com mais de 220 modelos de empilhadeiras elétricas (3R e 4R), paleteiras elétricas, stackers, empilhadeiras retráteis (reach trucks), selecionadoras de pedidos e rebocadores EP Equipment com bateria de Íon-Lítio.',
  openGraph: {
    title: 'Catálogo Completo de Equipamentos Industriais EP | VendaForte',
    description: 'Catálogo completo de empilhadeiras contrabalançadas, paleteiras, stackers, retráteis, selecionadoras e rebocadores EP Equipment de 1.0T a 25.0T com tecnologia Lithium-Ion.',
    images: ['https://cdn.ep-portal.net/products/attr_5/1764929800525-5hh3iv.webp'],
  }
}

export default function ElectricForkliftsPage() {
  return <ForkliftsCatalogClient initialProducts={forkliftsData as unknown as ForkliftProduct[]} />
}
