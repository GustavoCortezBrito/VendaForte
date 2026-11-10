'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Play, X } from 'lucide-react'
import { EASE_OUT, Reveal } from '@/components/promo/ui'
import { BTN_GHOST, BTN_PRIMARY, CONTAINER, EYEBROW, LEAD, SECTION, TITLE } from '@/components/site/styles'

function YoutubeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

interface Service {
  title: string
  image: string
  imageAlt: string
  description: string
  badge: string
  ctaText: string
  ctaHref?: string
  hasVideoModal?: boolean
}

const SERVICES: Service[] = [
  {
    title: 'Empilhadeiras Elétricas Íon-Lítio',
    image: '/fotos/home/servico-eletrica.webp',
    imageAlt: 'Empilhadeira elétrica EP de lítio em um armazém, com luz de segurança vermelha no chão',
    description: 'Linha completa de empilhadeiras elétricas com baterias Íon-Lítio 80V/48V.',
    badge: 'Mais vendido EP',
    ctaText: 'Ver linha elétrica',
    ctaHref: '/produtos',
  },
  {
    title: 'Equipamentos Autônomos (AGVs/AMRs)',
    image: '/fotos/home/servico-autonomos.webp',
    imageAlt: 'Robô móvel autônomo EP transportando caixas dentro de uma fábrica',
    description: 'Robôs e empilhadeiras autônomas para movimentação industrial 24/7.',
    badge: 'Automação EP',
    ctaText: 'Ver canal EP no YouTube',
    hasVideoModal: true,
  },
  {
    title: 'Locação de Empilhadeiras & Frotas',
    image: '/fotos/home/servico-locacao.webp',
    imageAlt: 'Paleteira elétrica EP com operador movimentando pallets no armazém',
    description: 'Locação por dia, mês ou contratos de longo prazo com frota nova e renovada.',
    badge: 'Frota própria',
    ctaText: 'Solicitar orçamento de locação',
    ctaHref: '/#contact',
  },
  {
    title: 'Assistência Técnica & Manutenção',
    image: '/fotos/home/servico-assistencia.webp',
    imageAlt: 'Manutenção no compartimento de uma empilhadeira retrátil EP',
    description: 'Equipe de técnicos altamente qualificados e oficinas móveis preparadas para atendimentos preventivos e corretivos urgentes.',
    badge: 'Multimarca',
    ctaText: 'Falar com a assistência técnica',
    ctaHref: '/#contact',
  },
  {
    title: 'Peças Originais EP Equipment',
    image: '/fotos/home/servico-pecas.webp',
    imageAlt: 'Módulo de bateria de lítio EP no compartimento de uma paleteira',
    description: 'Garantia de operação contínua com estoque completo de peças originais, carregadores, baterias de lítio e componentes de reposição.',
    badge: 'Peças de fábrica',
    ctaText: 'Cotar peças originais',
    ctaHref: '/#contact',
  },
  {
    title: 'Empilhadeiras a Diesel & GLP',
    image: '/fotos/home/servico-diesel.webp',
    imageAlt: 'Empilhadeira EP a combustão, para diesel e GLP',
    description: 'Empilhadeiras à combustão preparadas para trabalhos pesados em ambientes externos, terrenos irregulares e operações contínuas.',
    badge: 'Uso intensivo',
    ctaText: 'Solicitar cotação diesel e GLP',
    ctaHref: '/#contact',
  },
]

const CARD_CLASS =
  'group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised text-left transition-colors duration-500 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60'

function CardBody({ service, icon }: { service: Service; icon: ReactNode }) {
  return (
    <>
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-[22px]">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {service.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-4">
        <h3 className="text-xl font-semibold tracking-tight text-white">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">{service.description}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-white">
          {icon}
          {service.ctaText}
        </span>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="absolute right-6 top-6 h-5 w-5 text-white/70 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
      />
    </>
  )
}

export default function Services() {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  // Janela de vídeo: o foco entra nela, Tab não escapa para a página e, ao fechar, volta para o cartão
  useEffect(() => {
    if (!showVideoModal) return
    const opener = openerRef.current
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return setShowVideoModal(false)
      if (event.key !== 'Tab') return
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [showVideoModal])

  return (
    <section id="services" className={SECTION}>
      <div className={CONTAINER}>
        <Reveal className="max-w-3xl">
          <p className={EYEBROW}>Soluções</p>
          <h2 className={`mt-4 ${TITLE} text-white`}>Nossas soluções em empilhadeiras</h2>
          <p className={`mt-5 max-w-2xl ${LEAD}`}>Venda, locação, assistência técnica, peças originais e automação, num só fornecedor.</p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <li key={service.title}>
              <Reveal delay={(index % 3) * 0.06} className="h-full">
                {service.hasVideoModal ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      openerRef.current = event.currentTarget
                      setShowVideoModal(true)
                    }}
                    className={CARD_CLASS}
                  >
                    <CardBody service={service} icon={<Play className="h-4 w-4 fill-current" aria-hidden="true" />} />
                  </button>
                ) : (
                  <Link href={service.ctaHref ?? '/'} aria-label={`${service.ctaText} - ${service.title}`} className={CARD_CLASS}>
                    <CardBody service={service} icon={null} />
                  </Link>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideoModal(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center overscroll-contain bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="youtube-titulo"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-ink-raised p-8"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setShowVideoModal(false)}
                aria-label="Fechar"
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-neutral-300 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <YoutubeIcon className="h-5 w-5" />
              </span>
              <p id="youtube-titulo" className="mt-6 text-2xl font-semibold tracking-tight text-white">
                Canais no YouTube
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Conheça o canal da Venda Forte e veja demonstrações da linha completa EP Equipment.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a href="https://www.youtube.com/@grupovendaforte7665" target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                  <YoutubeIcon className="h-4 w-4" />
                  Canal Grupo Venda Forte
                </a>
                <a href="https://www.youtube.com/@EPEquipment" target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                  <YoutubeIcon className="h-4 w-4" />
                  Canal EP Equipment (fabricante)
                </a>
                <Link href="/#contact" onClick={() => setShowVideoModal(false)} className={BTN_GHOST}>
                  Solicitar cotação
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
