'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useDragScroll } from './useDragScroll'

interface TileScrollerProps {
  /** Rótulo visível acima da fileira ("Explore por tema"). */
  label: string
  /** Nome da navegação para leitores de tela. */
  ariaLabel: string
  /** Muda quando a escolha muda: a fileira centraliza o cartão ativo. */
  activeKey?: string
  children: ReactNode
}

/**
 * Fileira horizontal de cartões que rola com o dedo, arrastando com o mouse,
 * pela roda ou pelas setas, e centraliza o cartão escolhido (o que tiver
 * `aria-current="page"` ou `aria-pressed="true"`). Usada nos temas do blog e
 * nos tipos de equipamento do catálogo.
 */
export default function TileScroller({ label, ariaLabel, activeKey, children }: TileScrollerProps) {
  const reduceMotion = useReducedMotion()
  const { ref, dragging, handlers } = useDragScroll<HTMLDivElement>()
  const [edge, setEdge] = useState({ start: true, end: false })

  const updateEdges = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [ref])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      observer.disconnect()
    }
  }, [ref, updateEdges])

  // O cartão escolhido fica no centro da fileira (só rola a fileira, nunca a página)
  useEffect(() => {
    const el = ref.current
    const current = el?.querySelector<HTMLElement>('[aria-current="page"], [aria-pressed="true"]')
    if (!el || !current) return
    const box = el.getBoundingClientRect()
    const tile = current.getBoundingClientRect()
    el.scrollTo({
      left: el.scrollLeft + (tile.left - box.left) - (box.width - tile.width) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [activeKey, reduceMotion, ref])

  const scrollBy = (direction: 1 | -1) => {
    const el = ref.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const arrow =
    'hidden h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white sm:grid'

  return (
    <nav aria-label={ariaLabel}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">{label}</p>
        <div className="flex gap-2">
          <button type="button" aria-label="Anteriores" disabled={edge.start} onClick={() => scrollBy(-1)} className={arrow}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Próximos" disabled={edge.end} onClick={() => scrollBy(1)} className={arrow}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* O respiro (p-2 -m-2) deixa o contorno e a sombra dos cartões aparecerem sem serem cortados;
          scroll-px-2 faz o encaixe da rolagem respeitar esse respiro */}
      <div
        ref={ref}
        {...handlers}
        className={`-m-2 flex scroll-px-2 gap-3 overflow-x-auto p-2 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden ${
          dragging ? 'cursor-grabbing select-none snap-none' : 'snap-x scroll-smooth sm:cursor-grab'
        }`}
      >
        {children}
      </div>
    </nav>
  )
}
