'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { whatsappUrl } from '@/components/promo/promo.config'
import { EASE_OUT, Reveal, WhatsAppLink } from '@/components/promo/ui'
import { BTN_GHOST, CONTAINER, EYEBROW, SECTION, TITLE } from '@/components/site/styles'

/** Perguntas frequentes no formato da campanha: título fixo à esquerda e o acordeão à direita. */

const FAQS = [
  {
    question: 'Quais tipos de empilhadeiras e equipamentos vocês oferecem?',
    answer: 'Oferecemos uma linha completa: Empilhadeira Elétrica (1.5 a 3.5 ton), Empilhadeira Diesel (2.5 a 10 ton), Empilhadeira a Gás/GLP (1.5 a 5.0 ton), Transpaleteira Elétrica, Paleteira Manual e Empilhadeira Autônoma com tecnologia de navegação inteligente. Todos os equipamentos são importados diretamente e certificados.'
  },
  {
    question: 'Vocês trabalham com locação de equipamentos?',
    answer: 'Sim! Oferecemos locação flexível de empilhadeiras por diária, mensal ou anual. A manutenção está incluída no contrato de locação, garantindo que você tenha equipamentos sempre em perfeito funcionamento sem investimento inicial.'
  },
  {
    question: 'Qual a área de cobertura dos serviços?',
    answer: 'Atuamos em todo o Sul do Brasil, com presença em 6 cidades: Chapecó (matriz), Joinville, Itajaí, Maringá, Seberi e Esteio. Nossa logística garante atendimento rápido e eficiente em toda a região.'
  },
  {
    question: 'Vocês têm peças de reposição disponíveis?',
    answer: 'Sim, mantemos estoque completo de peças originais multimarcas. Trabalhamos com peças certificadas e oferecemos garantia de fábrica. Nossa equipe garante pronta entrega e compatibilidade total com seu equipamento.'
  },
  {
    question: 'Como funciona a assistência técnica?',
    answer: 'Nossa assistência técnica é especializada e atende todas as marcas. Oferecemos manutenção preventiva e corretiva com equipe certificada.'
  },
  {
    question: 'Qual o prazo para entrega de equipamentos?',
    answer: 'O prazo varia de acordo com o modelo e disponibilidade em estoque. Equipamentos em estoque podem ser entregues em até 48 horas. Para importações diretas, o prazo médio é de 45 a 60 dias. Entre em contato para verificar disponibilidade específica.'
  },
  {
    question: 'Vocês oferecem garantia nos equipamentos?',
    answer: 'Sim, todos os equipamentos novos vêm com garantia de fábrica. O período varia de acordo com o fabricante e modelo, geralmente entre 12 e 24 meses. Também oferecemos planos de extensão de garantia e contratos de manutenção.'
  },
  {
    question: 'É possível fazer um test-drive antes de comprar?',
    answer: 'Sim! Recomendamos que você teste o equipamento em sua operação antes de fechar negócio. Podemos disponibilizar uma unidade para teste por período determinado, permitindo que você avalie se o equipamento atende suas necessidades específicas.'
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer: 'Oferecemos diversas opções de pagamento: à vista com desconto, parcelamento facilitado, leasing e consórcio. Nossa equipe comercial está pronta para elaborar a melhor proposta de acordo com suas necessidades e possibilidades.'
  },
  {
    question: 'Vocês oferecem treinamento para operadores?',
    answer: 'Sim, oferecemos treinamento completo para operadores de empilhadeiras, incluindo aspectos de segurança, operação eficiente e manutenção básica. O treinamento pode ser realizado em nossas instalações ou in-company.'
  }
]
const FIRST = 5

// JSON-LD para o Google mostrar as perguntas nos resultados
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

const QUESTION_URL = whatsappUrl('Olá! Tenho uma dúvida sobre empilhadeiras e equipamentos da Venda Forte.')

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(FAQS[0].question)
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? FAQS : FAQS.slice(0, FIRST)

  return (
    <section id="faq" className={SECTION}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <p className={EYEBROW}>Perguntas frequentes</p>
            <h2 className={`mt-4 ${TITLE} text-white`}>Dúvidas comuns</h2>
            <div className="mt-8 max-w-md rounded-[28px] border border-white/10 bg-ink-raised p-7">
              <p className="text-lg font-semibold tracking-tight text-white">Não achou a sua pergunta?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">Fale com um consultor e receba a resposta direto no WhatsApp.</p>
              <WhatsAppLink href={QUESTION_URL} className="mt-6 w-full">
                Perguntar no WhatsApp
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <ul className="space-y-3">
            {visible.map((faq, index) => {
              const isOpen = open === faq.question
              const panelId = `faq-panel-${index}`
              const buttonId = `faq-button-${index}`
              return (
                <motion.li
                  key={faq.question}
                  layout="position"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className={`rounded-3xl border transition-colors duration-300 ${
                    isOpen ? 'border-white/15 bg-ink-raised' : 'border-white/[0.07] hover:border-white/15 hover:bg-white/[0.02]'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => setOpen(isOpen ? null : faq.question)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center gap-5 rounded-3xl px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 sm:px-7 sm:py-6"
                    >
                      <span className="min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-tight text-white">{faq.question}</span>
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                          isOpen ? 'rotate-180 bg-white text-ink' : 'bg-white/[0.06] text-neutral-300'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl px-6 pb-6 text-[15px] leading-relaxed text-neutral-400 sm:px-7 sm:pb-7">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </ul>

          {!showAll && FAQS.length > FIRST && (
            <button type="button" onClick={() => setShowAll(true)} className={`${BTN_GHOST} mt-6 cursor-pointer`}>
              Ver todas as perguntas
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
