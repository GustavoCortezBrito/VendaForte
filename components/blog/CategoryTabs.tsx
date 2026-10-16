'use client'

import { useEffect, useRef } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
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

/**
 * Filtro por categoria em abas de texto, como nos blogs de Stripe, Vercel e
 * Linear: uma barra única, sem botões, com um sublinhado vermelho que desliza
 * até a aba escolhida. São links comuns para páginas próprias (/blog/categoria/…),
 * então funcionam sem JavaScript e o Google os encontra; com JavaScript, a
 * lista troca no lugar. No celular a barra rola na horizontal e já abre com a
 * categoria atual no centro.
 */
export default function CategoryTabs({ categories, total, activeSlug, onNavigate }: CategoryTabsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const scroller = scrollerRef.current
    const current = scroller?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!scroller || !current) return
    const box = scroller.getBoundingClientRect()
    const tab = current.getBoundingClientRect()
    scroller.scrollTo({
      left: scroller.scrollLeft + (tab.left - box.left) - (box.width - tab.width) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [activeSlug, reduceMotion])

  const tabs = [
    { slug: undefined, name: 'Todos', count: total },
    ...categories.map(({ slug, name, count }) => ({ slug, name, count })),
  ]

  return (
    <nav aria-label="Filtrar por categoria">
      <LayoutGroup id="blog-tabs">
        <div
          ref={scrollerRef}
          className="overflow-x-auto px-4 [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] [scrollbar-width:none] sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* `mx-auto w-max` centraliza quando cabe e deixa rolar quando não cabe, sem cortar o começo */}
          <ul className="mx-auto flex w-max">
            {tabs.map(({ slug, name, count }) => {
              const active = slug === activeSlug
              const href = blogHref({ category: slug })
              return (
                <li key={slug ?? 'todos'} className="shrink-0">
                  <a
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    onClick={(event) => {
                      if (!onNavigate || !isPlainClick(event)) return
                      event.preventDefault()
                      if (!active) onNavigate(href)
                    }}
                    className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 sm:px-5 ${
                      active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {name}
                    <span
                      className={`text-xs font-bold tabular-nums transition-colors ${active ? 'text-red-600' : 'text-gray-400'}`}
                    >
                      {count}
                    </span>
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
      </LayoutGroup>
    </nav>
  )
}
