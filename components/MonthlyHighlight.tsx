'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, ChevronRight, ShieldCheck, Truck, Percent, Sparkles, ZoomIn } from 'lucide-react'
import ImageLightboxModal from '@/components/ImageLightboxModal'

interface HighlightItem {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  capacity: string
  liftingHeight: string
  batteryVoltage: string
  chargingTime: string
  turningRadius: string
  image: string
  highlights: string[]
}

const HIGHLIGHT_ITEMS: HighlightItem[] = [
  {
    id: 'efl302b3',
    slug: 'efl302b3',
    title: 'Empilhadeira Elétrica EFL302B3',
    subtitle: 'Contrabalançada 4 Rodas Li-Ion 80V',
    description: 'A empilhadeira contrabalançada EP EFL302B3 é projetada para entregar alta performance, máxima ergonomia e eficiência operacional com tecnologia de bateria Íon-Lítio 80V.',
    capacity: '3.000 kg',
    liftingHeight: '6.000 mm (6,0m)',
    batteryVoltage: '80V Li-Ion',
    chargingTime: '2 a 2.5 horas',
    turningRadius: '2.437 mm',
    image: 'https://cdn.ep-portal.net/products/attr_5/1766563537248-z8brck.webp',
    highlights: [
      'Capacidade industrial de 3.000 kg para operações pesadas e contínuas',
      'Elevação de até 6 metros com mastro reforçado e excelente visibilidade',
      'Bateria Li-Ion 80V inclusa com 5 anos de garantia de fábrica',
      'Livre de manutenção de água/ácido e recarga rápida de oportunidade'
    ]
  },
  {
    id: 'ds3',
    slug: 'ds3',
    title: 'Empilhadeira Patolada DS3',
    subtitle: 'Stacker Elétrico Li-Ion',
    description: 'Stacker elétrico compacto para estocagem vertical em corredores estreitos. Ideal para armazéns que necessitam de elevação com investimento acessível.',
    capacity: '1.200 kg',
    liftingHeight: '3.300 mm (3,3m)',
    batteryVoltage: '24V Li-Ion',
    chargingTime: '3 a 4 horas',
    turningRadius: '1.380 mm',
    image: 'https://cdn.ep-portal.net/products/attr_5/1760708717052-oi6361.webp',
    highlights: [
      'Elevação até 3,3 metros para estocagem vertical eficiente',
      'Bateria Li-Ion de longa duração com carregador incluso',
      'Patas ajustáveis para diferentes tamanhos de paletes',
      'Investimento acessível com baixo custo de manutenção'
    ]
  },
  {
    id: 'f4',
    slug: 'f4',
    title: 'Paleteira Elétrica F4',
    subtitle: 'Paleteira Compacta Li-Ion',
    description: 'A paleteira elétrica mais vendida da EP Equipment. Compacta, ergonômica e ideal para movimentação ágil em armazéns e centros de distribuição.',
    capacity: '1.500 kg',
    liftingHeight: '200 mm',
    batteryVoltage: '24V Li-Ion',
    chargingTime: '2 a 3 horas',
    turningRadius: '1.370 mm',
    image: 'https://cdn.ep-portal.net/products/attr_5/1757324457309-ket0ve.webp',
    highlights: [
      'Bateria Li-Ion integrada com recarga rápida de oportunidade',
      'Design ultra-compacto para operação em espaços reduzidos',
      'Sem manutenção de água ou ácido — 100% limpa e ecológica',
      'Controle ergonômico com comando tiller de alta precisão'
    ]
  }
]

