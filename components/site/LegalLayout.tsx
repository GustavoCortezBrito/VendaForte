'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import PageHeader from '@/components/site/PageHeader'
import { CARD, CONTAINER } from '@/components/site/styles'

/**
 * Página de texto longo (termos, privacidade) no padrão do site: abertura da campanha, índice fixo à
 * esquerda que acompanha a leitura e as seções separadas por linhas finas, sem um cartão gigante.
 * O texto de cada seção é escrito em JSX comum; as listas e os destaques ganham o estilo aqui.
 */
export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

// Lista, parágrafo, subtítulo e link de qualquer seção, sem repetir classe em cada item
const BODY =
  'text-[15px] leading-relaxed text-neutral-400 [&_a]:font-semibold [&_a]:text-red-400 [&_a]:underline-offset-4 hover:[&_a]:underline [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_li]:marker:text-neutral-600 [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_strong]:font-semibold [&_strong]:text-neutral-200 [&_ul+p]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5'

export default function LegalLayout({
  eyebrow,
  title,
  updated,
  intro,
  sections,
  contact,
}: {
  eyebrow: string
  title: string
  updated?: string
  intro?: ReactNode
  sections: LegalSection[]
  contact: { title: string; lines: ReactNode }
}) {
  // O contato também entra no índice
  const entries = [...sections.map(({ id, title }) => ({ id, title })), { id: 'contato', title: contact.title }]
  const [active, setActive] = useState(entries[0]?.id)
  const [tocOpen, setTocOpen] = useState(false)

  // Seção que cruza o terço de cima da tela
  useEffect(() => {
    const elements = [...sections.map((section) => section.id), 'contato'].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (!elements.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <div className="min-h-screen bg-ink">
      <PageHeader eyebrow={eyebrow} title={title} lead={updated ? <p>{updated}</p> : undefined} />

      <div className={`${CONTAINER} grid gap-10 py-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16 lg:py-20`}>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Neste documento">
            <div className="rounded-[22px] border border-white/10 bg-ink-raised lg:border-0 lg:bg-transparent">
              <button
                type="button"
                onClick={() => setTocOpen((open) => !open)}
                aria-expanded={tocOpen}
                aria-controls="indice-lista"
                className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-white lg:hidden"
              >
                Neste documento
                <ChevronDown aria-hidden="true" size={16} className={`text-neutral-500 transition-transform ${tocOpen ? 'rotate-180' : ''}`} />
              </button>
              <p className="mb-3 hidden text-sm font-semibold text-white lg:block">Neste documento</p>
              <ol id="indice-lista" className={`space-y-1 px-3 pb-3 lg:block lg:px-0 lg:pb-0 ${tocOpen ? 'block' : 'hidden'}`}>
                {entries.map((section) => {
                  const on = section.id === active
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setTocOpen(false)}
                        aria-current={on ? 'true' : undefined}
                        className={`block rounded-full px-4 py-2 text-sm transition-colors ${
                          on ? 'bg-white/10 font-medium text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </div>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          {intro && <div className={`${BODY} pb-10`}>{intro}</div>}

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-white/[0.06] py-10">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-white">{section.title}</h2>
              <div className={`mt-4 ${BODY}`}>{section.body}</div>
            </section>
          ))}

          <section id="contato" className={`${CARD} mt-6 scroll-mt-28 p-7`}>
            <h2 className="text-xl font-semibold tracking-tight text-white">{contact.title}</h2>
            <div className={`mt-4 space-y-1.5 ${BODY}`}>{contact.lines}</div>
          </section>

          <Link href="/" className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar para o site
          </Link>
        </article>
      </div>
    </div>
  )
}
