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
      className={`bg-gradient-to-b from-gray-50 to-white pb-10 pt-32 lg:pb-14 lg:pt-40 ${borderless ? '' : 'border-b border-gray-100'}`}
    >
      <div className={CONTAINER}>
        <div className="mx-auto max-w-3xl text-center">
          <span className={EYEBROW}>{eyebrow}</span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro && <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-gray-600">{intro}</p>}
        </div>
        {children}
      </div>
    </header>
  )
}
