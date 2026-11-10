'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { whatsappUrl } from '@/components/promo/promo.config'
import { EASE_OUT, Reveal, Shot, WhatsAppLink } from '@/components/promo/ui'
import { BTN_GHOST, CHIP_OFF, CHIP_ON, CONTAINER, EYEBROW, LEAD, SECTION, TITLE } from '@/components/site/styles'

/**
 * Destaques do mês, no formato da campanha: abas em pílula, a máquina sobre o fundo ink e a
 * ficha em tabela de linhas finas. As fotos são as mesmas da /promo.
 */

interface HighlightItem {
  id: string
  slug: string
  tab: string
  title: string
  subtitle: string
  description: string
  specs: { label: string; value: string }[]
  media: { kind: 'shot' } | { kind: 'cutout' | 'photo'; src: string; alt: string }
}

const HIGHLIGHT_ITEMS: HighlightItem[] = [
  {
    id: 'efl302b3',
    slug: 'efl302b3',
    tab: 'EFL302 B3 · 3.000 kg',
    title: 'Empilhadeira Elétrica EFL302B3',
    subtitle: 'Contrabalançada 4 Rodas Li-Ion 80V',
    description:
      'A empilhadeira contrabalançada EP EFL302B3 é projetada para entregar alta performance, máxima ergonomia e eficiência operacional com tecnologia de bateria Íon-Lítio 80V.',
    specs: [
      { label: 'Capacidade', value: '3.000 kg' },
      { label: 'Elevação', value: '6.000 mm (6,0 m)' },
      { label: 'Bateria', value: '80V Li-Ion' },
      { label: 'Recarga', value: '2 a 2,5 horas' },
      { label: 'Raio de giro', value: '2.437 mm' },
    ],
    media: { kind: 'cutout', src: '/promo/EFL302B3/recorte/2.webp', alt: 'EP EFL302 B3 em três quartos pela frente' },
  },
  {
    id: 'ds3',
    slug: 'ds3',
    tab: 'DS3 · 1.500 kg',
    title: 'Empilhadeira Patolada DS3',
    subtitle: 'Stacker Elétrico Li-Ion',
    description:
      'Stacker elétrico compacto para estocagem vertical em corredores estreitos. Ideal para armazéns que necessitam de elevação com investimento acessível.',
    specs: [
      { label: 'Capacidade', value: '1.500 kg' },
      { label: 'Elevação', value: '3.900 mm (3,9 m)' },
      { label: 'Bateria', value: '24V Li-Ion' },
      { label: 'Recarga', value: '3 a 4 horas' },
      { label: 'Raio de giro', value: '1.380 mm' },
    ],
    media: { kind: 'shot' },
  },
  {
    id: 'f4',
    slug: 'f4',
    tab: 'F4 · 1.500 kg',
    title: 'Paleteira Elétrica F4',
    subtitle: 'Paleteira Compacta Li-Ion',
    description:
      'A paleteira elétrica mais vendida da EP Equipment. Compacta, ergonômica e ideal para movimentação ágil em armazéns e centros de distribuição.',
    specs: [
      { label: 'Capacidade', value: '1.500 kg' },
      { label: 'Elevação', value: '200 mm' },
      { label: 'Bateria', value: '24V Li-Ion' },
      { label: 'Recarga', value: '2 a 3 horas' },
      { label: 'Raio de giro', value: '1.370 mm' },
    ],
    media: { kind: 'photo', src: '/promo/F4/1.webp', alt: 'EP F4 em três quartos no corredor do armazém' },
  },
]

function Media({ item }: { item: HighlightItem }) {
  if (item.media.kind === 'shot') {
    return <Shot shot="tresQuartos" className="aspect-square w-full" sizes="(max-width: 1024px) 100vw, 48vw" parallax={24} />
  }
  if (item.media.kind === 'photo') {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-white/10">
        <Image src={item.media.src} alt={item.media.alt} fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
      </div>
    )
  }
  return (
    <div className="relative aspect-square w-full">
      <div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.16), transparent 68%)' }}
      />
      <Image src={item.media.src} alt={item.media.alt} fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain p-6" />
    </div>
  )
}

export default function MonthlyHighlight() {
  const [selectedId, setSelectedId] = useState('efl302b3')
  const item = HIGHLIGHT_ITEMS.find((entry) => entry.id === selectedId) ?? HIGHLIGHT_ITEMS[0]
  const quoteUrl = whatsappUrl(
    `Olá! Vi o destaque no site da Venda Forte (${item.title}) e gostaria de receber a proposta comercial com as condições especiais.`
  )

  return (
    <section id="destaques" className={SECTION}>
      <div className={CONTAINER}>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className={EYEBROW}>Destaque do mês</p>
            <h2 className={`mt-4 ${TITLE} text-white`}>Equipamentos em destaque</h2>
            <p className={`mt-5 max-w-2xl ${LEAD}`}>Modelos mais procurados com bateria de íon-lítio e pronta entrega.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Equipamentos em destaque">
            {HIGHLIGHT_ITEMS.map((entry) => {
              const active = entry.id === selectedId
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="destaque-painel"
                  onClick={() => setSelectedId(entry.id)}
                  className={active ? CHIP_ON : CHIP_OFF}
                >
                  {entry.tab}
                </button>
              )
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            id="destaque-painel"
            role="tabpanel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mt-12 grid items-center gap-10 lg:grid-cols-12 lg:gap-12"
          >
            <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <Media item={item} />
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-red-500">{item.subtitle}</p>
              <h3 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-white lg:text-4xl">{item.title}</h3>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-400">{item.description}</p>

              <table className="mt-8 w-full border-y border-white/10 text-left">
                <caption className="sr-only">Especificações da {item.title}</caption>
                <tbody className="divide-y divide-white/10">
                  {item.specs.slice(0, 3).map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="py-3.5 pr-6 font-normal text-neutral-400">
                        {row.label}
                      </th>
                      <td className="py-3.5 text-right text-lg font-semibold tracking-tight text-white">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <WhatsAppLink href={quoteUrl}>Garantir condição no WhatsApp</WhatsAppLink>
                <Link
                  href={`/produtos/${item.slug}`}
                  aria-label={`Ver especificações e ficha técnica completa da ${item.title}`}
                  className={BTN_GHOST}
                >
                  Ficha técnica
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
