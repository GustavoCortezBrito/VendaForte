'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    delay: number
    duration: number
  }>>([])

  // Gera partículas apenas no cliente para evitar hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 20 + Math.random() * 15,
      }))
    )
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/sede.png)' }}
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Particles Background - Hidden on Mobile */}
      {particles.length > 0 && (
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(particle.id) * 15, 0],
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Background Elements - Simplified on Mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-red-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-red-800 rounded-full blur-3xl"
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 mt-16 sm:mt-20 md:mt-0"
          >
            <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-red-400 mb-2">Grupo Venda Forte</span>
            Soluções Completas em
            <span className="block text-red-500 mt-1 sm:mt-2">Empilhadeiras e Equipamentos</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-2"
          >
            O Grupo Venda Forte oferece soluções completas em empilhadeiras e equipamentos industriais. Importação e distribuição de máquinas para movimentação de cargas em todo o Sul do Brasil.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2"
          >
            <a
              href="#contact"
              aria-label="Solicitar orçamento - Botão principal Hero"
              className="inline-flex items-center justify-center bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg text-sm sm:text-base lg:text-lg"
            >
              Solicite um Orçamento
              <ArrowRight className="ml-2" size={18} />
            </a>
            <a
              href="#services"
              aria-label="Ver nossos produtos e serviços"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all text-sm sm:text-base lg:text-lg"
            >
              Nossos Produtos
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-12 mt-10 sm:mt-12 md:mt-16 max-w-3xl mx-auto px-2"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">1000+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Equipamentos Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">24h</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Assistência Técnica</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">20+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Anos de Experiência</div>
            </div>
          </motion.div>

          {/* Location Badge - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, type: "spring" }}
            className="mt-8 sm:mt-10 md:mt-12 px-2"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-red-500/30 shadow-xl max-w-full">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white font-bold text-base sm:text-lg">Chapecó - SC</span>
              </div>
              <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/30" />
              <span className="text-white/90 text-xs sm:text-sm text-center sm:text-left">Atendimento em todo Sul do Brasil</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
