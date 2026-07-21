import { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Layout isolado para área administrativa
  // Não herda Navbar, Footer ou WhatsAppButton do layout principal
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}
