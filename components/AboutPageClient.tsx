import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Building2, Factory, Lightbulb, Mail, MessageCircle, Shield, Zap } from 'lucide-react'
import { CONTATO, WHATSAPP_DISPLAY, whatsappUrl } from '@/components/promo/promo.config'
import { Reveal } from '@/components/promo/ui'
import {
  BTN_GHOST,
  BTN_PRIMARY,
  BTN_WHATSAPP,
  CARD,
  CONTAINER,
  EYEBROW,
  ICON_BADGE,
  LEAD,
  SECTION,
  TAG,
  TITLE,
} from '@/components/site/styles'

const VALUES = [
  { icon: Award, title: 'Qualidade garantida', description: 'Equipamentos certificados EP Equipment com garantia de fábrica e peças originais' },
  { icon: Lightbulb, title: 'Inovação constante', description: 'Tecnologia Íon-Lítio de última geração e equipamentos autônomos (AGV/AMR)' },
  { icon: Shield, title: 'Segurança total', description: 'Conformidade rigorosa com normas NR-11 e treinamento de operadores' },
  { icon: Zap, title: 'Agilidade', description: 'Atendimento rápido em SC, PR, RS e SP com equipe especializada' },
]

const UNITS = [
  {
    icon: Building2,
    name: 'Chapecó',
    kind: 'Matriz',
    text: 'Sede principal com showroom completo EP Equipment, oficina técnica certificada e amplo estoque de peças multimarcas',
    services: ['Venda', 'Aluguel', 'Assistência técnica', 'Peças', 'Showroom'],
  },
  {
    icon: Factory,
    name: 'Joinville',
    kind: 'Filial',
    text: 'Filial estratégica com equipe técnica especializada para atendimento rápido no norte de SC e regiões Sul/Sudeste',
    services: ['Venda', 'Aluguel', 'Assistência técnica', 'Peças'],
  },
]

const STATS = [
  { value: '2014', label: 'Fundação' },
  { value: '2021', label: 'Distribuidor EP' },
  { value: '4', label: 'Estados atendidos' },
]

