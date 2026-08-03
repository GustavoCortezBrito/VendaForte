'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Truck, Wrench, Package, Clock, Zap, Fuel, Play, Cpu, Sparkles, ExternalLink, X, Bot, Video } from 'lucide-react'

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
      id: 'wX-y09vR0-c', // ID de vídeo demonstrativo EP AGV/AMR
      title: 'Robôs Autônomos de Movimentação EP (AGV / AMR)',
      description: 'Veja os equipamentos autônomos EP operando com precisão milimétrica e navegação a laser sem necessidade de operador.',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
      badge: 'Tecnologia Autônoma'
    },
    {
      id: 'EP-XP15-AUTONOMOUS', // EP XP15 Autonomous Transpaleteira
      title: 'Transpaleteira Autônoma EP XP15 & XP20',
      description: 'Automação inteligente para transporte horizontal de cargas 24/7 com máxima eficiência e retorno sobre investimento rápido.',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      badge: 'Operação 24/7'
    }
  ]

  const products = [
    {
      icon: <Bot size={40} />,
      title: 'Equipamentos Autônomos (AGVs / AMR)',
      description: 'Linha oficial EP de empilhadeiras e transpaleteiras autônomas. Automação robótica inteligente para operações 24/7 com extrema precisão, segurança e zero operador.',
      features: ['Navegação a Laser/SLAM', 'Inteligência Artificial Integrada', 'Operação Ininterrupta 24/7', 'Retorno de Investimento (ROI) Acelerado'],
      badge: 'Destaque Autônomas EP',
      isHighlighted: true,
      hasVideo: true
    },
    {
      icon: <Zap size={40} />,
      title: 'Empilhadeira Elétrica (Íon-Lítio)',
      description: 'Empilhadeira elétrica com tecnologia de baterias Íon-Lítio EP (80V/48V). Zero emissões, recarga ultra-rápida e baixíssimo custo operacional.',
      features: ['Capacidade 1.5 a 3.5 ton', 'Baterias Íon-Lítio 80V', 'Baixo custo operacional', 'Operação silenciosa'],
      badge: 'Mais Vendido',
      isHighlighted: false
    },
    {
      icon: <Fuel size={40} />,
      title: 'Empilhadeira a Gás (GLP)',
      description: 'Potência e versatilidade para operações internas e externas. Reabastecimento rápido e alta produtividade em turnos intensivos.',
      features: ['Capacidade 1.5 a 5.0 ton', 'Uso interno/externo', 'Reabastecimento rápido', 'Alto desempenho'],
      badge: null,
      isHighlighted: false
    },
    {
      icon: <Truck size={40} />,
      title: 'Empilhadeira Diesel',
      description: 'Empilhadeira diesel com máxima potência para trabalhos pesados e ambientes externos. Robusta e preparada para uso intensivo.',
      features: ['Capacidade 2.5 a 10 ton', 'Uso externo intensivo', 'Alta durabilidade', 'Trabalhos pesados'],
      badge: null,
      isHighlighted: false
    },
    {
      icon: <Package size={40} />,
      title: 'Transpaleteira e Paleteira',
      description: 'Transpaleteira elétrica e paleteira manual para movimentação horizontal de paletes. Ideais para depósitos, armazéns e logística urbana.',
      features: ['Transpaleteira elétrica', 'Paleteira manual', 'Capacidade até 3 ton', 'Fácil manuseio'],
      badge: 'Pronta Entrega',
      isHighlighted: false
    },
    {
      icon: <Wrench size={40} />,
      title: 'Manutenção & Peças Originais',
      description: 'Suporte operacional completo, assistência técnica especializada com peças originais de fábrica EP Equipment e suporte multimarca.',
      features: ['Manutenção preventiva/corretiva', 'Peças de fábrica EP', 'Atendimento no Sul do Brasil', 'Equipe técnica certificada'],
      badge: 'Suporte Oficial',
      isHighlighted: false
    }
  ]

  return (
    <section id="services" ref={ref} className="py-20 md:py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="hidden md:block absolute top-20 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-20 left-0 w-96 h-96 bg-red-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100 shadow-sm">
            <Sparkles size={16} />
            Produtos e Soluções Oficiais EP Equipment
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight tracking-tight">
            Nossa Linha de <span className="text-red-600">Produtos</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed font-normal">
            Como Dealer Autorizado EP Equipment no Sul do Brasil, oferecemos a linha completa de empilhadeiras elétricas, a diesel, transpaleteiras e <strong className="text-gray-900 font-bold">equipamentos autônomos de alta tecnologia</strong>.
          </p>
        </motion.div>

        {/* BANNER DE DESTAQUE: EQUIPAMENTOS AUTÔNOMOS E VÍDEOS EP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 p-6 sm:p-8 md:p-12 text-white shadow-2xl border border-red-900/30 relative overflow-hidden"
        >
          {/* Ambient Lighting Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Texto de Destaque Autônomas */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-wider">
                <Cpu size={14} className="text-red-400" />
                Tecnologia do Futuro EP Equipment
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Destaque: <span className="text-red-500">Equipamentos Autônomos</span>
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Transforme a logística da sua empresa com a linha de empilhadeiras e robôs autônomos (AGVs/AMRs) da EP Equipment. Operações inteligentes, seguras e com otimização total de fluxo de trabalho.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Navegação Laser & SLAM
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Operação Contínua 24/7
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Sem necessidade de operador
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Integração WMS/ERP
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 inline-flex items-center gap-2"
                >
                  <span>Solicitar Cotação de Autônomas</span>
                </a>
                
                <a
                  href="https://www.youtube.com/@EPEquipment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all inline-flex items-center gap-2 border border-white/15"
                >
                  <YoutubeIcon size={18} className="text-red-500" />
                  <span>Canal EP Equipment no YouTube</span>
                  <ExternalLink size={14} className="opacity-70" />
                </a>
              </div>
            </div>

            {/* Cards de Vídeo do YouTube */}
            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              {autonomousVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/60 hover:border-red-500/80 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-900">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase shadow-sm">
                      {video.badge}
                    </span>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setActiveVideo(video)}
                      className="absolute inset-0 flex items-center justify-center group/btn focus:outline-none"
                      aria-label={`Assistir vídeo: ${video.title}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover/btn:scale-110 transition-transform">
                        <Play size={22} className="ml-1 fill-white" />
                      </div>
                    </button>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveVideo(video)}
                      className="pt-2 text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <YoutubeIcon size={14} />
                      <span>Ver Demonstração da EP</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        {/* GRID PRINCIPAL DE PRODUTOS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                delay: 0.08 * index, 
                duration: 0.6,
                type: "spring",
                stiffness: 90
              }}
              whileHover={{ 
                y: -10,
                boxShadow: product.isHighlighted 
                  ? "0 25px 50px -12px rgba(220, 38, 38, 0.35)" 
                  : "0 20px 40px -12px rgba(0, 0, 0, 0.12)",
                transition: { duration: 0.3 }
              }}
              className={`p-6 sm:p-8 rounded-3xl transition-all border relative overflow-hidden flex flex-col h-full ${
                product.isHighlighted
                  ? 'bg-gradient-to-b from-red-50/90 via-white to-red-50/30 border-red-300 shadow-xl ring-2 ring-red-500/20'
                  : 'bg-white border-gray-200/90 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="relative z-10 flex flex-col h-full">
                {product.badge && (
                  <div className={`absolute -top-2 -right-2 sm:top-0 sm:right-0 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    product.isHighlighted 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-900 text-white'
                  }`}>
                    {product.badge}
                  </div>
                )}
                
                <div className={`mb-4 ${product.isHighlighted ? 'text-red-600' : 'text-red-600'}`}>
                  {product.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 leading-snug">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-grow">
                  {product.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-700 font-medium">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block w-full text-center py-3.5 rounded-full font-bold text-sm transition-all shadow-md uppercase tracking-wider mt-auto ${
                    product.isHighlighted
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                      : 'bg-gray-900 hover:bg-red-600 text-white'
                  }`}
                >
                  {product.isHighlighted ? 'Solicitar Cotação Autônoma' : 'Solicitar Orçamento'}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Faixa de Atendimento & Garantia EP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">Dealer Oficial</div>
              <p className="text-red-100 text-sm sm:text-base font-medium">EP Equipment no Sul do Brasil</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">20+ Anos</div>
              <p className="text-red-100 text-sm sm:text-base font-medium">De Excelência no Mercado</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">6 Filiais</div>
              <p className="text-red-100 text-sm sm:text-base font-medium">Chapecó, Joinville, Itajaí, Maringá, Seberi e Esteio</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Vídeo do YouTube */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-gray-800 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <YoutubeIcon className="text-red-500" size={20} />
                  <span>{activeVideo.title}</span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                {activeVideo.id.startsWith('http') || activeVideo.id.length > 15 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-950">
                    <YoutubeIcon size={64} className="text-red-600 mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">{activeVideo.title}</h4>
                    <p className="text-sm text-gray-400 mb-6 max-w-md">{activeVideo.description}</p>
                    <a
                      href="https://www.youtube.com/@EPEquipment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all inline-flex items-center gap-2"
                    >
                      <span>Assista no YouTube Oficial EP</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="p-4 bg-gray-950 flex justify-between items-center text-xs text-gray-400">
                <span>Venda Forte - Dealer Autorizado EP Equipment</span>
                <a
                  href="#contact"
                  onClick={() => setActiveVideo(null)}
                  className="text-red-400 font-bold hover:underline"
                >
                  Falar com Especialista →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
