'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, SlidersHorizontal, X } from 'lucide-react'
import { blogHref, type CategoryInfo } from '@/lib/blog-format'
import { isPlainClick } from './soft-nav'

interface CategoryFilterProps {
  categories: CategoryInfo[]
  /** Total de artigos, para a opção "Todos". */
  total: number
  /** Categoria aberta, ou nenhuma na listagem geral. */
  active?: CategoryInfo | null
  /** Troca de categoria no lugar. Sem ele, os links recarregam a página normalmente. */
  onNavigate?: (href: string) => void
}

/**
 * Filtro por categoria num botão "Filtrar": abre uma lista com todas as
 * categorias e suas contagens (cartão ao lado do botão no computador, painel
 * deslizante embaixo no celular). A categoria escolhida aparece como etiqueta
 * ao lado, com um X para limpar. A lista fica sempre no HTML, só escondida,
 * então as categorias continuam sendo links que o Google encontra; sem
 * JavaScript, o botão não abre, mas a página de cada categoria segue acessível.
 */
export default function CategoryFilter({ categories, total, active, onNavigate }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const options = [{ slug: undefined as string | undefined, name: 'Todos os artigos', count: total }, ...categories]

  const close = (returnFocus = false) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  // Esc e clique fora fecham; ao abrir, o foco vai para a opção atual
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true)
    }
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    rootRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const choose = (slug: string | undefined, isActive: boolean) => (event: React.MouseEvent) => {
    if (!onNavigate || !isPlainClick(event)) return
    event.preventDefault()
    close(true)
    if (!isActive) onNavigate(blogHref({ category: slug }))
  }

  return (
    <nav aria-label="Filtrar por categoria" className="flex items-center gap-3 py-3">
      <div ref={rootRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
            open || active
              ? 'border-gray-900 bg-gray-900 text-white shadow-md'
              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filtrar
          {active && <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />}
        </button>

        {/* Fundo escuro do painel, só no celular */}
        <div
          aria-hidden="true"
          onClick={() => close()}
          className={`fixed inset-0 z-40 bg-gray-900/40 transition-opacity duration-200 sm:hidden ${
            open ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        />

        <div
          id={panelId}
          role="dialog"
          aria-label="Filtrar por categoria"
          data-open={open}
          className={`z-50 border border-gray-200 bg-white shadow-2xl shadow-gray-900/15 transition-all duration-200 ease-out max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[80vh] max-sm:overflow-y-auto max-sm:rounded-t-3xl sm:absolute sm:left-0 sm:top-full sm:mt-2 sm:w-80 sm:rounded-2xl ${
            open
              ? 'visible translate-y-0 opacity-100'
              : 'invisible opacity-0 max-sm:translate-y-full sm:translate-y-1'
          }`}
        >
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">Categoria</p>
            <button
              type="button"
              onClick={() => close(true)}
              aria-label="Fechar filtro"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ul className="p-2 pb-4 sm:pb-2">
            {options.map((option) => {
              const isActive = (option.slug ?? null) === (active?.slug ?? null)
              return (
                <li key={option.slug ?? 'todos'}>
                  <a
                    href={blogHref({ category: option.slug })}
                    aria-current={isActive ? 'page' : undefined}
                    tabIndex={open ? 0 : -1}
                    onClick={choose(option.slug, isActive)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 ${
                      isActive ? 'bg-red-50/70 font-bold text-gray-900' : 'font-semibold text-gray-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        isActive ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isActive && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="flex-1">{option.name}</span>
                    <span className={`text-xs font-bold tabular-nums ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                      {option.count}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {active && (
        <a
          href={blogHref()}
          onClick={(event) => {
            if (!onNavigate || !isPlainClick(event)) return
            event.preventDefault()
            onNavigate(blogHref())
          }}
          className="inline-flex h-11 max-w-[55%] items-center gap-2 rounded-xl bg-red-50 pl-4 pr-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:max-w-none"
        >
          <span className="truncate">{active.name}</span>
          <X className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Limpar filtro</span>
        </a>
      )}
    </nav>
  )
}
