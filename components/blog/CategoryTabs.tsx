'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { blogHref, type CategoryInfo } from '@/lib/blog-format'
import { isPlainClick } from './soft-nav'

interface CategoryTabsProps {
  categories: CategoryInfo[]
  total: number
  /** Categoria aberta, ou nenhuma na listagem geral. */
  activeSlug?: string
  /** Troca de categoria no lugar. Sem ele, os links recarregam a página normalmente. */
  onNavigate?: (href: string) => void
}

interface Tab {
  slug: string | undefined
  name: string
  count: number
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Largura mínima, em px, a partir da qual a barra mostra só o que cabe e leva o resto para "Mais". */
const WIDE = 640

const TAB =
  'relative flex items-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 sm:px-5'

/**
 * Filtro por categoria em abas de texto, com um sublinhado vermelho que desliza
 * até a aba escolhida. Em tela larga mostra as categorias que cabem e agrupa o
 * resto em "Mais", em vez de esconder abas atrás de uma rolagem; a categoria
 * aberta nunca fica escondida. No celular a barra rola na horizontal e já abre
 * com a categoria atual no centro. São links comuns para páginas próprias
 * (/blog/categoria/…): funcionam sem JavaScript e o Google os encontra.
 */
export default function CategoryTabs({ categories, total, activeSlug, onNavigate }: CategoryTabsProps) {
  const reduceMotion = useReducedMotion()
  const rowRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  const tabs: Tab[] = [
    { slug: undefined, name: 'Todos', count: total },
    ...categories.map(({ slug, name, count }) => ({ slug, name, count })),
  ]

  // Quantas abas cabem na linha; antes de medir, todas
  const [fit, setFit] = useState(tabs.length)
  const [open, setOpen] = useState(false)
  const tabKey = tabs.map((tab) => `${tab.slug}:${tab.name}:${tab.count}`).join('|')

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current
      const sizer = measureRef.current
      if (!row || !sizer) return
      if (window.innerWidth < WIDE) return setFit(tabs.length)

      const widths = [...sizer.querySelectorAll<HTMLElement>('[data-tab]')].map((el) => el.offsetWidth)
      const moreWidth = sizer.querySelector<HTMLElement>('[data-more]')?.offsetWidth ?? 110
      const available = row.clientWidth
      if (widths.reduce((sum, width) => sum + width, 0) <= available) return setFit(tabs.length)

      let used = 0
      let count = 0
      for (const width of widths) {
        if (used + width > available - moreWidth) break
        used += width
        count += 1
      }
      setFit(Math.max(1, count))
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (rowRef.current) observer.observe(rowRef.current)
    return () => observer.disconnect()
  }, [tabKey])

  // A categoria aberta ocupa a última vaga visível se estivesse no "Mais"
  let visible = tabs.slice(0, fit)
  let hidden = tabs.slice(fit)
  const activeHidden = hidden.findIndex((tab) => tab.slug === activeSlug)
  if (activeHidden >= 0 && fit > 0) {
    const [moved] = hidden.splice(activeHidden, 1)
    const dropped = visible[visible.length - 1]
    visible = [...visible.slice(0, -1), moved]
    hidden = [dropped, ...hidden]
  }

  // No celular: abre com a categoria atual no centro da barra que rola
  useEffect(() => {
    const scroller = scrollerRef.current
    const current = scroller?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!scroller || !current || window.innerWidth >= WIDE) return
    const box = scroller.getBoundingClientRect()
    const tab = current.getBoundingClientRect()
    scroller.scrollTo({
      left: scroller.scrollLeft + (tab.left - box.left) - (box.width - tab.width) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [activeSlug, reduceMotion])

  // Fecha o "Mais" ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (tab: Tab, active: boolean) => (event: React.MouseEvent) => {
    if (!onNavigate || !isPlainClick(event)) return
    event.preventDefault()
    setOpen(false)
    if (!active) onNavigate(blogHref({ category: tab.slug }))
  }

  const count = (tab: Tab, active: boolean) => (
    <span className={`text-xs font-bold tabular-nums transition-colors ${active ? 'text-red-600' : 'text-gray-400'}`}>
      {tab.count}
    </span>
  )

  return (
    <nav aria-label="Filtrar por categoria">
      <LayoutGroup id="blog-tabs">
        <div ref={rowRef} className="relative flex justify-center">
          <div
            ref={scrollerRef}
            className="min-w-0 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] [scrollbar-width:none] sm:overflow-hidden sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex w-max">
              {visible.map((tab) => {
                const active = tab.slug === activeSlug
                return (
                  <li key={tab.slug ?? 'todos'} className="shrink-0">
                    <a
                      href={blogHref({ category: tab.slug })}
                      aria-current={active ? 'page' : undefined}
                      onClick={go(tab, active)}
                      className={`${TAB} ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {tab.name}
                      {count(tab, active)}
                      {active && (
                        <motion.span
                          layoutId="blog-tab-underline"
                          aria-hidden="true"
                          className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-red-600 sm:inset-x-5"
                          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 42 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {hidden.length > 0 && (
            <div ref={moreRef} className="relative hidden shrink-0 sm:block">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className={`${TAB} cursor-pointer ${open ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Mais
                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-gray-500">
                  {hidden.length}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {open && (
                <ul className="absolute right-0 top-full z-30 mt-1 w-72 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-900/10">
                  {hidden.map((tab) => {
                    const active = tab.slug === activeSlug
                    return (
                      <li key={tab.slug ?? 'todos'}>
                        <a
                          href={blogHref({ category: tab.slug })}
                          aria-current={active ? 'page' : undefined}
                          onClick={go(tab, active)}
                          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 ${
                            active ? 'text-red-600' : 'text-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {tab.name}
                            {active && <Check className="h-4 w-4" aria-hidden="true" />}
                          </span>
                          {count(tab, active)}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mede a largura de cada aba sem aparecer: define quantas cabem */}
        <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 -z-10 flex h-0 overflow-hidden">
          {tabs.map((tab) => (
            <span key={tab.slug ?? 'todos'} data-tab className={`${TAB} shrink-0`}>
              {tab.name}
              <span className="text-xs font-bold tabular-nums">{tab.count}</span>
            </span>
          ))}
          <span data-more className={`${TAB} shrink-0`}>
            Mais
            <span className="px-1.5 text-[11px] font-bold">00</span>
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </LayoutGroup>
    </nav>
  )
}
