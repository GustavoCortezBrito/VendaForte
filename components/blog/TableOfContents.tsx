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
      className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block"
    >
      {/* Barra de progresso da leitura: avança conforme a seção atual */}
      <div className="h-1 bg-gray-100" aria-hidden="true">
        <div className="h-full rounded-r-full bg-red-600 transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>

      <div className="p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
          <List className="h-4 w-4" aria-hidden="true" />
          Neste artigo
          <span className="ml-auto font-semibold tabular-nums text-gray-400">
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
                    className={`absolute left-[7px] top-4 h-full w-0.5 transition-colors ${isDone ? 'bg-red-600' : 'bg-gray-200'}`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[9px] h-4 w-4 rounded-full border-2 transition-all ${
                    isActive
                      ? 'border-red-600 bg-white ring-4 ring-red-100'
                      : isDone
                        ? 'border-red-600 bg-red-600'
                        : 'border-gray-300 bg-white'
                  }`}
                />
                <a
                  href={`#${heading.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative block rounded-lg px-2 py-1.5 text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    isActive ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-4">
        <a
          href="/promo#cotacao"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Pedir cotação
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </nav>
  )
}
