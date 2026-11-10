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
      <div role="radiogroup" aria-label="Ordenar artigos" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
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
                  className="absolute inset-0 rounded-full bg-white"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 42 }}
                />
              )}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-red-500 peer-focus-visible:ring-offset-1"
              />
              <span
                className={`relative flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'text-ink' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-red-500' : ''}`} aria-hidden="true" />
                {label}
              </span>
            </label>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