export default function MonthlyHighlight() {
  const [selectedId, setSelectedId] = useState<string>('efl302b3')
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const phoneNumber = '+5549988395635'

  const currentItem = HIGHLIGHT_ITEMS.find((item) => item.id === selectedId) || HIGHLIGHT_ITEMS[0]

  const handleWhatsAppClick = (itemTitle: string) => {
    const text = `Olá! Vi o destaque no site da Venda Forte (${itemTitle}) e gostaria de receber a proposta comercial com as condições especiais.`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-white relative font-sans overflow-hidden">
      
      {/* Glow ambiental fluido de fundo */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider mb-3 px-3.5 py-1 bg-red-50 rounded-full border border-red-100 shadow-sm cursor-default"
          >
            <Sparkles size={14} className="animate-spin text-red-500" style={{ animationDuration: '6s' }} />
            <span>Destaque do Mês</span>
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Equipamentos em <span className="text-red-600">Destaque</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Modelos mais procurados com Bateria Íon-Lítio e pronta entrega.
          </p>
        </motion.div>

        {/* Seleção de Abas com Animação Fluida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {HIGHLIGHT_ITEMS.map((item) => {
            const isSelected = item.id === selectedId
            return (
              <motion.button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                  isSelected
                    ? 'text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-tab-highlight"
                    className="absolute inset-0 bg-red-600 rounded-full shadow-md shadow-red-600/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.id.toUpperCase()} ({item.capacity})</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Card Principal com Animações Vibrantes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-red-500/5 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Coluna Esquerda: Imagem Animada & Especificações */}
              <div className="md:col-span-5 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative w-full aspect-[4/3] flex items-center justify-center cursor-zoom-in group rounded-2xl bg-white p-2"
                  title="Clique para ampliar a imagem"
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                  />

                  {/* Badge de zoom ao passar o mouse */}
                  <div className="absolute bottom-3 right-3 bg-gray-900/80 hover:bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform translate-y-1 group-hover:translate-y-0">
                    <ZoomIn size={14} className="text-red-400" />
                    <span>Clique para ampliar</span>
                  </div>
                </motion.div>

                {/* Especificações Rápidas em Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 mt-4 text-xs font-semibold text-gray-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full justify-around"
                >
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Capacidade</span>
                    <span className="font-bold text-gray-900 text-sm">{currentItem.capacity}</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Elevação</span>
                    <span className="font-bold text-gray-900 text-sm">{currentItem.liftingHeight}</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Bateria</span>
                    <span className="font-bold text-red-600 text-sm">{currentItem.batteryVoltage}</span>
                  </div>
                </motion.div>
              </div>

              {/* Coluna Direita: Informações e Botões Animados */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-3"
                  >
                    <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {currentItem.title}
                    </p>
                    <p className="text-red-600 text-xs sm:text-sm font-bold mt-0.5">
                      {currentItem.subtitle}
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5"
                  >
                    {currentItem.description}
                  </motion.p>

                  {/* Lista de Diferenciais Animados */}
                  <ul className="space-y-2 mb-6">
                    {currentItem.highlights.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-center text-xs sm:text-sm text-gray-700 font-medium"
                      >
                        <CheckCircle2 size={16} className="text-red-600 mr-2 flex-shrink-0" />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Botões de Ação com Efeito Hover */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-100"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleWhatsAppClick(currentItem.title)}
                    className="flex-1 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Garantir Condição no WhatsApp</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={`/produtos/${currentItem.slug}`}
                      aria-label={`Ver especificações e ficha técnica completa da ${currentItem.title}`}
                      title={`Ficha Técnica - ${currentItem.title}`}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gray-900 hover:bg-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Ficha Técnica {currentItem.title}</span>
                      <ChevronRight size={16} />
                    </Link>
                  </motion.div>
                </motion.div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rodapé com Ícones Animados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-gray-500"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-default">
            <ShieldCheck size={16} className="text-red-600" />
            <span>Bateria Li-Ion com 5 Anos de Garantia</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-default">
            <Truck size={16} className="text-red-600" />
            <span>Entrega Técnica em Todo o Brasil</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-default">
            <Percent size={16} className="text-red-600" />
            <span>Financiamento Facilitado Direto e BNDES</span>
          </motion.div>
        </motion.div>

      </div>

      {/* Lightbox Modal de Imagem Ampliada */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc={currentItem.image}
        title={currentItem.title}
        subtitle={currentItem.subtitle}
        capacity={currentItem.capacity}
        liftingHeight={currentItem.liftingHeight}
        batteryVoltage={currentItem.batteryVoltage}
        slug={currentItem.slug}
      />
    </section>
  )
}
