import Link from 'next/link'
import { FileText, PenLine, Truck } from 'lucide-react'

/** Barra do painel nas telas de rascunho, no mesmo desenho das outras telas do admin. */
export default function DraftsHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white shadow-md shadow-red-600/20">
              VF
            </div>
            <div className="hidden sm:block">
              <span className="block text-base font-bold leading-none text-gray-900">Venda Forte</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">Painel Admin</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-5">
            <Link
              href="/admin/empilhadeiras"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Truck size={14} />
              <span className="hidden md:inline">Empilhadeiras</span>
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <FileText size={14} />
              <span className="hidden md:inline">Blog &amp; Notícias</span>
            </Link>
            <Link
              href="/admin/rascunhos"
              className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/20"
            >
              <PenLine size={14} />
              <span className="hidden md:inline">Rascunhos</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
