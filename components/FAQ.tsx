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

  // JSON-LD Schema para FAQ aparecer no Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      {/* JSON-LD Schema para Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section id="faq" ref={ref} className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="inline-block text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-red-50 rounded-full">
            Perguntas Frequentes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6 px-4 leading-tight">
            Dúvidas <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Comuns</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
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
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-red-200 transition-all shadow-sm md:shadow-md hover:shadow-lg md:hover:shadow-xl relative"
            >
              {/* Animated Border on Hover - Hidden on Mobile */}
              <div className="hidden md:block absolute inset-0 border-2 border-red-500 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="relative z-10 w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-6 sm:pr-8 text-sm sm:text-base leading-tight">
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
                  className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 text-gray-600 leading-relaxed text-sm sm:text-base"
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
          className="mt-12 sm:mt-14 md:mt-16 bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white text-center shadow-2xl"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Ainda tem dúvidas?</div>
          <p className="mb-6 sm:mb-8 text-red-100 text-sm sm:text-base md:text-lg leading-relaxed">
            Nossa equipe está pronta para ajudar você com qualquer questão
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-red-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all text-base sm:text-lg"
          >
            Fale com Especialista
          </a>
        </motion.div>
      </div>
    </section>
    </>
  )
}
