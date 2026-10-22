import { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import PrivacidadeClient from '@/components/PrivacidadeClient'

const siteUrl = SITE_URL

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Conheça nossa Política de Privacidade e saiba como o Grupo Venda Forte protege seus dados pessoais de acordo com a LGPD.',
  alternates: {
    canonical: `${siteUrl}/privacidade`,
  },
  openGraph: {
    title: 'Política de Privacidade | Grupo Venda Forte',
    description: 'Saiba como o Grupo Venda Forte protege seus dados pessoais em conformidade com a LGPD.',
    url: `${siteUrl}/privacidade`,
    siteName: 'Venda Forte',
    type: 'website',
  },
}

export default function PrivacidadePage() {
  return <PrivacidadeClient />
}
