import { Metadata } from 'next'
import ForkliftsCatalogClient, { ForkliftProduct } from '@/components/ForkliftsCatalogClient'
import forkliftsData from '@/lib/data/electric-forklifts.json'

export const metadata: Metadata = {
  title: 'Produtos & Equipamentos EP Equipment | VendaForte',
  description: 'Catálogo completo de produtos EP Equipment: empilhadeiras elétricas, transpaleteiras, stackers, retráteis e equipamentos industriais com bateria Íon-Lítio.',
  openGraph: {
    title: 'Catálogo de Produtos EP Equipment | VendaForte',
    description: 'Empilhadeiras elétricas, transpaleteiras, stackers, retráteis e equipamentos industriais EP Equipment de 1.0T a 25.0T com tecnologia Íon-Lítio.',
    images: ['https://cdn.ep-portal.net/products/attr_5/1764929800525-5hh3iv.webp'],
  }
}

export default function ProdutosPage() {
  return <ForkliftsCatalogClient initialProducts={forkliftsData as unknown as ForkliftProduct[]} />
}
