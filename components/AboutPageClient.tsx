'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Award, 
  Lightbulb, 
  Shield, 
  Zap, 
  MapPin, 
  TrendingUp, 
  CheckCircle2,
  Factory,
  Building2,
  Target,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  Users,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPageClient() {
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const locationsRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" })
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" })
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" })
  const locationsInView = useInView(locationsRef, { once: true, margin: "-100px" })

  const values = [
    {
      icon: <Award size={40} />,
      title: 'Qualidade Garantida',
      description: 'Equipamentos certificados EP Equipment com garantia de fábrica e peças originais'
    },
    {
      icon: <Lightbulb size={40} />,
      title: 'Inovação Constante',
      description: 'Tecnologia Íon-Lítio de última geração e equipamentos autônomos (AGV/AMR)'
    },
    {
      icon: <Shield size={40} />,
      title: 'Segurança Total',
      description: 'Conformidade rigorosa com normas NR-11 e treinamento de operadores'
    },
    {
      icon: <Zap size={40} />,
      title: 'Agilidade',
      description: 'Atendimento rápido em SC, PR, RS e SP com equipe especializada'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      
      {/* Hero Section - Similar to Home */}
      <section 
        ref={heroRef}
        id="home" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/sede.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>

        {/* Animated Background Elements */}
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

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 mt-16 sm:mt-20 md:mt-0"
            >
              <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-red-400 mb-2">
                Grupo Venda Forte
              </span>
              Sobre Nossa{' '}
              <span className="block text-red-500 mt-1 sm:mt-2">
                História e Missão
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-2 font-normal"
            >
              Desde 2014 no mercado de equipamentos para movimentação de cargas. Em 2021, tornamo-nos <strong className="text-white font-semibold">Distribuidor Autorizado EP Equipment</strong> para <strong className="text-red-400">Santa Catarina</strong>, com bases em Chapecó e Joinville, atendendo todo o <strong className="text-white">Sul do Brasil e São Paulo</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg text-sm sm:text-base lg:text-lg"
              >
                Fale Conosco
                <ArrowRight className="ml-2" size={18} />
              </a>
              <Link
                href="/produtos"
                className="inline-flex items-center justify-center border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all text-sm sm:text-base lg:text-lg"
              >
                Ver Catálogo
              </Link>
            </motion.div>

            {/* Stats Mini */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-12 mt-10 sm:mt-12 md:mt-16 max-w-3xl mx-auto px-2"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">2014</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Fundação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">2021</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Distribuidor EP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">4</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Estados Atendidos</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Nossa História Section */}
      <section ref={storyRef} className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <span className="text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Nossa Trajetória
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-3 sm:mb-4 md:mb-6 px-4 leading-tight">
              10 Anos de <span className="text-red-600">Experiência</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
              >
                O <strong className="text-gray-900 font-semibold">Grupo Venda Forte</strong> iniciou suas atividades em <strong className="text-gray-900 font-semibold">2014</strong> no ramo de Representação Comercial Corporativa, em parceria com a RAC Empilhadeiras de Itajaí-SC, na época autorizada Linde Empilhadeiras do grupo Kion/Still.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
              >
                Em <strong className="text-red-600 font-semibold">Julho de 2021</strong>, em parceria com a SDO Empilhadeiras de Campinas-SP, fechamos o acordo para ser <strong className="text-gray-900 font-semibold">Distribuidor Autorizado EP Equipment para Santa Catarina</strong>. Hoje, com bases em <strong className="text-red-600">Chapecó-SC</strong> e <strong className="text-red-600">Joinville-SC</strong>, atendemos <strong className="text-gray-900">SC, PR, RS e São Paulo</strong>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={storyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-l-4 border-red-600"
              >
                <p className="text-xs sm:text-sm md:text-base text-gray-800 italic leading-relaxed">
                  <span className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl">"</span>
                  Possuímos uma metodologia de vendas inteligente, com foco na estratégia, qualidade no atendimento e na capacitação da equipe. O resultado disso é uma parceria sólida e duradoura com nossos clientes.
                  <span className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl">"</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 font-semibold">
                  — Rodrigo Schilke, CEO
                </p>
              </motion.div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6"
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={storyInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    delay: 0.2 + (0.15 * index), 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
                >
                  <div className="text-red-600 mb-3 sm:mb-4 md:mb-5">
                    {value.icon}
                  </div>
                  <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    {value.title}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nossas Unidades */}
      <section ref={locationsRef} className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={locationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <span className="text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Nossas Unidades
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-3 sm:mb-4 md:mb-6 px-4 leading-tight">
              Presença em <span className="text-red-600">Santa Catarina</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 font-medium max-w-4xl mx-auto px-4 leading-relaxed">
              Bases estratégicas em Chapecó e Joinville, atendendo SC, PR, RS e São Paulo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Chapecó */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={locationsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 size={28} className="text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white">
                  Matriz
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">Chapecó</h3>
              <p className="text-sm font-semibold mb-4 text-red-100">Santa Catarina</p>

              <p className="text-sm leading-relaxed mb-4 text-white/90">
                Sede principal com showroom completo EP Equipment, oficina técnica certificada e amplo estoque de peças multimarcas
              </p>

              <div className="flex flex-wrap gap-2">
                {['Venda', 'Aluguel', 'Assistência 24/7', 'Peças', 'Showroom'].map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Joinville */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={locationsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Factory size={28} className="text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white">
                  Filial
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">Joinville</h3>
              <p className="text-sm font-semibold mb-4 text-red-100">Santa Catarina</p>

              <p className="text-sm leading-relaxed mb-4 text-white/90">
                Filial estratégica com equipe técnica especializada para atendimento rápido no norte de SC e regiões Sul/Sudeste
              </p>

              <div className="flex flex-wrap gap-2">
                {['Venda', 'Aluguel', 'Assistência 24/7', 'Peças'].map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={locationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 sm:mt-12 bg-gradient-to-r from-gray-900 to-slate-900 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Entre em Contato</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  Fale com nossos especialistas em Chapecó ou Joinville
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/5549988395635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold"
                  >
                    <Phone size={16} className="text-red-400" />
                    <span>+55 49 98839-5635</span>
                  </a>
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold">
                    <Mail size={16} className="text-red-400" />
                    <span>contato@vendaforte.com</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Users size={28} className="text-red-400 mb-2 mx-auto" />
                  <p className="text-2xl font-bold mb-1">10+</p>
                  <p className="text-xs text-gray-400">Anos Experiência</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Clock size={28} className="text-red-400 mb-2 mx-auto" />
                  <p className="text-2xl font-bold mb-1">24/7</p>
                  <p className="text-xs text-gray-400">Assistência</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
