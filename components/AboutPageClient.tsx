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
  Users, 
  TrendingUp, 
  CheckCircle2,
  Factory,
  Truck,
  Wrench,
  Phone,
  Mail,
  Clock,
  Building2,
  Target,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPageClient() {
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const locationsRef = useRef(null)
  const numbersRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" })
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" })
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" })
  const locationsInView = useInView(locationsRef, { once: true, margin: "-100px" })
  const numbersInView = useInView(numbersRef, { once: true, margin: "-100px" })

  const values = [
    {
      icon: <Award size={32} />,
      title: 'Qualidade Garantida',
      description: 'Equipamentos certificados EP Equipment com garantia de fábrica e peças originais'
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Inovação Constante',
      description: 'Tecnologia Íon-Lítio de última geração e equipamentos autônomos (AGV/AMR)'
    },
    {
      icon: <Shield size={32} />,
      title: 'Segurança Total',
      description: 'Conformidade rigorosa com normas NR-11 e treinamento de operadores'
    },
    {
      icon: <Zap size={32} />,
      title: 'Agilidade Operacional',
      description: 'Atendimento rápido em Chapecó, Joinville e toda região Sul'
    }
  ]

  const locations = [
    {
      city: 'Chapecó',
      state: 'Santa Catarina',
      type: 'Matriz',
      icon: <Building2 size={24} />,
      description: 'Sede principal com showroom completo EP Equipment, oficina técnica certificada e amplo estoque de peças multimarcas. Atendimento regional para SC, PR, RS e SP',
      services: ['Venda', 'Aluguel', 'Assistência Técnica', 'Peças Multimarcas', 'Showroom'],
      highlight: true
    },
    {
      city: 'Joinville',
      state: 'Santa Catarina',
      type: 'Filial',
      icon: <Factory size={24} />,
      description: 'Filial estratégica para atendimento ao norte de SC e regiões Sul e Sudeste, com equipe técnica especializada e pronto-atendimento',
      services: ['Venda', 'Aluguel', 'Assistência Técnica', 'Peças'],
      highlight: true
    }
  ]

  const numbers = [
    { value: '2014', label: 'Atuando no Mercado', icon: <TrendingUp size={28} /> },
    { value: '2021', label: 'Distribuidor EP Equipment', icon: <Award size={28} /> },
    { value: '2', label: 'Bases em Santa Catarina', icon: <MapPin size={28} /> },
    { value: '24/7', label: 'Assistência Técnica', icon: <Clock size={28} /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 pt-32 pb-20 sm:pt-40 sm:pb-28"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 backdrop-blur-sm mb-6">
              <Sparkles size={16} className="text-red-400" />
              <span className="text-red-300 font-extrabold text-xs uppercase tracking-wider">Dealer Autorizado EP Equipment</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Sobre o Grupo{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Venda Forte
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8">
              Desde 2014 no mercado de equipamentos para movimentação de cargas. Em 2021, tornamo-nos{' '}
              <strong className="text-white">Distribuidor Autorizado EP Equipment</strong> para{' '}
              <strong className="text-red-400">Santa Catarina</strong>, com bases em Chapecó e Joinville, atendendo todo o{' '}
              <strong className="text-white">Sul do Brasil e São Paulo</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105"
              >
                Fale com Nossa Equipe
              </a>
              <Link
                href="/empilhadeiras-eletricas"
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-extrabold text-sm backdrop-blur-sm transition-all hover:scale-105"
              >
                Ver Catálogo EP Equipment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nossa História */}
      <section ref={storyRef} className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/20 to-white" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Target size={14} />
              Nossa Trajetória
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Experiência e <span className="text-red-600">Comprometimento</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                O <strong className="text-gray-900 font-semibold">Grupo Venda Forte</strong> iniciou suas atividades em <strong className="text-gray-900 font-semibold">2014</strong> no ramo de Representação Comercial Corporativa, em parceria com a RAC Empilhadeiras de Itajaí-SC, na época autorizada Linde Empilhadeiras do grupo Kion/Still. Com o tempo, ganhamos experiência na área comercial e novos horizontes começaram a se abrir.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Em <strong className="text-red-600 font-semibold">Julho de 2021</strong>, em parceria com a SDO Empilhadeiras de Campinas-SP, fechamos o acordo para ser <strong className="text-gray-900 font-semibold">Distribuidor Autorizado EP Equipment para Santa Catarina</strong>. Um desafio que nos move a cada dia, sempre em direção à evolução. Hoje, com bases consolidadas em <strong className="text-red-600">Chapecó-SC</strong> e <strong className="text-red-600">Joinville-SC</strong>, atendemos indústrias, armazéns e centros de distribuição em <strong className="text-gray-900">Santa Catarina, Paraná, Rio Grande do Sul e São Paulo</strong>.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Comercializamos a linha completa de empilhadeiras elétricas com tecnologia <strong className="text-gray-900">Íon-Lítio 80V/48V/24V</strong>, além de venda e aluguel de empilhadeiras, peças multimarcas para todos os modelos e equipamentos autônomos. Nossa <strong className="text-red-600">matriz em Chapecó-SC</strong> conta com showroom completo e oficina técnica certificada. A <strong className="text-red-600">filial em Joinville-SC</strong> garante cobertura no norte catarinense com equipe especializada, atendendo toda a região Sul do Brasil e São Paulo.
              </p>

              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-lg font-bold mb-2">"Possuímos uma metodologia de vendas inteligente, com foco na estratégia, qualidade no atendimento e na capacitação da equipe. O resultado disso é uma parceria sólida e duradoura com nossos clientes. Acreditamos que o setor comercial é o que dita a velocidade de crescimento das empresas."</p>
                <p className="text-sm text-red-100">— Rodrigo Schilke, CEO Grupo Venda Forte</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200"
            >
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Nossos Diferenciais</h3>
              
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle2 size={20} />, text: 'Distribuidor Autorizado EP Equipment para Santa Catarina desde 2021' },
                  { icon: <CheckCircle2 size={20} />, text: '10 anos de experiência no mercado de empilhadeiras (desde 2014)' },
                  { icon: <CheckCircle2 size={20} />, text: 'Atendimento em SC, PR, RS e São Paulo' },
                  { icon: <CheckCircle2 size={20} />, text: 'Peças multimarcas - estoque próprio e pronta entrega' },
                  { icon: <CheckCircle2 size={20} />, text: 'Assistência técnica especializada 24/7' },
                  { icon: <CheckCircle2 size={20} />, text: 'Showroom completo com linha EP Equipment em Chapecó' },
                  { icon: <CheckCircle2 size={20} />, text: 'Metodologia de vendas inteligente com foco em estratégia' },
                  { icon: <CheckCircle2 size={20} />, text: 'Parcerias com Linde/Kion/Still e EP Equipment' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={storyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + (idx * 0.05) }}
                    className="flex items-start gap-3"
                  >
                    <div className="text-red-600 flex-shrink-0 mt-1">{item.icon}</div>
                    <p className="text-sm sm:text-base text-gray-700 font-medium">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Números que Comprovam */}
      <section ref={numbersRef} className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={numbersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              10 Anos de <span className="text-red-500">Experiência</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Desde 2014 no mercado de empilhadeiras, distribuidor EP Equipment desde 2021
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {numbers.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={numbersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="text-red-500 mb-4 flex justify-center">{item.icon}</div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{item.value}</div>
                <div className="text-gray-300 text-sm font-semibold">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section ref={valuesRef} className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Award size={14} />
              Nossos Valores
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              O que nos <span className="text-red-600">Move</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-red-500/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossas Unidades - Foco em Chapecó e Joinville */}
      <section ref={locationsRef} className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={locationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-wider mb-4">
              <MapPin size={14} />
              Nossas Unidades
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Presença em <span className="text-red-600">Santa Catarina</span>, Atendimento Regional
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bases estratégicas em Chapecó e Joinville (SC), com atendimento em todo o Sul do Brasil e São Paulo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {locations.map((location, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={locationsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.05 * idx, duration: 0.5 }}
                className={`rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group ${
                  location.highlight 
                    ? 'bg-gradient-to-br from-red-600 to-red-700 text-white border-2 border-red-700' 
                    : 'bg-white border-2 border-gray-200 hover:border-red-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    location.highlight ? 'bg-white/20' : 'bg-red-100'
                  }`}>
                    <div className={location.highlight ? 'text-white' : 'text-red-600'}>
                      {location.icon}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    location.highlight 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {location.type}
                  </span>
                </div>

                <h3 className={`text-2xl font-extrabold mb-1 ${location.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {location.city}
                </h3>
                <p className={`text-sm font-semibold mb-4 ${location.highlight ? 'text-red-100' : 'text-gray-600'}`}>
                  {location.state}
                </p>

                <p className={`text-sm leading-relaxed mb-4 ${location.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                  {location.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {location.services.map((service, sIdx) => (
                    <span
                      key={sIdx}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        location.highlight 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Destaque para Chapecó e Joinville */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={locationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 bg-gradient-to-r from-gray-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
                  Chapecó e Joinville: <span className="text-red-400">Nossas Bases em SC</span>
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Nossa <strong className="text-white">matriz em Chapecó-SC</strong> e <strong className="text-white">filial em Joinville-SC</strong> oferecem estrutura completa com showroom EP Equipment, oficina técnica autorizada e estoque de peças multimarcas. A partir dessas bases, atendemos clientes em <strong className="text-white">Santa Catarina, Paraná, Rio Grande do Sul e São Paulo</strong> com equipe altamente qualificada.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://wa.me/5549988395635" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <Phone size={16} className="text-red-400" />
                    <span className="text-sm font-semibold">+55 49 98839-5635</span>
                  </a>
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl">
                    <Mail size={16} className="text-red-400" />
                    <span className="text-sm font-semibold">contato@vendaforte.com</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Siga-nos</p>
                  <div className="flex gap-3">
                    <a 
                      href="https://www.instagram.com/vendaforte/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/grupovendaforte" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/grupo-venda-forte" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Users size={32} className="text-red-400 mb-2 mx-auto" />
                  <p className="text-3xl font-extrabold mb-1">50+</p>
                  <p className="text-sm text-gray-400">Colaboradores</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Wrench size={32} className="text-red-400 mb-2 mx-auto" />
                  <p className="text-3xl font-extrabold mb-1">15+</p>
                  <p className="text-sm text-gray-400">Técnicos Certificados</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Factory size={32} className="text-red-400 mb-2 mx-auto" />
                  <p className="text-3xl font-extrabold mb-1">2</p>
                  <p className="text-sm text-gray-400">Oficinas Próprias</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Truck size={32} className="text-red-400 mb-2 mx-auto" />
                  <p className="text-3xl font-extrabold mb-1">100+</p>
                  <p className="text-sm text-gray-400">Frotas Gerenciadas</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Pronto para Equipar sua Operação?
            </h2>
            <p className="text-lg sm:text-xl text-red-100 mb-8 leading-relaxed">
              Fale com nossos especialistas em Chapecó ou Joinville e descubra a solução EP Equipment ideal para sua operação em SC, PR, RS ou SP
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 rounded-2xl bg-white text-red-600 hover:bg-gray-100 font-extrabold text-sm shadow-xl transition-all hover:scale-105"
            >
              Solicitar Atendimento
            </a>
            <Link
              href="/empilhadeiras-eletricas"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-extrabold text-sm backdrop-blur-sm transition-all hover:scale-105"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
