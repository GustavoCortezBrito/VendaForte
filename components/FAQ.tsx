'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, Plus, Minus } from 'lucide-react'

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [showAll, setShowAll] = useState(false)

  const faqs = [
    {
      question: 'Quais tipos de empilhadeiras vocês oferecem?',
      answer: 'Oferecemos três tipos principais de empilhadeiras: Elétricas (1.5 a 3.5 ton), ideais para ambientes fechados; a Gás/GLP (1.5 a 5.0 ton), versáteis para uso interno e externo; e Diesel (2.5 a 10 ton), robustas para trabalhos pesados em ambientes externos.'
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
      answer: 'Nossa assistência técnica é especializada e atende todas as marcas. Oferecemos manutenção preventiva e corretiva com equipe certificada. O suporte técnico está disponível 24 horas para emergências, garantindo o mínimo de tempo de parada em sua operação.'
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

  const visibleFAQs = showAll ? faqs : faqs.slice(0, 6)

  return (
    <section id="faq" ref={ref} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
            Perguntas Frequentes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Dúvidas <span className="text-red-600">Comuns</span>
          </h2>
          <p className="text-xl text-gray-600">
            Encontre respostas para as perguntas mais frequentes sobre nossos produtos e serviços
          </p>
        </motion.div>

        <div className="space-y-4">
          {visibleFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, x: -50 }}
              animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ 
                delay: 0.05 * index, 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 transition-colors relative"
            >
              {/* Animated Border on Hover */}
              <motion.div
                className="absolute inset-0 border-2 border-red-500 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />

              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="relative z-10 w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className="flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {openIndex === index ? (
                      <Minus size={20} className="text-red-600" />
                    ) : (
                      <Plus size={20} className="text-gray-400" />
                    )}
                  </motion.div>
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div 
                  className="px-6 pb-5 text-gray-600 leading-relaxed"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {!showAll && faqs.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <motion.button
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-all shadow-md"
            >
              Ver Mais Perguntas
              <ChevronDown size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">Ainda tem dúvidas?</h3>
          <p className="mb-6 text-red-100">
            Nossa equipe está pronta para ajudar você com qualquer questão
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Fale com Especialista
          </a>
        </motion.div>
      </div>
    </section>
  )
}
