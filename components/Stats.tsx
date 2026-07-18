'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { TrendingUp, Users, Award, Clock } from 'lucide-react'

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { 
      icon: <TrendingUp size={32} />,
      value: 1000, 
      suffix: '+', 
      label: 'Equipamentos Entregues', 
      duration: 2 
    },
    { 
      icon: <Users size={32} />,
      value: 500, 
      suffix: '+', 
      label: 'Clientes Atendidos', 
      duration: 2 
    },
    { 
      icon: <Award size={32} />,
      value: 5000, 
      suffix: '+', 
      label: 'Manutenções Realizadas', 
      duration: 2.5 
    },
    { 
      icon: <Clock size={32} />,
      value: 98, 
      suffix: '%', 
      label: 'Satisfação dos Clientes', 
      duration: 2 
    },
  ]

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-red-900 via-red-800 to-red-900 relative overflow-hidden">
      {/* Background Pattern - Hidden on Mobile */}
      <div className="hidden md:block absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="text-red-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Nossos Números
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 sm:mt-4 mb-3 sm:mb-4 md:mb-6 px-4 leading-tight">
            Resultados que Falam por Si
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-red-100 max-w-3xl mx-auto px-4">
            Venda Forte: soluções completas em empilhadeiras e equipamentos - Números que comprovam nossa excelência
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                delay: 0.1 * index, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                rotate: [0, -3, 3, 0],
                transition: { duration: 0.4 }
              }}
              className="text-center bg-white/10 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all border border-white/20 relative overflow-hidden group"
            >
              {/* Animated Glow Effect - Hidden on Mobile */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100" />

              <div className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-full mb-2 sm:mb-3 md:mb-4 group-hover:bg-white/30 transition-all">
                <div className="text-white">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </div>

              <Counter
                target={stat.value}
                duration={stat.duration}
                isInView={isInView}
                suffix={stat.suffix}
              />
              <p className="text-red-100 mt-1 sm:mt-2 md:mt-3 font-medium text-xs sm:text-sm md:text-base leading-tight">{stat.label}</p>

              {/* Particle Effect on Hover - Hidden on Mobile */}
              <div className="hidden md:block absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({ target, duration, isInView, suffix }: { target: number; duration: number; isInView: boolean; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return (
    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  )
}
