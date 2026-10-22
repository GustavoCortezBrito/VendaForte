import { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import TermosClient from '@/components/TermosClient'

const siteUrl = SITE_URL

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Leia os Termos de Uso do site e serviços do Grupo Venda Forte, especialistas em venda, locação e manutenção de empilhadeiras.',
  alternates: {
    canonical: `${siteUrl}/termos`,
  },
  openGraph: {
    title: 'Termos de Uso | Grupo Venda Forte',
    description: 'Termos e condições de uso do site e serviços do Grupo Venda Forte.',
    url: `${siteUrl}/termos`,
    siteName: 'Venda Forte',
    type: 'website',
  },
}

export default function TermosPage() {
  return <TermosClient />
}
