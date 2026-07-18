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
      title: 'Empilhadeira Elétrica',
      description: 'Empilhadeira elétrica ideal para ambientes fechados e operações que exigem zero emissões. Silenciosa, eficiente e econômica.',
      features: ['Capacidade 1.5 a 3.5 ton', 'Zero emissões', 'Baixo custo operacional', 'Operação silenciosa'],
      badge: 'Mais Vendido'
    },
    {
      icon: <Fuel size={40} />,
      title: 'Empilhadeira a Gás (GLP)',
      description: 'Potência e versatilidade para operações internas e externas. Reabastecimento rápido e alta produtividade.',
      features: ['Capacidade 1.5 a 5.0 ton', 'Uso interno/externo', 'Reabastecimento rápido', 'Alto desempenho'],
      badge: null
    },
    {
      icon: <Truck size={40} />,
      title: 'Empilhadeira Diesel',
      description: 'Empilhadeira diesel com máxima potência para trabalhos pesados e ambientes externos. Robusta e preparada para uso intensivo.',
      features: ['Capacidade 2.5 a 10 ton', 'Uso externo intensivo', 'Alta durabilidade', 'Trabalhos pesados'],
      badge: null
    },
    {
      icon: <Package size={40} />,
      title: 'Transpaleteira e Paleteira',
      description: 'Transpaleteira elétrica e paleteira manual para movimentação horizontal de paletes. Ideais para depósitos e armazéns.',
      features: ['Transpaleteira elétrica', 'Paleteira manual', 'Capacidade até 3 ton', 'Fácil manuseio'],
      badge: 'Pronta Entrega'
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
      title: 'Empilhadeira Autônoma',
      description: 'Empilhadeira autônoma com tecnologia de ponta. Automação inteligente para operações 24/7 sem necessidade de operador.',
      features: ['Navegação autônoma', 'Tecnologia IA', 'Operação 24/7', 'ROI em 18-24 meses'],
      badge: 'Novidade'
    }
  ]

  return (
    <section id="services" ref={ref} className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 rounded-full">
            Produtos e Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6 px-4 leading-tight">
            Produtos e Serviços para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Sua Operação</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Oferecemos soluções completas em empilhadeiras e equipamentos com importação e distribuição. O Venda Forte oferece o melhor custo-benefício do mercado
          </p>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-10 px-4"
        >
          Nossa Linha de Produtos
        </motion.h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100/50 relative overflow-hidden group backdrop-blur-sm bg-white/80 h-full flex flex-col"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10 flex flex-col h-full">
                {product.badge && (
                  <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.badge}
                  </div>
                )}
                
                <div className="text-red-600 mb-3 sm:mb-4">
                  {product.icon}
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-red-600 transition-colors">
                  {product.title}
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {product.description}
                </p>
                <ul className="space-y-2 mb-4 sm:mb-6 flex-grow">
                  {product.features.map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center text-xs sm:text-sm text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.1 * index + 0.1 * idx }}
                    >
                      <motion.div 
                        className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"
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
                  aria-label={`Solicitar orçamento para ${product.title}`}
                  className="block w-full bg-red-600 text-white text-center py-3 sm:py-3 rounded-full font-semibold hover:bg-red-700 transition-colors relative overflow-hidden group/button text-sm sm:text-base mt-auto"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {index === 0 ? 'Solicitar Orçamento' : 
                     index === 1 ? 'Obter Cotação' :
                     index === 2 ? 'Consultar Preços' :
                     index === 3 ? 'Solicitar Proposta' :
                     index === 4 ? 'Agendar Manutenção' :
                     'Consultar Disponibilidade'}
                  </span>
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
          className="mt-16 bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-3xl p-12 text-white shadow-2xl"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-3">100%</div>
              <p className="text-red-100 text-lg">Equipamentos Certificados</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-3">24h</div>
              <p className="text-red-100 text-lg">Suporte Técnico Disponível</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-3">6</div>
              <p className="text-red-100 text-lg">Cidades de Atendimento</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
