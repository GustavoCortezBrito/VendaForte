'use client'

import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import type { SortOrder } from '@/lib/blog-list'

interface SortToggleProps {
  value: SortOrder
  onChange: (value: SortOrder) => void
}

const OPTIONS = [
  { value: 'recentes', label: 'Mais recentes', Icon: ArrowDownWideNarrow },
  { value: 'antigos', label: 'Mais antigos', Icon: ArrowUpNarrowWide },
] as const

/**
 * Ordem da lista: "mais recentes" ou "mais antigos". Controle segmentado com um
 * marcador branco que desliza até a opção escolhida. São botões de opção
 * nativos (radio), então setas, Tab e leitores de tela funcionam sem código extra.
 */
export default function SortToggle({ value, onChange }: SortToggleProps) {
  const reduceMotion = useReducedMotion()

  return (
    <LayoutGroup id="blog-sort">
      <div role="radiogroup" aria-label="Ordenar artigos" className="inline-flex rounded-xl bg-gray-200/70 p-1">
        {OPTIONS.map(({ value: option, label, Icon }) => {
          const active = option === value
          return (
            <label key={option} className="relative cursor-pointer select-none">
              <input
                type="radio"
                name="ordem-dos-artigos"
                value={option}
                checked={active}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              {active && (
                <motion.span
                  layoutId="blog-sort-thumb"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-black/5"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 42 }}
                />
              )}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-red-500 peer-focus-visible:ring-offset-1"
              />
              <span
                className={`relative flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-red-600' : ''}`} aria-hidden="true" />
                {label}
              </span>
            </label>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
