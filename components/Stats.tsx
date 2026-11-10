'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/components/promo/ui'
import { CONTAINER } from '@/components/site/styles'

const STATS = [
  { value: 1000, suffix: '+', label: 'Equipamentos entregues' },
  { value: 500, suffix: '+', label: 'Clientes atendidos' },
  { value: 5000, suffix: '+', label: 'Manutenções realizadas' },
  { value: 98, suffix: '%', label: 'Satisfação dos clientes' },
]

const format = (value: number, suffix: string) => `${Math.round(value).toLocaleString('pt-BR')}${suffix}`

/**
 * Conta de zero até o número quando entra na tela. O HTML já traz o número final (busca, sem
 * JavaScript, movimento reduzido); a contagem escreve direto no texto, sem renderizar de novo.
 */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  // Fora da tela, zera antes que alguém veja; a contagem começa quando a seção aparece
  useEffect(() => {
    if (reduced || !ref.current) return
    ref.current.textContent = format(0, suffix)
  }, [reduced, suffix])

  useEffect(() => {
    if (!inView || reduced) return
    const node = ref.current
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        if (node) node.textContent = format(latest, suffix)
      },
    })
    return () => controls.stop()
  }, [inView, reduced, value, suffix])

  return (
    <span ref={ref} className="tabular-nums">
      {format(value, suffix)}
    </span>
  )
}

/** Faixa de números logo abaixo da abertura: só os números, sem título nem texto. */
export default function Stats() {
  return (
    <section aria-label="Nossos números" className="border-y border-white/[0.06] bg-ink">
      <div className={CONTAINER}>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col py-8 lg:py-10 ${index % 2 === 1 ? 'border-l border-white/10 pl-6 lg:pl-8' : ''} ${
                index >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''
              } ${index === 2 ? 'lg:border-l lg:pl-8' : ''}`}
            >
              <dt className="order-2 mt-1 text-sm text-neutral-400">{stat.label}</dt>
              <dd className="text-4xl font-bold tracking-[-0.045em] text-white lg:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
