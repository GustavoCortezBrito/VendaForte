'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Award, Lightbulb, Shield, Zap } from 'lucide-react'
import { Reveal } from '@/components/promo/ui'
import { CONTAINER, EYEBROW, ICON_BADGE, LEAD, SECTION, TITLE } from '@/components/site/styles'

const VALUES = [
  { icon: Award, title: 'Qualidade', description: 'Equipamentos e peças certificadas' },
  { icon: Lightbulb, title: 'Inovação', description: 'Tecnologia de ponta em equipamentos' },
  { icon: Shield, title: 'Segurança', description: 'Conformidade com normas NR-11' },
  { icon: Zap, title: 'Agilidade', description: 'Atendimento rápido e eficiente' },
]

/** Sobre, em resumo: a história completa fica na página /sobre. */
export default function About() {
  return (
    <section id="about" className={SECTION}>
      <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
        <Reveal className="lg:col-span-6">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10">
            <Image
              src="/fotos/home/sobre-fabrica.webp"
              alt="Vista de cima de uma linha de montagem de empilhadeiras e paleteiras, em um galpão industrial"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6 pt-12 text-sm font-medium text-white">
              Linha de montagem de empilhadeiras.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-6">
          <p className={EYEBROW}>Sobre nós</p>
          <h2 className={`mt-4 ${TITLE} text-white`}>Dealer autorizado EP Equipment</h2>
          <p className={`mt-5 ${LEAD}`}>
            Desde 2014 no mercado de empilhadeiras e, desde 2021, Distribuidor Autorizado EP Equipment para Santa Catarina,
            com matriz em Chapecó e filial em Joinville.
          </p>

          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {VALUES.map((value) => (
              <li key={value.title} className="flex gap-4">
                <span className={ICON_BADGE}>
                  <value.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-white">{value.title}</span>
                  <span className="mt-0.5 block text-sm text-neutral-400">{value.description}</span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/sobre"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-red-400"
          >
            Conheça nossa história completa
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
