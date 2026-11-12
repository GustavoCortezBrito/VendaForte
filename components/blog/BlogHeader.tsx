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
 * campanha /promo (rótulo vermelho, título grande e apertado, texto cinza), centralizado por causa da busca.
 * Sem `overflow-hidden`, para o painel de sugestões da busca poder sair do bloco.
 */
export default function BlogHeader({ eyebrow, title, intro, children, borderless = false }: BlogHeaderProps) {
  return (
    <header
      className={`relative bg-gradient-to-b from-ink to-ink pb-10 pt-32 lg:pb-14 lg:pt-40 ${borderless ? '' : 'border-b border-white/10'}`}
    >
      {/* Brilho vermelho bem suave atrás do título: dá profundidade sem competir com o texto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(48%_70%_at_50%_0%,rgba(220,38,38,0.16),transparent)]"
      />
      <div className={`${CONTAINER} relative`}>
        <div className="mx-auto max-w-4xl text-center">
          <p className={`${EYEBROW} rise`} style={{ "--delay": "0.05s" } as React.CSSProperties}>{eyebrow}</p>
          <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {intro && (
            <p className="rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-neutral-400 sm:text-lg" style={{ "--delay": "0.15s" } as React.CSSProperties}>
              {intro}
            </p>
          )}
        </div>
        {children && (
          <div className="rise" style={{ "--delay": "0.28s" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </header>
  )
}
