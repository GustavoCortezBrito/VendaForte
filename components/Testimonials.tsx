'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Star, MoreVertical, ChevronDown } from 'lucide-react'

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const testimonials = [
    {
      name: 'Gabriela Berger',
      position: '5 avaliações',
      initials: 'GB',
      bgColor: 'bg-purple-500',
      rating: 5,
      timeAgo: 'há 2 meses',
      text: 'Ambiente amplo, bom atendimento dos funcionários, prestativos. Obtive resposta rápida do orçamento! Produto de qualidade, recomendo!'
    },
    {
      name: 'Willian APEX',
      position: '4 avaliações',
      initials: 'WA',
      bgColor: 'bg-blue-500',
      rating: 5,
      timeAgo: 'há 3 meses',
      text: 'Atendimento muito bom! Buscaram entender a demanda para disponibilizar o equipamento com as características ideias para nossa operação.'
    },
    {
      name: 'Luan Casarotto',
      position: '7 avaliações',
      initials: 'LC',
      bgColor: 'bg-green-500',
      rating: 5,
      timeAgo: 'há 1 mês',
      text: 'Vendedor Michael Felipe Vieira extremamente atencioso, atendimento 10, super recomendo.'
    },
    {
      name: 'Alex Barcarol',
      position: '2 avaliações',
      initials: 'AB',
      bgColor: 'bg-orange-500',
      rating: 5,
      timeAgo: 'há 4 meses',
      text: 'Empresa superou minhas expectativas. Ótimo atendimento, preços e condições. Recomendo para todos que precisam de empilhadeiras de qualidade.'
    },
    {
      name: 'Caetano Lamp',
      position: '1 avaliação',
      initials: 'CL',
      bgColor: 'bg-pink-500',
      rating: 5,
      timeAgo: 'há 5 meses',
      text: 'Excelente atendimento, ótimos preços e máquinas de qualidade parabéns'
    },
    {
      name: 'Alexandre Cesar Machado',
      position: '5 avaliações',
      initials: 'AM',
      bgColor: 'bg-indigo-500',
      rating: 5,
      timeAgo: 'há 2 meses',
      text: 'Atendimento sensacional! Prestativo e produto de qualidade.'
    },
    {
      name: 'Anderson Marques',
      position: 'Local Guide · 6 avaliações',
      initials: 'AM',
      bgColor: 'bg-teal-500',
      rating: 5,
      timeAgo: 'há 1 mês',
      isLocalGuide: true,
      text: 'Excelente atendimento do Michael, empresa muito boa! Recomendo!'
    },
    {
      name: 'Adriano Ludwig',
      position: '2 avaliações',
      initials: 'AL',
      bgColor: 'bg-cyan-500',
      rating: 5,
      timeAgo: 'há 3 meses',
      text: 'Atendimento diferenciado e ótima qualidade dos equipamentos'
    },
    {
      name: 'Maria Caneppele',
      position: '1 avaliação',
      initials: 'MC',
      bgColor: 'bg-rose-500',
      rating: 5,
      timeAgo: 'há 6 meses',
      text: 'Ótimo atendimento!! Recomendo'
    },
    {
      name: 'Sara Rohde',
      position: '2 avaliações',
      initials: 'SR',
      bgColor: 'bg-amber-500',
      rating: 5,
      timeAgo: 'há 4 meses',
      text: 'Agilidade no atendimento e máquinas de qualidade.'
    },
    {
      name: 'Derlei Vieira',
      position: '4 avaliações',
      initials: 'DV',
      bgColor: 'bg-lime-500',
      rating: 5,
      timeAgo: 'há 2 meses',
      text: 'Excelente atendimento'
    }
  ]

  return (
    <section id="testimonials" ref={ref} className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Google Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="inline-block text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 px-3 sm:px-4 py-2 bg-red-50 rounded-full">
            Avaliações
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 sm:mb-8 px-4 leading-tight">
            Avaliações no <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Google</span>
          </h2>
          
          {/* Google Rating Card */}
          <div className="inline-block bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 md:mb-12 border border-gray-100 mx-4">
            <div className="flex flex-col items-center">
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-2 sm:mb-3">5.0</div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400 mx-0.5" />
                ))}
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Baseado em 17 avaliações</p>
              <a 
                href="https://maps.app.goo.gl/JU9AaTSb7JFw1qJ68" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Ver perfil no Google
              </a>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid - Google Maps Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, showAll ? testimonials.length : (isMobile ? 3 : 6)).map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                delay: 0.05 * index, 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-lg p-4 sm:p-5 shadow hover:shadow-md transition-shadow border border-gray-200 relative overflow-hidden group"
            >
              {/* Animated Border Glow - Hidden on Mobile */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-red-100 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />

              <div className="relative z-10">
                {/* Header with Avatar and Name */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Google-style circular avatar with initials */}
                    <div className={`${testimonial.bgColor} w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm sm:text-base`}>
                      {testimonial.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {testimonial.isLocalGuide && (
                          <span className="inline-flex items-center">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="#34a853">
                              <path d="M12,2L8,8.5L2,10l5.5,5L6,21l6-3.5L18,21l-1.5-6L22,10l-6-1.5L12,2z"/>
                            </svg>
                          </span>
                        )}
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>

                {/* Star Rating */}
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={12} className="sm:w-[14px] sm:h-[14px] text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Time */}
                <p className="text-xs text-gray-500 mb-2 sm:mb-3">{testimonial.timeAgo}</p>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {!showAll && testimonials.length > (isMobile ? 3 : 6) && (
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
              Carregar Mais Avaliações
              <ChevronDown size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* Trust Badges - Clientes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Empresas que <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Confiam</span> em Nós
            </h3>
            <p className="text-gray-600 text-lg">Parceiros de sucesso em todo o Sul do Brasil</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { name: 'Adami', url: 'https://grupovendaforte.com/files/1295774/10709783dfb4b9bc30912ee66dcbe12f' },
              { name: 'BRF', url: 'https://grupovendaforte.com/files/1295775/af691003297f76d9f561a1b6547d8083' },
              { name: 'Copacol', url: 'https://grupovendaforte.com/files/1295776/e30f11cddd54f00adcd678256cce9fb2' },
              { name: 'GT Foods', url: 'https://grupovendaforte.com/files/1295777/45161685dbdfc18a743d3f04512f3e3e' },
              { name: 'JBS', url: 'https://grupovendaforte.com/files/1295778/3a69704c4656c8e6be78e17f2531f410' },
              { name: 'Muffato', url: 'https://grupovendaforte.com/files/1295779/43975e9f9131ce1b46dde80b097542fe' },
              { name: 'Randon', url: 'https://grupovendaforte.com/files/1295780/1c64087e43cb9f1d06c94c6706082049' },
              { name: 'Seara', url: 'https://grupovendaforte.com/files/1295781/79aaf7a6ee7f843f2e738b73209302b1' },
            ].map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="flex items-center justify-center"
              >
                <img 
                  src={client.url} 
                  alt={`Logo ${client.name}`}
                  className="max-h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1 }}
            className="mt-16 bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-3xl p-12 shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div className="transform hover:scale-105 transition-transform">
                <p className="text-5xl font-bold mb-3">500+</p>
                <p className="text-red-100 text-lg">Equipamentos Entregues</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <p className="text-5xl font-bold mb-3">20+</p>
                <p className="text-red-100 text-lg">Anos de Experiência</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <p className="text-5xl font-bold mb-3">98%</p>
                <p className="text-red-100 text-lg">Clientes Satisfeitos</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <p className="text-5xl font-bold mb-3">24h</p>
                <p className="text-red-100 text-lg">Suporte Técnico</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
