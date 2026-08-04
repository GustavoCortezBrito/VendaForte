'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Truck, Wrench, Package, Zap, Fuel, Play, Sparkles, ExternalLink, X, Bot, ShieldCheck, ArrowRight } from 'lucide-react'

// Componente SVG para o ícone do YouTube
function YoutubeIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string; description: string } | null>(null)

  // Vídeos Oficiais EP Equipment da linha de autônomas
  const autonomousVideos = [
    {
      id: 'wX-y09vR0-c',
      title: 'Robôs Autônomos de Movimentação EP (AGV / AMR)',
      description: 'Equipamentos autônomos EP operando com navegação a laser de alta precisão e integrados ao WMS/ERP sem operador.',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
      badge: 'Tecnologia Autônoma'
    },
    {
      id: 'EP-XP15-AUTONOMOUS',
      title: 'Transpaleteiras Autônomas EP (XP15 & XP20)',
      description: 'Automação robótica inteligente para transporte horizontal contínuo 24/7 com máxima eficiência de fluxo.',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      badge: 'Operação 24/7'
    }
  ]

  const products = [
    {
      icon: <Zap size={32} />,
      title: 'Empilhadeiras Elétricas Íon-Lítio',
      subtitle: 'Tecnologia Li-Ion EP Equipment',
      description: 'Linha completa de empilhadeiras elétricas com baterias Íon-Lítio 80V/48V. Recarga em 1 hora, zero emissões e baixíssimo custo operacional.',
      features: ['Baterias Lítio EP 80V/48V', 'Capacidade de 1.5t a 3.5t', 'Recarga rápida de oportunidade', 'Alta durabilidade & 5 anos de garantia'],
      badge: 'Mais Vendido EP',
      ctaText: 'Ver Linha Elétrica',
      ctaHref: '/empilhadeiras-eletricas',
      isHighlighted: true
    },
    {
      icon: <Bot size={32} />,
      title: 'Equipamentos Autônomos (AGVs/AMRs)',
      subtitle: 'Robótica Logística Inteligente',
      description: 'Robôs e empilhadeiras autônomas para movimentação industrial 24/7. Automação com navegação laser/SLAM sem necessidade de operador.',
      features: ['Navegação Laser & SLAM', 'Operação Ininterrupta 24/7', 'Integração WMS/ERP de fábrica', 'Retorno de Investimento (ROI) rápido'],
      badge: 'Automação EP',
      ctaText: 'Ver Demonstração em Vídeo',
      hasVideoModal: true,
      isHighlighted: false
    },
    {
      icon: <Truck size={32} />,
      title: 'Locação de Empilhadeiras & Frotas',
      subtitle: 'Contratos Flexíveis para a Região Sul',
      description: 'Locação por dia, mês ou contratos de longo prazo com frota nova e renovada. Manutenção e assistência técnica inclusas para zero parada.',
      features: ['Frotas novas EP Equipment', 'Manutenção inclusa no contrato', 'Atendimento rápido em SC/RS/PR', 'Sem imobilização de capital'],
      badge: 'Frota Própria',
      ctaText: 'Solicitar Orçamento de Locação',
      ctaHref: '#contact',
      isHighlighted: false
    },
    {
      icon: <Wrench size={32} />,
      title: 'Assistência Técnica & Manutenção',
      subtitle: 'Suporte Especializado Multimarca',
      description: 'Equipe de técnicos altamente qualificados e oficinas móveis preparadas para atendimentos preventivos e corretivos urgentes.',
      features: ['Técnicos certificados EP', 'Oficinas móveis para atendimento', 'Manutenção preventiva & corretiva', 'Planos de revisão periódica'],
      badge: 'Suporte 24/7',
      ctaText: 'Falar com a Assistência',
      ctaHref: '#contact',
      isHighlighted: false
    },
    {
      icon: <Package size={32} />,
      title: 'Peças Originais EP Equipment',
      subtitle: 'Estoque de Reposição Imediata',
      description: 'Garantia de operação contínua com estoque completo de peças originais, carregadores, baterias de lítio e componentes de reposição.',
      features: ['Peças originais de fábrica', 'Envio rápido para todo o Brasil', 'Baterias e módulos de recarga', 'Componentes com garantia'],
      badge: 'Peças de Fábrica',
      ctaText: 'Cotar Peças Originais',
      ctaHref: '#contact',
      isHighlighted: false
    },
    {
      icon: <Fuel size={32} />,
      title: 'Empilhadeiras a Diesel & GLP',
      subtitle: 'Robustez para Pátios e Uso Intensivo',
      description: 'Empilhadeiras à combustão preparadas para trabalhos pesados em ambientes externos, terrenos irregulares e operações contínuas.',
      features: ['Capacidades de 2.5t a 10t', 'Excelente estabilidade e tração', 'Motores de alta eficiência', 'Estrutura reforçada'],
      badge: 'Uso Intensivo',
      ctaText: 'Solicitar Cotação',
      ctaHref: '#contact',
      isHighlighted: false
    }
  ]

  return (
    <section id="services" ref={ref} className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden font-sans">
      
      {/* Elementos Decorativos Suaves de Fundo Animados */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute top-10 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="hidden md:block absolute bottom-10 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100 shadow-sm">
            <Sparkles size={16} className="animate-spin text-red-500" style={{ animationDuration: '6s' }} />
            Produtos, Serviços & Automação EP Equipment
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight tracking-tight">
            Nossas Soluções em <span className="text-red-600">Empilhadeiras</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Como Dealer Autorizado <strong className="text-gray-900 font-semibold">EP Equipment no Sul do Brasil</strong>, oferecemos venda, locação, assistência técnica, peças originais e tecnologias autônomas para acelerar a logística do seu negócio.
          </p>
        </motion.div>

        {/* GRID DE CARDS COM ANIMAÇÃO FLUIDA */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                delay: 0.08 * index, 
                duration: 0.5,
                type: "spring",
                stiffness: 90
              }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.25 }
              }}
              className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 border relative flex flex-col justify-between h-full bg-white group ${
                product.isHighlighted
                  ? 'border-red-500/40 shadow-xl ring-2 ring-red-500/10 hover:shadow-2xl hover:shadow-red-500/15'
                  : 'border-gray-200/90 shadow-md hover:shadow-xl hover:border-red-400'
              }`}
            >
              <div>
                {/* Badge Topo */}
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      product.isHighlighted 
                        ? 'bg-red-600 text-white shadow-red-600/30 group-hover:scale-110 transition-transform' 
                        : 'bg-red-50 text-red-600 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all'
                    }`}
                  >
                    {product.icon}
                  </motion.div>

                  {product.badge && (
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      product.isHighlighted 
                        ? 'bg-red-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Título & Subtítulo */}
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 leading-snug">
                  {product.title}
                </p>
                <p className="text-xs font-bold text-red-600 mb-4 uppercase tracking-wider">
                  {product.subtitle}
                </p>

                {/* Descrição */}
                <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Lista de Diferenciais */}
                <ul className="space-y-2 mb-8 pt-4 border-t border-gray-100">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-700 font-medium">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação CTA */}
              <div>
                {product.hasVideoModal ? (
                  <button
                    onClick={() => setActiveVideo(autonomousVideos[0])}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gray-900 hover:bg-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md group"
                  >
                    <Play size={16} className="fill-white" />
                    <span>{product.ctaText}</span>
                  </button>
                ) : (
                  <a
                    href={product.ctaHref}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                      product.isHighlighted
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
                        : 'bg-gray-900 hover:bg-red-600 text-white'
                    }`}
                  >
                    <span>{product.ctaText}</span>
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>

            </motion.div>
          ))}
        </div>

        {/* MODAL DE VÍDEO DEMONSTRATIVO DAS AUTÔNOMAS */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-3xl overflow-hidden max-w-4xl w-full border border-gray-800 shadow-2xl relative"
              >
                {/* Botão Fechar */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Player ou Vídeo do YouTube */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Informações do Vídeo */}
                <div className="p-6 bg-gray-900 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase">
                      Vídeo Oficial EP Equipment
                    </span>
                  </div>
                  <p className="text-xl font-bold text-white mb-2">{activeVideo.title}</p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{activeVideo.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800">
                    <a
                      href="#contact"
                      onClick={() => setActiveVideo(null)}
                      className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-2"
                    >
                      <span>Solicitar Cotação de Autônomas</span>
                      <ArrowRight size={14} />
                    </a>

                    <a
                      href="https://www.youtube.com/@EPEquipment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-gray-400 hover:text-red-400 inline-flex items-center gap-1.5"
                    >
                      <YoutubeIcon size={16} />
                      <span>Ver Canal no YouTube</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
