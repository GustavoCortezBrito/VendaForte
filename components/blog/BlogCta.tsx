import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MapPin, MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/components/promo/promo.config'
import { BTN_DARK_LINE, BTN_RED, CONTAINER } from './styles'

const SALES_URL = whatsappUrl('Olá! Vim pelo blog da Venda Forte e quero falar com um consultor.')

interface BlogCtaProps {
  title?: string
  text?: string
  /** Botão principal; por padrão leva à campanha. */
  primary?: { href: string; label: string }
  /** Link do WhatsApp; por padrão a mensagem genérica do blog. */
  whatsappHref?: string
  /** `full` leva a foto das máquinas ao lado; `compact` é só o texto, para dentro dos artigos. */
  variant?: 'full' | 'compact'
}

/**
 * Chamada para a campanha e para o WhatsApp. Cartão escuro, na cor do próprio
 * site de produto, em vez do bloco vermelho que brigava com a página clara.
 */
export default function BlogCta({
  title = 'Quer ver preço e prazo da sua operação?',
  text = 'Veja as condições da campanha ou fale direto com um consultor, em horário comercial.',
  primary = { href: '/promo', label: 'Ver a campanha' },
  whatsappHref = SALES_URL,
  variant = 'full',
}: BlogCtaProps) {
  const full = variant === 'full'

  const buttons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link href={primary.href} className={BTN_RED}>
        {primary.label}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={BTN_DARK_LINE}>
        <MessageCircle className="h-4 w-4 text-green-400" aria-hidden="true" />
        Falar no WhatsApp
      </a>
    </div>
  )

  if (!full) {
    return (
      <aside className="not-prose relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-xl sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/25 blur-3xl" />
        <div className="relative">
          <h2 className="max-w-xl text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-gray-400">{text}</p>
          {buttons}
        </div>
      </aside>
    )
  }

  return (
    <section className="bg-white pb-16 pt-14 lg:pb-24 lg:pt-20" aria-labelledby="blog-cta">
      <div className={CONTAINER}>
        <div className="relative isolate grid overflow-hidden rounded-3xl bg-ink text-white shadow-2xl lg:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:py-16 lg:pl-14 lg:pr-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
              Campanha EP Equipment
            </span>
            <h2
              id="blog-cta"
              className="mt-5 max-w-lg text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
            >
              Quer ver <span className="text-red-500">preço e prazo</span> da sua operação?
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-gray-400">{text}</p>
            {buttons}
            <p className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              Atendimento em Chapecó, Joinville e Itajaí
            </p>
          </div>

          <div className="relative -mt-10 aspect-[16/10] lg:mt-0 lg:aspect-auto lg:min-h-[420px]">
            <Image
              src="/blog/cta-maquinas.webp"
              alt="Empilhadeira patolada DS3 e empilhadeira contrabalançada EFL302 B3 da EP Equipment"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-[100%_60%]"
            />
            {/* Funde a foto com o fundo do cartão, pelo lado do texto */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-transparent lg:bg-gradient-to-r"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
