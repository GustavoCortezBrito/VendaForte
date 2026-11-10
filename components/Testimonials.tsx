'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { useDragScroll } from '@/components/useDragScroll'
import { Reveal } from '@/components/promo/ui'
import { CARD, CONTAINER, EYEBROW, SECTION, TITLE } from '@/components/site/styles'

const TESTIMONIALS = [
  { name: 'Gabriela Berger', reviews: '5 avaliações', text: 'Ambiente amplo, bom atendimento dos funcionários, prestativos. Obtive resposta rápida do orçamento! Produto de qualidade, recomendo!' },
  { name: 'Willian APEX', reviews: '4 avaliações', text: 'Atendimento muito bom! Buscaram entender a demanda para disponibilizar o equipamento com as características ideias para nossa operação.' },
  { name: 'Luan Casarotto', reviews: '7 avaliações', text: 'Vendedor Michael Felipe Vieira extremamente atencioso, atendimento 10, super recomendo.' },
  { name: 'Alex Barcarol', reviews: '2 avaliações', text: 'Empresa superou minhas expectativas. Ótimo atendimento, preços e condições. Recomendo para todos que precisam de empilhadeiras de qualidade.' },
  { name: 'Caetano Lamp', reviews: '1 avaliação', text: 'Excelente atendimento, ótimos preços e máquinas de qualidade parabéns' },
  { name: 'Alexandre Cesar Machado', reviews: '5 avaliações', text: 'Atendimento sensacional! Prestativo e produto de qualidade.' },
  { name: 'Anderson Marques', reviews: 'Local Guide · 6 avaliações', text: 'Excelente atendimento do Michael, empresa muito boa! Recomendo!' },
  { name: 'Adriano Ludwig', reviews: '2 avaliações', text: 'Atendimento diferenciado e ótima qualidade dos equipamentos' },
  { name: 'Maria Caneppele', reviews: '1 avaliação', text: 'Ótimo atendimento!! Recomendo' },
  { name: 'Sara Rohde', reviews: '2 avaliações', text: 'Agilidade no atendimento e máquinas de qualidade.' },
  { name: 'Derlei Vieira', reviews: '4 avaliações', text: 'Excelente atendimento' },
]

const CLIENTS = [
  { name: 'Adami', url: '/images/clients/adami-new.svg' },
  { name: 'BRF', url: '/images/clients/brf.png' },
  { name: 'Copacol', url: '/images/clients/copacol.png' },
  { name: 'GT Foods', url: '/images/clients/gtfoods.png' },
  { name: 'JBS', url: '/images/clients/jbs.png' },
  { name: 'Muffato', url: '/images/clients/muffato.png' },
  { name: 'Randon', url: '/images/clients/randon.png' },
  { name: 'Seara', url: '/images/clients/seara.png' },
]

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

function Stars({ size = 'h-4 w-4' }: { size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label="5 de 5 estrelas" role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${size} fill-amber-400 text-amber-400`} aria-hidden="true" />
      ))}
    </span>
  )
}

/**
 * Avaliações numa fileira que rola na horizontal: três à vista, as outras com as setas ou o dedo.
 * Assim a seção não cresce para baixo a cada avaliação nova.
 */
export default function Testimonials() {
  const { ref, dragging, handlers } = useDragScroll<HTMLUListElement>()
  const [edge, setEdge] = useState({ start: true, end: false })

  const updateEdges = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [ref])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      observer.disconnect()
    }
  }, [ref, updateEdges])

  const scrollBy = (direction: 1 | -1) => {
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' })
  }

  const arrow =
    'grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <section id="testimonials" className={SECTION}>
      <div className={CONTAINER}>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={EYEBROW}>Avaliações</p>
            <h2 className={`mt-4 ${TITLE} text-white`}>O que dizem sobre a Venda Forte</h2>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-3xl font-bold tracking-[-0.045em] text-white">5,0</span>
              <Stars />
              <span className="text-sm text-neutral-400">17 avaliações no Google</span>
              <a
                href="https://maps.app.goo.gl/JU9AaTSb7JFw1qJ68"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-white transition-colors hover:text-red-400"
              >
                Ver no Google
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Avaliações anteriores" disabled={edge.start} onClick={() => scrollBy(-1)} className={arrow}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Próximas avaliações" disabled={edge.end} onClick={() => scrollBy(1)} className={arrow}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </Reveal>

        <ul
          ref={ref}
          {...handlers}
          aria-label="Avaliações de clientes"
          tabIndex={0}
          className={`-mx-6 mt-10 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden ${
            dragging ? 'cursor-grabbing select-none snap-none' : 'snap-x snap-mandatory scroll-px-6 sm:cursor-grab lg:scroll-px-0'
          }`}
        >
          {TESTIMONIALS.map((review) => (
            <li key={review.name} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]">
              <figure className={`flex h-full flex-col ${CARD} p-7`}>
                <Stars />
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-neutral-300">“{review.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                    {initials(review.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{review.name}</span>
                    <span className="block text-xs text-ink-muted">{review.reviews}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Logos em cartões brancos: a maioria é colorida em fundo branco, e a da Adami é preta */}
        <Reveal className="mt-16 border-t border-white/10 pt-12">
          <p className="text-sm font-semibold text-neutral-400">Empresas que confiam em nós</p>
          <ul className="mt-6 grid grid-cols-4 gap-3 lg:grid-cols-8">
            {CLIENTS.map((client) => (
              <li key={client.name} className="flex h-20 items-center justify-center rounded-2xl bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.url} alt={`Logo ${client.name}`} width={160} height={80} loading="lazy" className="max-h-full w-auto object-contain" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
