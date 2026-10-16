'use client'

import type { MouseEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { blogHref, pageWindow } from '@/lib/blog-format'
import { isPlainClick } from './soft-nav'

interface PaginationProps {
  page: number
  totalPages: number
  /** Categoria aberta, para os endereços ficarem dentro dela. */
  category?: string
  range: { from: number; to: number; total: number }
  /** Troca de página no lugar. Sem ele, os links recarregam a página normalmente. */
  onNavigate?: (href: string) => void
}

const BOX =
  'inline-flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
const IDLE = 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
const CURRENT = 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/25'
const OFF = 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'

/**
 * Paginação numerada. Cada número é um link para uma página estática própria
 * (/blog/page/2…), que o Google consegue seguir; com JavaScript a troca é feita
 * no lugar, sem recarregar. A página atual leva `aria-current`.
 */
export default function Pagination({ page, totalPages, category, range, onNavigate }: PaginationProps) {
  if (totalPages <= 1) return null

  const href = (target: number) => blogHref({ category, page: target })

  // Links comuns de propósito: o `Link` do Next buscaria antecipadamente todas as páginas
  const go = (target: number) => (event: MouseEvent) => {
    if (!onNavigate || !isPlainClick(event)) return
    event.preventDefault()
    onNavigate(href(target))
  }

  return (
    <nav aria-label="Paginação do blog" className="mt-14 flex flex-col items-center gap-4">
      <ul className="flex items-center gap-1.5 sm:gap-2">
        <li>
          {page > 1 ? (
            <a
              href={href(page - 1)}
              rel="prev"
              aria-label="Página anterior"
              onClick={go(page - 1)}
              className={`${BOX} ${IDLE} gap-1 pl-2.5 pr-3.5`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Anterior</span>
            </a>
          ) : (
            <span aria-disabled="true" className={`${BOX} ${OFF} gap-1 pl-2.5 pr-3.5`}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Anterior</span>
            </span>
          )}
        </li>

        {pageWindow(page, totalPages).map((item, position) =>
          item === 'gap' ? (
            <li key={`gap-${position}`} aria-hidden="true" className="px-1 text-gray-400">
              …
            </li>
          ) : (
            <li key={item}>
              <a
                href={href(item)}
                aria-label={`Página ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={go(item)}
                className={`${BOX} tabular-nums ${item === page ? CURRENT : IDLE}`}
              >
                {item}
              </a>
            </li>
          )
        )}

        <li>
          {page < totalPages ? (
            <a
              href={href(page + 1)}
              rel="next"
              aria-label="Próxima página"
              onClick={go(page + 1)}
              className={`${BOX} ${IDLE} gap-1 pl-3.5 pr-2.5`}
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <span aria-disabled="true" className={`${BOX} ${OFF} gap-1 pl-3.5 pr-2.5`}>
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>

      <p className="text-sm text-gray-500">
        Mostrando <span className="font-semibold text-gray-700">{range.from}–{range.to}</span> de{' '}
        <span className="font-semibold text-gray-700">{range.total}</span> artigos
      </p>
    </nav>
  )
}
