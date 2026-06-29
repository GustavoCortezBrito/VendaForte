'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Truck, Wrench, Package, Clock, Zap, Fuel } from 'lucide-react'

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const products = [
    {
      icon: <Zap size={40} />,
      title: 'Empilhadeiras Elétricas',
      description: 'Ideais para ambientes fechados e operações que exigem zero emissões. Silenciosas, eficientes e econômicas.',
      features: ['Capacidade 1.5 a 3.5 ton', 'Zero emissões', 'Baixo custo operacional', 'Operação silenciosa'],
      badge: 'Mais Vendido'
    },
    {
      icon: <Fuel size={40} />,
      title: 'Empilhadeiras a Gás (GLP)',
      description: 'Potência e versatilidade para operações internas e externas. Reabastecimento rápido e alta produtividade.',
      features: ['Capacidade 1.5 a 5.0 ton', 'Uso interno/externo', 'Reabastecimento rápido', 'Alto desempenho'],
      badge: null
    },
    {
      icon: <Truck size={40} />,
      title: 'Empilhadeiras a Diesel',
      description: 'Máxima potência para trabalhos pesados e ambientes externos. Robustas e preparadas para uso intensivo.',
      features: ['Capacidade 2.5 a 10 ton', 'Uso externo intensivo', 'Alta durabilidade', 'Trabalhos pesados'],
      badge: null
    },
    {
      icon: <Package size={40} />,
      title: 'Peças e Acessórios',
      description: 'Estoque completo de peças originais multimarcas. Garantia de qualidade e compatibilidade total.',
      features: ['Peças originais', 'Todas as marcas', 'Pronta entrega', 'Garantia de fábrica'],
      badge: 'Estoque Completo'
    },
    {
      icon: <Wrench size={40} />,
      title: 'Manutenção Especializada',
      description: 'Assistência técnica qualificada para todas as marcas. Manutenção preventiva e corretiva com equipe certificada.',
      features: ['Manutenção preventiva', 'Manutenção corretiva', 'Multimarcas', 'Equipe certificada'],
      badge: null
    },
    {
      icon: <Clock size={40} />,
      title: 'Locação de Equipamentos',
      description: 'Aluguel flexível de empilhadeiras para períodos curtos ou longos. Manutenção incluída no contrato.',
      features: ['Diária, mensal ou anual', 'Manutenção inclusa', 'Sem investimento inicial', 'Equipamentos novos'],
      badge: null
    }
  ]

  return (
    <section id="services" ref={ref} className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Produtos e Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6 px-4">
            Equipamentos para{' '}
            <span className="text-red-600">Sua Operação</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Importação direta de empilhadeiras e equipamentos industriais com o melhor custo-benefício do mercado
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ 
                delay: 0.1 * index, 
                duration: 0.7,
                type: "spring",
                stiffness: 80
              }}
              whileHover={{ 
                y: -15,
                boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.25)",
                transition: { duration: 0.3 }
              }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden group"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-50 via-transparent to-transparent opacity-0 group-hover:opacity-100"
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
                {product.badge && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.2 * index + 0.3, type: "spring" }}
                    className="absolute top-0 right-0 bg-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold"
                  >
                    {product.badge}
                  </motion.div>
                )}
                
                <motion.div 
                  className="text-red-600 mb-3 sm:mb-4"
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -15, 15, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {product.icon}
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {product.description}
                </p>
                <ul className="space-y-2 mb-4 sm:mb-6">
                  {product.features.map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center text-sm text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.1 * index + 0.1 * idx }}
                    >
                      <motion.div 
                        className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3"
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          delay: idx * 0.2,
                          repeat: Infinity,
                        }}
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full bg-red-600 text-white text-center py-3 rounded-full font-semibold hover:bg-red-700 transition-colors relative overflow-hidden group/button"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Solicitar Orçamento</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-red-100">Equipamentos Certificados</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24h</div>
              <p className="text-red-100">Suporte Técnico Disponível</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6</div>
              <p className="text-red-100">Cidades de Atendimento</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
