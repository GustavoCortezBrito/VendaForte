'use client'

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Target } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-red-900 to-gray-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-600 opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-800 opacity-10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Soluções em
              <span className="block text-red-500">Empilhadeiras</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-100 mb-8 leading-relaxed"
            >
              Importação e distribuição de máquinas e equipamentos industriais para movimentação de cargas. Atuamos em todo o Sul do Brasil com foco na eficiência da sua operação.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg"
              >
                Solicite um Orçamento
                <ArrowRight className="ml-2" size={20} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all"
              >
                Nossos Produtos
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">1000+</div>
                <div className="text-sm text-gray-200">Equipamentos Vendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">24h</div>
                <div className="text-sm text-gray-200">Assistência Técnica</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">20+</div>
                <div className="text-sm text-gray-200">Anos de Experiência</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Company Building Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:block"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Background */}
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-3xl -rotate-6 blur-xl"
              />
              
              {/* Image Container */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="aspect-[4/5]">
                  {/* Building Image */}
                  <img 
                    src="/sede.png" 
                    alt="Sede Grupo Venda Forte" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback com ilustração se imagem não existir
                      const parent = e.currentTarget.parentElement!
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-gray-200 to-gray-300">
                          <div class="text-center">
                            <div class="text-6xl mb-4">🏢</div>
                            <p class="text-gray-600 font-semibold">Sede Grupo Venda Forte</p>
                            <p class="text-gray-500 text-sm mt-2">Chapecó - SC</p>
                          </div>
                        </div>
                      `
                    }}
                  />
                </div>
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Nossa Sede</p>
                      <p className="text-2xl font-bold text-red-600">Chapecó - SC</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">Cobertura</p>
                      <p className="text-2xl font-bold text-red-600">Sul do Brasil</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
