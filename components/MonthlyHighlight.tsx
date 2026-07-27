'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Zap,
  Flame,
  ShieldCheck,
  BatteryCharging,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Truck,
  Sparkles,
  Tag,
  Percent
} from 'lucide-react'

interface HighlightItem {
  id: string
  slug: string
  badge: string
  title: string
  subtitle: string
  tagline: string
  capacity: string
  liftingHeight: string
  batteryVoltage: string
  chargingTime: string
  turningRadius: string
  promoTag: string
  savings: string
  image: string
  highlights: string[]
}

const HIGHLIGHT_ITEMS: HighlightItem[] = [
  {
    id: 'tvl151',
    slug: 'tvl151',
    badge: '🏆 Campeã de Vendas do Mês',
    title: 'Empilhadeira Elétrica TVL151',
    subtitle: 'Contrabalançada 3 Rodas Li-Ion 80V • 1.5 Toneladas',
    tagline: 'O modelo mais vendido para movimentação de cargas em corredores estreitos com tecnologia de lítio 80V e zero emissões.',
    capacity: '1.500 kg',
    liftingHeight: '5.000 mm (5,0m)',
    batteryVoltage: '80V Li-Ion',
    chargingTime: '1 a 2 horas (Zero Manutenção)',
    turningRadius: '1.450 mm',
    promoTag: 'Condição Especial do Mês',
    savings: 'Até 80% de Economia de Energia',
    image: 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp',
    highlights: [
      'Bateria Li-Ion 80V inclusa com até 5 anos de garantia de fábrica',
      'Tração dupla PMSM para excelente desempenho em rampas e pisos industriais',
      'Visão panorâmica ampla do operador com elevação suave e precisa',
      'Livre de manutenção de água/ácido e 100% ecológica (zero emissão)'
    ]
  },
  {
    id: 'tvl181',
    slug: 'tvl181',
    badge: '⚡ Alta Produtividade 1.8T',
    title: 'Empilhadeira Elétrica TVL181',
    subtitle: 'Contrabalançada 3 Rodas Li-Ion 80V • 1.8 Toneladas',
    tagline: 'Combina a manobrabilidade de 3 rodas com alta capacidade de elevação de até 6,0 metros em múltiplos turnos.',
    capacity: '1.800 kg',
    liftingHeight: '6.000 mm (6,0m)',
    batteryVoltage: '80V Li-Ion',
    chargingTime: '1,5 horas',
    turningRadius: '1.550 mm',
    promoTag: 'Bônus de Frete + Pronta Entrega',
    savings: 'Retorno de Investimento Rápido',
    image: 'https://cdn.ep-portal.net/products/attr_5/1762338440190-wx552t.webp',
    highlights: [
      'Capacidade estendida para 1.800 kg com alcance vertical de 6 metros',
      'Carga oportunidade rápida durante intervalos sem pausar a operação',
      'Aceleração inteligente e sistema de frenagem regenerativa',
      'Estrutura monobloco reforçada para operações logísticas intensas'
    ]
  },
  {
    id: 'tvl201',
    slug: 'tvl201',
    badge: '🏋️ Robusta & Pesada 2.0T',
    title: 'Empilhadeira Elétrica TVL201',
    subtitle: 'Contrabalançada 3 Rodas Li-Ion 80V • 2.0 Toneladas',
    tagline: 'O menor raio de giro da categoria para 2 toneladas com robustez máxima para estocagem pesada.',
    capacity: '2.000 kg',
    liftingHeight: '6.000 mm (6,0m)',
    batteryVoltage: '80V Li-Ion',
    chargingTime: '2 horas',
    turningRadius: '1.585 mm',
    promoTag: 'Financiamento Facililitado BNDES',
    savings: 'Menor Custo por Horário Trabalhado',
    image: 'https://cdn.ep-portal.net/products/attr_5/1762338605995-oge79k.webp',
    highlights: [
      'Capacidade nominal de 2.000 kg com raio de giro ultra reduzido',
      'Gerenciamento de bateria BMS inteligente com proteção total',
      'Redução automática de velocidade em curvas para segurança máxima',
      'Entrega técnica inclusa com treinamento do seu operador'
    ]
  }
]

