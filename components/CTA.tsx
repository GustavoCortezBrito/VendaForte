'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const benefits = [
    'Orçamento personalizado e gratuito',
    'Equipamentos novos e seminovos',
    'Assistência técnica especializada',
    'Entrega em toda Santa Catarina'
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Precisa de Equipamentos para sua Operação?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-100 mb-8"
            >
              Solicite um orçamento sem compromisso e descubra as melhores soluções para movimentação de cargas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + (0.1 * index) }}
                  className="flex items-center text-white"
                >
                  <CheckCircle className="text-yellow-400 mr-3 flex-shrink-0" size={24} />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <div className="text-2xl font-bold text-gray-900 mb-6">
              Solicite um Orçamento
            </div>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600 focus:outline-none transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600 focus:outline-none transition-all"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Seu telefone"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600 focus:outline-none transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Nome da sua empresa"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600 focus:outline-none transition-all"
                />
              </div>
              <div>
                <textarea
                  placeholder="Que tipo de equipamento você precisa?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600 focus:outline-none transition-all resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg"
              >
                Solicitar Orçamento Gratuito
                <ArrowRight className="ml-2" size={20} />
              </motion.button>
            </form>
            <p className="text-sm text-gray-500 text-center mt-4">
              Resposta em até 24 horas • Orçamento sem compromisso
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