export default function AboutPageClient() {
  return (
    <main className="bg-ink">
      {/* Abertura: texto à esquerda, a sede à direita */}
      <section className="relative overflow-hidden bg-ink pb-24 pt-36 lg:pb-32 lg:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.14), transparent 65%)' }}
        />
        <div className={`relative ${CONTAINER} grid items-center gap-14 lg:grid-cols-12 lg:gap-10`}>
          <Reveal className="lg:col-span-6">
            <p className={EYEBROW}>Grupo Venda Forte</p>
            <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Nossa história e a nossa missão
            </h1>
            <p className={`mt-6 max-w-xl ${LEAD}`}>
              Desde 2014 no mercado de equipamentos para movimentação de cargas. Em 2021, tornamo-nos{' '}
              <strong className="font-semibold text-white">Distribuidor Autorizado EP Equipment</strong> para Santa Catarina,
              com bases em Chapecó e Joinville, atendendo todo o Sul do Brasil e São Paulo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact" className={BTN_PRIMARY}>
                Fale conosco
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/produtos" className={BTN_GHOST}>
                Ver catálogo
              </Link>
            </div>
            <dl className="mt-12 flex gap-10 border-t border-white/10 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 mt-1 text-sm text-ink-muted">{stat.label}</dt>
                  <dd className="text-4xl font-bold tracking-[-0.045em] text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10">
              <Image
                src="/fotos/home/fachada.webp"
                alt="Fachada da matriz do Grupo Venda Forte em Chapecó, com a marca EP Equipment"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6 pt-14 text-sm font-medium text-white">
                Matriz em Chapecó, Santa Catarina.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Trajetória */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal className="max-w-3xl">
            <p className={EYEBROW}>Nossa trajetória</p>
            <h2 className={`mt-4 ${TITLE} text-white`}>10 anos de experiência</h2>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="space-y-6 lg:col-span-6">
              <p className="text-[15px] leading-relaxed text-neutral-400 lg:text-base">
                O <strong className="font-semibold text-white">Grupo Venda Forte</strong> iniciou suas atividades em{' '}
                <strong className="font-semibold text-white">2014</strong> no ramo de Representação Comercial Corporativa, em
                parceria com a RAC Empilhadeiras de Itajaí-SC, na época autorizada Linde Empilhadeiras do grupo Kion/Still.
              </p>
              <p className="text-[15px] leading-relaxed text-neutral-400 lg:text-base">
                Em <strong className="font-semibold text-white">julho de 2021</strong>, em parceria com a SDO Empilhadeiras de
                Campinas-SP, fechamos o acordo para ser{' '}
                <strong className="font-semibold text-white">Distribuidor Autorizado EP Equipment para Santa Catarina</strong>.
                Hoje, com bases em Chapecó-SC e Joinville-SC, atendemos SC, PR, RS e São Paulo.
              </p>
              <figure className="border-l-2 border-red-500 pl-6">
                <blockquote className="text-xl font-medium leading-snug tracking-tight text-white lg:text-2xl">
                  “Possuímos uma metodologia de vendas inteligente, com foco na estratégia, qualidade no atendimento e na
                  capacitação da equipe. O resultado disso é uma parceria sólida e duradoura com nossos clientes.”
                </blockquote>
                <figcaption className="mt-4 text-sm text-ink-muted">Rodrigo Schilke, CEO</figcaption>
              </figure>
            </Reveal>

            <ul className="grid grid-cols-2 gap-4 lg:col-span-6">
              {VALUES.map((value, index) => (
                <li key={value.title}>
                  <Reveal delay={(index % 2) * 0.06} className={`h-full ${CARD} p-6 sm:p-7`}>
                    <span className={ICON_BADGE}>
                      <value.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">{value.description}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Unidades */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal className="max-w-3xl">
            <p className={EYEBROW}>Nossas unidades</p>
            <h2 className={`mt-4 ${TITLE} text-white`}>Presença em Santa Catarina</h2>
            <p className={`mt-6 max-w-2xl ${LEAD}`}>Bases estratégicas em Chapecó e Joinville, atendendo SC, PR, RS e São Paulo.</p>
          </Reveal>

          <ul className="mt-14 grid gap-4 md:grid-cols-2">
            {UNITS.map((unit, index) => (
              <li key={unit.name}>
                <Reveal delay={index * 0.06} className={`h-full ${CARD} p-8 lg:p-10`}>
                  <div className="flex items-start justify-between">
                    <span className={ICON_BADGE}>
                      <unit.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className={TAG}>{unit.kind}</span>
                  </div>
                  <h3 className="mt-8 text-4xl font-bold tracking-[-0.035em] text-white">{unit.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">Santa Catarina</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-neutral-400">{unit.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {unit.services.map((service) => (
                      <li key={service} className={TAG}>
                        {service}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className={`mt-4 grid gap-8 ${CARD} p-8 lg:grid-cols-2 lg:items-center lg:p-10`}>
            <div>
              <h3 className="text-3xl font-bold tracking-[-0.03em] text-white">Entre em contato</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-400">
                Fale com nossos especialistas em Chapecó ou Joinville.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={whatsappUrl('Olá! Vim pela página Sobre do Grupo Venda Forte e quero falar com um especialista.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={BTN_WHATSAPP}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {WHATSAPP_DISPLAY}
                </a>
                <a href={`mailto:${CONTATO.email}`} className={BTN_GHOST}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {CONTATO.email}
                </a>
              </div>
            </div>
            <dl className="grid grid-cols-2 border-y border-white/10 lg:border-y-0 lg:border-l lg:pl-10">
              <div className="flex flex-col py-6">
                <dt className="order-2 mt-1 text-sm text-ink-muted">Anos de experiência</dt>
                <dd className="text-5xl font-bold tracking-[-0.045em] text-white">10+</dd>
              </div>
              <div className="flex flex-col border-l border-white/10 py-6 pl-6">
                <dt className="order-2 mt-1 text-sm text-ink-muted">Dealer EP Equipment</dt>
                <dd className="text-5xl font-bold tracking-[-0.045em] text-white">Oficial</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
