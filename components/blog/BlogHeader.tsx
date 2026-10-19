import type { ReactNode } from 'react'
import { CONTAINER, EYEBROW } from './styles'

interface BlogHeaderProps {
  eyebrow: string
  title: ReactNode
  intro?: string
  /** Busca, logo abaixo do título. */
  children?: ReactNode
  /** Sem a linha inferior, quando outra barra vem logo abaixo e já tem a sua. */
  borderless?: boolean
}

/**
 * Abertura das páginas de listagem e de busca: o mesmo desenho das seções da
 * página inicial (etiqueta, título extranegrito centralizado, texto cinza).
 * Sem `overflow-hidden`, para o painel de sugestões da busca poder sair do bloco.
 */
export default function BlogHeader({ eyebrow, title, intro, children, borderless = false }: BlogHeaderProps) {
  return (
    <header
      className={`relative bg-gradient-to-b from-gray-50 to-white pb-8 pt-28 lg:pb-10 lg:pt-32 ${borderless ? '' : 'border-b border-gray-100'}`}
    >
      {/* Brilho vermelho bem suave atrás do título: dá profundidade sem competir com o texto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(48%_70%_at_50%_0%,rgba(220,38,38,0.09),transparent)]"
      />
      <div className={`${CONTAINER} relative`}>
        <div className="mx-auto max-w-4xl text-center">
          <span className={EYEBROW}>{eyebrow}</span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          {intro && <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">{intro}</p>}
        </div>
        {children}
      </div>
    </header>
  )
}
