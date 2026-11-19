import type { Metadata } from 'next'
import { ReactNode } from 'react'
import FeedbackHost from '@/components/admin/Feedback'

export const metadata: Metadata = {
  title: { absolute: 'Painel administrativo | Venda Forte' },
  description: 'Área restrita do Grupo Venda Forte.',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Layout isolado para área administrativa
  // Não herda Navbar, Footer ou WhatsAppButton do layout principal.
  // O invólucro é o mesmo do site público e da /promo (fundo ink, seleção vermelha, foco visível).
  return (
    <div className="admin-layout theme-ink min-h-screen bg-ink font-sans text-white antialiased selection:bg-red-600 selection:text-white">
      {children}
      <FeedbackHost />
    </div>
  )
}