export default function MonthlyHighlight() {
  const [selectedId, setSelectedId] = useState<string>('tvl151')
  const phoneNumber = '+5549988395635'

  const currentItem = HIGHLIGHT_ITEMS.find((item) => item.id === selectedId) || HIGHLIGHT_ITEMS[0]

  const handleWhatsAppClick = (itemTitle: string) => {
    const text = `Olá! Vi a Promoção do Mês no site da Venda Forte (${itemTitle}) e gostaria de receber a proposta comercial com as condições especiais.`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100 shadow-sm">
            <Flame className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Destaque & Oferta do Mês</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
            Promoção do Mês <span className="text-red-600">Venda Forte</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            Equipamentos de alta tecnologia industrial com <strong className="text-red-600 font-semibold">Bateria de Lítio 80V</strong> e pronta entrega em condições exclusivas.
          </p>
        </div>

        {/* Tab Selection Row for Featured Models */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {HIGHLIGHT_ITEMS.map((item) => {
            const isSelected = item.id === selectedId
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/25 scale-[1.02]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <Zap size={15} className={isSelected ? 'text-amber-300' : 'text-red-600'} />
                <span>{item.title.replace('Empilhadeira Elétrica EP ', '')}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  isSelected ? 'bg-red-700/80 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.capacity}
                </span>
              </button>
            )
          })}
        </div>

        {/* Main Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-gray-200/80 relative overflow-hidden"
          >
            {/* Top Red Bar */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Image Showcase */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                {/* Badges Bar */}
                <div className="w-full flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <Tag size={13} className="text-red-600" />
                    {currentItem.badge}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Truck size={13} className="text-emerald-600" />
                    Pronta Entrega
                  </span>
                </div>

                {/* Image Frame */}
                <div className="relative w-full aspect-[4/3] bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-center overflow-hidden group shadow-inner">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 border border-gray-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-gray-700 shadow-sm backdrop-blur-sm">
                    <span className="flex items-center gap-1 text-red-600 font-bold">
                      <BatteryCharging size={15} />
                      Bateria Li-Ion 80V
                    </span>
                    <span className="text-gray-500 text-[11px] font-semibold">Zero Manutenção</span>
                  </div>
                </div>

                {/* Quick Specs Cards */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-center">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Capacidade</span>
                    <span className="text-lg font-extrabold text-gray-900">{currentItem.capacity}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-center">
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Elevação Máxima</span>
                    <span className="text-lg font-extrabold text-gray-900">{currentItem.liftingHeight}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Information & Actions */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                
                <div>
                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                      {currentItem.title}
                    </h3>
                    <p className="text-red-600 text-sm sm:text-base font-bold mt-1">
                      {currentItem.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    {currentItem.tagline}
                  </p>

                  {/* Feature Highlights Box */}
                  <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-red-600" />
                      Diferenciais do Destaque de Promoção:
                    </h4>

                    <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                      {currentItem.highlights.map((point, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specs Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-100/80 border border-gray-200 text-xs mb-8">
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-500 uppercase">Tempo de Carga</span>
                      <span className="text-gray-900 font-bold">{currentItem.chargingTime}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-500 uppercase">Raio de Giro</span>
                      <span className="text-gray-900 font-bold">{currentItem.turningRadius}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block text-[10px] font-semibold text-gray-500 uppercase">Economia</span>
                      <span className="text-red-600 font-bold">{currentItem.savings}</span>
                    </div>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    onClick={() => handleWhatsAppClick(currentItem.title)}
                    className="flex-1 px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Garantir Condição no WhatsApp</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <Link
                    href={`/empilhadeiras-eletricas/${currentItem.slug}`}
                    className="px-6 py-3.5 sm:py-4 rounded-xl bg-gray-900 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <span>Ficha Técnica</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Guarantees Row */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-3">
            <ShieldCheck className="text-red-600 w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Bateria Li-Ion com 5 Anos de Garantia</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-3">
            <Truck className="text-amber-500 w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Entrega Técnica em Todo o Brasil</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-3">
            <Percent className="text-red-600 w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Financiamento Facilitado Direto e BNDES</span>
          </div>
        </div>

      </div>
    </section>
  )
}
