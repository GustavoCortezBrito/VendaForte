'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, List } from 'lucide-react'
import type { Heading } from '@/lib/blog-format'

/** Distância do topo, em px, em que um título passa a valer como "seção atual". */
const OFFSET = 140

/**
 * Índice do artigo, fixo ao lado do texto em tela larga. No celular fica oculto:
 * um segundo índice no HTML repetiria cada âncora, e num texto de cerca de mil
 * palavras o leitor rola direto.
 */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      let current = headings[0]?.id ?? null
      for (const heading of headings) {
        const element = document.getElementById(heading.id)
        if (element && element.getBoundingClientRect().top <= OFFSET) current = heading.id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [headings])

  const activeIndex = Math.max(0, headings.findIndex((heading) => heading.id === active))
  const percent = Math.round(((activeIndex + 1) / headings.length) * 100)

  return (
    <nav
      aria-label="Neste artigo"
      className="hidden overflow-hidden rounded-2xl border border-white/10 bg-ink-raised lg:block"
    >
      {/* Barra de progresso da leitura: avança conforme a seção atual */}
      <div className="h-1 bg-white/10" aria-hidden="true">
        <div className="h-full rounded-r-full bg-red-600 transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>

      <div className="p-5">
        <p className="flex items-center gap-2 text-xs font-bold text-red-500">
          <List className="h-4 w-4" aria-hidden="true" />
          Neste artigo
          <span className="ml-auto font-semibold tabular-nums text-ink-muted">
            {activeIndex + 1}/{headings.length}
          </span>
        </p>

        <ol className="mt-4">
          {headings.map((heading, index) => {
            const isActive = index === activeIndex
            const isDone = index < activeIndex
            return (
              <li key={heading.id} className="relative pl-7">
                {/* Trilho: vermelho até a seção atual, cinza daí em diante */}
                {index < headings.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-[7px] top-4 h-full w-0.5 transition-colors ${isDone ? 'bg-red-600' : 'bg-white/15'}`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[9px] h-4 w-4 rounded-full border-2 transition ${
                    isActive
                      ? 'border-red-600 bg-ink-raised ring-4 ring-red-500/20'
                      : isDone
                        ? 'border-red-600 bg-red-600'
                        : 'border-white/15 bg-ink-raised'
                  }`}
                />
                <a
                  href={`#${heading.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative block rounded-lg px-2 py-1.5 text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    isActive ? 'font-semibold text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="border-t border-white/10 bg-white/5 p-4">
        <a
          href="/promo#cotacao"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Pedir cotação
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </nav>
  )
}
