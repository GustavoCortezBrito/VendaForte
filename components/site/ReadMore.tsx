'use client'

import { useState, type ReactNode } from 'react'

/**
 * Texto longo recolhido no celular, inteiro no computador. O conteúdo continua todo na página (só fica cortado
 * por altura), então busca e leitores de tela leem tudo; o botão abre e fecha. A base esmaece para a cor do fundo.
 */
export default function ReadMore({ children, collapsedClass = 'max-h-36' }: { children: ReactNode; collapsedClass?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className={`relative overflow-hidden transition-[max-height] duration-500 ease-out lg:max-h-none ${open ? 'max-h-[80rem]' : collapsedClass}`}>
        {children}
        {!open && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent lg:hidden" />}
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="mt-2 inline-flex h-11 cursor-pointer items-center text-sm font-semibold text-red-400 transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 lg:hidden"
      >
        {open ? 'Ler menos' : 'Ler mais'}
      </button>
    </div>
  )
}
