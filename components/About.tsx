'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, Lightbulb, Shield, Zap } from 'lucide-react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const values = [
    {
      icon: <Award size={40} />,
      title: 'Qualidade',
      description: 'Equipamentos e peças certificadas'
    },
    {
      icon: <Lightbulb size={40} />,
      title: 'Inovação',
      description: 'Tecnologia de ponta em equipamentos'
    },
    {
      icon: <Shield size={40} />,
      title: 'Segurança',
      description: 'Conformidade com normas NR-11'
    },
    {
      icon: <Zap size={40} />,
      title: 'Agilidade',
      description: 'Atendimento rápido e eficiente'
    }
  ]

  return (
    <section id="about" ref={ref} className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements - Hidden on Mobile */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Sobre Nós
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-3 sm:mb-4 md:mb-6 px-4 leading-tight">
            Especialistas em{' '}
            <span className="text-red-600">Movimentação de Cargas</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Mais de 20 anos de experiência trazendo soluções completas para sua operação
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-3 sm:space-y-4 md:space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
            >
              O Grupo Venda Forte é uma empresa de <strong className="text-gray-900">importação e distribuição de máquinas e equipamentos industriais</strong> para movimentação de cargas e peças de empilhadeiras multimarcas.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
            >
              Atuamos em todo o Sul do Brasil, com matriz em Chapecó-SC e parceiros em Itajaí, Joinville, Maringá, Seberi e Esteio.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-l-4 border-red-600"
            >
              <p className="text-xs sm:text-sm md:text-base text-gray-800 italic leading-relaxed">
                <span className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl">"</span>
                Em nosso DNA está a constante busca para solucionar toda e qualquer operação de movimentação de cargas.
                <span className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl">"</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 font-semibold">
                — Rodrigo Schilke, CEO
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Values Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                transition={{ 
                  delay: 0.2 + (0.15 * index), 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -10,
                  rotate: [0, -2, 2, 0],
                  transition: { duration: 0.3 }
                }}
                className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all cursor-pointer border border-gray-100 group relative overflow-hidden"
              >
                {/* Animated Background Gradient - Hidden on Mobile */}
                <motion.div
                  className="hidden md:block absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                />
                
                <div className="relative z-10">
                  <div className="text-red-600 mb-3 sm:mb-4 md:mb-5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Decorative Corner Element - Hidden on Mobile */}
                <div className="hidden md:block absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
