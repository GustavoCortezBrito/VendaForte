'use client'

import { useEffect, useState } from 'react'
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

  return (
    <nav aria-label="Neste artigo" className="hidden lg:block">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Neste artigo</p>
      <ol className="space-y-1 text-sm">
        {headings.map((heading) => {
          const isActive = heading.id === active
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`block rounded-r-lg border-l-2 py-1.5 pl-3 pr-2 leading-snug transition-colors ${
                  isActive
                    ? 'border-red-600 bg-red-50/60 font-semibold text-gray-900'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
