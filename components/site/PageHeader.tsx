import type { ReactNode } from 'react'
import { CONTAINER, EYEBROW, LEAD } from '@/components/site/styles'

/**
 * Abertura das páginas internas, no padrão da campanha: rótulo vermelho, título grande e
 * apertado, texto de apoio e, se houver, botões ou um trecho extra embaixo.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  before,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  /** Botões, busca ou qualquer coisa abaixo do texto. */
  children?: ReactNode
  /** Acima do rótulo (trilha de navegação). */
  before?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-ink pb-16 pt-32 lg:pb-20 lg:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-24 h-[36rem] w-[36rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.13), transparent 65%)' }}
      />
      <div className={`relative ${CONTAINER}`}>
        {before}
        <div className="max-w-4xl">
          {eyebrow && <p className={`${EYEBROW} rise`} style={{ '--delay': '0.05s' } as React.CSSProperties}>{eyebrow}</p>}
          <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {lead && (
            <div className={`rise mt-6 max-w-2xl ${LEAD}`} style={{ '--delay': '0.15s' } as React.CSSProperties}>
              {lead}
            </div>
          )}
        </div>
        {children && (
          <div className="rise mt-8" style={{ '--delay': '0.28s' } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
