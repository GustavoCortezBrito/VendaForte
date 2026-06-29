'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, MoreVertical, ChevronDown } from 'lucide-react'

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [showAll, setShowAll] = useState(false)

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
    <section id="testimonials" ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Google Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Avaliações no Google
          </h2>
          
          {/* Google Rating Card */}
          <div className="inline-block bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">5.0</div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-yellow-400 fill-yellow-400 mx-0.5" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">Baseado em 17 avaliações</p>
              <a 
                href="https://maps.app.goo.gl/JU9AaTSb7JFw1qJ68" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Ver perfil no Google
              </a>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid - Google Maps Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, showAll ? testimonials.length : 6).map((testimonial, index) => (
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
              className="bg-white rounded-lg p-5 shadow hover:shadow-md transition-shadow border border-gray-200 relative overflow-hidden group"
            >
              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-100 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                {/* Header with Avatar and Name */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Google-style circular avatar with initials */}
                    <motion.div 
                      className={`${testimonial.bgColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
                      whileHover={{ 
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.4 }
                      }}
                    >
                      {testimonial.initials}
                    </motion.div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {testimonial.isLocalGuide && (
                          <motion.span 
                            className="inline-flex items-center"
                            animate={{ 
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                            }}
                          >
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="#34a853">
                              <path d="M12,2L8,8.5L2,10l5.5,5L6,21l6-3.5L18,21l-1.5-6L22,10l-6-1.5L12,2z"/>
                            </svg>
                          </motion.span>
                        )}
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Star Rating */}
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ 
                        delay: 0.05 * index + 0.05 * i,
                        type: "spring"
                      }}
                    >
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Time */}
                <p className="text-xs text-gray-500 mb-3">{testimonial.timeAgo}</p>

                {/* Review Text */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {!showAll && testimonials.length > 6 && (
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
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Empresas que <span className="text-red-600">Confiam</span> em Nós
            </h3>
            <p className="text-gray-600">Parceiros de sucesso em todo o Sul do Brasil</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: 'Adami', file: 'adami.png', category: 'Indústria' },
              { name: 'BRF', file: 'brf.png', category: 'Brasil Foods' },
              { name: 'Copacol', file: 'copacol.png', category: 'Cooperativa' },
              { name: 'GT Foods', file: 'gtfoods.png', category: 'Alimentos' },
              { name: 'JBS', file: 'jbs.png', category: 'Friboi' },
              { name: 'Muffato', file: 'muffato.png', category: 'Supermercados' },
              { name: 'Randon', file: 'randon.png', category: 'Implementos' },
              { name: 'Seara', file: 'seara.png', category: 'Alimentos' },
            ].map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.4 }
                }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 flex items-center justify-center group relative overflow-hidden min-h-[120px]"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <div className="text-center relative z-10 w-full">
                  <div className="h-12 flex items-center justify-center mb-3">
                    <img 
                      src={`/images/clients/${client.file}`} 
                      alt={`Logo ${client.name}`}
                      className="max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        // Fallback para texto se imagem não existir
                        const target = e.currentTarget as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement!
                        parent.innerHTML = `<span class="text-2xl font-bold text-gray-700 group-hover:text-red-600 transition-colors">${client.name}</span>`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{client.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nota sobre logos */}
          <p className="text-center text-sm text-gray-400 mt-8 italic">
            Logos representativas • As marcas pertencem aos seus respectivos proprietários
          </p>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1 }}
            className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              <div>
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-red-100 text-sm">Equipamentos Entregues</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">20+</p>
                <p className="text-red-100 text-sm">Anos de Experiência</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">98%</p>
                <p className="text-red-100 text-sm">Clientes Satisfeitos</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">24h</p>
                <p className="text-red-100 text-sm">Suporte Técnico</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
