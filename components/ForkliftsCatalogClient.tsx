'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Zap, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  Layers,
  Truck,
  Box,
  Forklift,
  PackageCheck,
  ArrowDownUp,
  Cog
} from 'lucide-react'

export interface ForkliftProduct {
  id: string
  slug: string
  title: string
  subtitle: string
  category?: string
  categorySlug?: string
  type: string
  capacity: string
  liftingHeight: string
  batteryVoltage: string
  batteryType: string
  turningRadius: string
  travelSpeed: string
  description: string
  applications: string[]
  url: string
  mainImage: string
  galleryImages: string[]
  specs: Record<string, string | undefined>
  highlights: { title: string; desc: string }[]
}

interface Props {
  initialProducts: ForkliftProduct[]
}

const ITEMS_PER_PAGE = 12

export default function ForkliftsCatalogClient({ initialProducts }: Props) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rangeFilter, setRangeFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [liftHeightFilter, setLiftHeightFilter] = useState('all')
  const [voltageFilter, setVoltageFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const phoneNumber = '+5549988395635'

  const parseCapacityKg = (capacityStr: string): number => {
    if (!capacityStr) return 1500
    const match = capacityStr.replace(/\./g, '').match(/\d+/)
    return match ? parseInt(match[0], 10) : 1500
  }

  const parseLiftHeightMm = (liftStr: string): number => {
    if (!liftStr) return 4500
    const match = liftStr.replace(/\./g, '').match(/\d+/)
    return match ? parseInt(match[0], 10) : 4500
  }

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const searchLower = search.trim().toLowerCase()
      
      const matchesSearch = !searchLower || 
        p.title.toLowerCase().includes(searchLower) ||
        p.subtitle.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.slug.toLowerCase().includes(searchLower) ||
        (p.category && p.category.toLowerCase().includes(searchLower)) ||
        (p.type && p.type.toLowerCase().includes(searchLower)) ||
        (p.capacity && p.capacity.toLowerCase().includes(searchLower))

      let matchesCategory = true
      if (categoryFilter !== 'all') {
        matchesCategory = p.category === categoryFilter || p.categorySlug === categoryFilter
      }

      const typeLower = (p.type + ' ' + (p.category || '') + ' ' + p.subtitle + ' ' + p.description + ' ' + p.title).toLowerCase()
      let matchesRange = true
      if (rangeFilter === 'pallet_trucks') {
        matchesRange = typeLower.includes('paleteira') || (p.categorySlug === 'paleteiras-eletricas')
      } else if (rangeFilter === 'stackers') {
        matchesRange = typeLower.includes('patolada') || typeLower.includes('stacker') || (p.categorySlug === 'empilhadeiras-patoladas')
      } else if (rangeFilter === '3wheel') {
        matchesRange = typeLower.includes('3 roda') || typeLower.includes('3-roda') || typeLower.includes('3 wheel') ||
                       p.title.toLowerCase().startsWith('tvl') || p.title.toLowerCase().startsWith('tcl') || p.title.toLowerCase().startsWith('efs')
      } else if (rangeFilter === '4wheel') {
        matchesRange = (typeLower.includes('4 roda') || p.categorySlug === 'empilhadeiras-eletricas') && !typeLower.includes('3 roda')
      } else if (rangeFilter === 'reach') {
        matchesRange = typeLower.includes('retrátil') || typeLower.includes('reach') || (p.categorySlug === 'empilhadeiras-retrateis')
      } else if (rangeFilter === 'pickers') {
        matchesRange = typeLower.includes('selecionadora') || typeLower.includes('rebocador') || (p.categorySlug === 'selecionadoras-pedidos')
      } else if (rangeFilter === 'special') {
        matchesRange = typeLower.includes('vna') || typeLower.includes('especial') || typeLower.includes('agv') || typeLower.includes('amr') || (p.categorySlug === 'equipamentos-especiais')
      } else if (rangeFilter === 'high_hv') {
        matchesRange = p.batteryVoltage.includes('80') || p.title.toLowerCase().includes('hv') || p.subtitle.includes('80V')
      }

      const capKg = parseCapacityKg(p.capacity)
      let matchesCapacity = true
      if (capacityFilter === 'under_1500') matchesCapacity = capKg <= 1500
      else if (capacityFilter === '1600_2500') matchesCapacity = capKg >= 1600 && capKg <= 2500
      else if (capacityFilter === '3000_5000') matchesCapacity = capKg >= 3000 && capKg <= 5000
      else if (capacityFilter === 'over_5000') matchesCapacity = capKg > 5000

      const liftMm = parseLiftHeightMm(p.liftingHeight)
      let matchesLift = true
      if (liftHeightFilter === 'under_4500') matchesLift = liftMm <= 4500
      else if (liftHeightFilter === '5000_6000') matchesLift = liftMm >= 5000 && liftMm <= 6000
      else if (liftHeightFilter === 'over_6000') matchesLift = liftMm > 6000

      const voltageClean = ((p.batteryVoltage || '') + ' ' + (p.title || '') + ' ' + (p.subtitle || '')).replace(/\s+/g, '').toLowerCase()
      let matchesVoltage = true
      if (voltageFilter === '80V') {
        matchesVoltage = voltageClean.includes('80v') || voltageClean.includes('80 v')
      } else if (voltageFilter === 'low_voltage') {
        matchesVoltage = voltageClean.includes('48v') || voltageClean.includes('48 v') || voltageClean.includes('24v') || voltageClean.includes('24 v') || voltageClean.includes('leadacid')
      }

      return matchesSearch && matchesCategory && matchesRange && matchesCapacity && matchesLift && matchesVoltage
    })
  }, [initialProducts, search, categoryFilter, rangeFilter, capacityFilter, liftHeightFilter, voltageFilter])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const handleResetFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setRangeFilter('all')
    setCapacityFilter('all')
    setLiftHeightFilter('all')
    setVoltageFilter('all')
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    const gridEl = document.getElementById('catalog-grid')
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleWhatsAppQuote = (productTitle: string) => {
    const message = `Olá! Gostaria de solicitar um orçamento para o modelo: ${productTitle}.`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900 pt-24 pb-20 font-sans">
      
      {/* Hero Section - Redesigned with Rich Content */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-red-50/30 to-white py-16 sm:py-20 border-b-2 border-gray-200/60">
        {/* Decorative Elements */}
        <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/8 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start mb-12">
            
            {/* Left Content - Main Text */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-extrabold uppercase tracking-wider mb-5 shadow-lg shadow-red-600/30">
                  <Zap size={16} className="animate-pulse" />
                  Linha Completa EP Equipment
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                  Catálogo Completo de{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
                    Equipamentos
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 font-normal">
                  Descubra a linha completa de <strong className="text-gray-900 font-semibold">empilhadeiras elétricas íon-lítio</strong> da EP Equipment. Navegue por categorias, compare capacidades e elevação, e encontre o equipamento ideal para cada operação logística.
                </p>

                {/* Key Features Grid */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <Forklift size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm mb-1">Contrabalançadas 3R & 4R</h3>
                      <p className="text-xs text-gray-600">Modelos de 1.5t a 3.5t com tecnologia Li-Ion</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm mb-1">Paleteiras & Stackers</h3>
                      <p className="text-xs text-gray-600">Movimentação horizontal e vertical eficiente</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <ArrowDownUp size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm mb-1">Retráteis (Reach Trucks)</h3>
                      <p className="text-xs text-gray-600">Alta elevação para armazéns verticais</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <PackageCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm mb-1">Selecionadoras & Rebocadores</h3>
                      <p className="text-xs text-gray-600">Picking vertical e transporte de cargas</p>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                      <Layers size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Modelos</div>
                      <div className="text-lg font-extrabold">{initialProducts.length}+</div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-700" />

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                      <Zap size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Tecnologia</div>
                      <div className="text-sm font-extrabold">Li-Ion 80V/48V/24V</div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-700" />

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Dealer</div>
                      <div className="text-sm font-extrabold">Autorizado EP</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Enhanced Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-8 shadow-2xl">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full" />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-100">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <img 
                        src="/logo.png" 
                        alt="Venda Forte" 
                        className="w-full h-full object-contain rounded-xl drop-shadow-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-xl">Venda Forte</h3>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Dealer Oficial EP Equipment</p>
                    </div>
                  </div>

                  {/* Info Blocks */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-red-50 to-transparent rounded-xl p-4 border border-red-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Catálogo Completo</span>
                        <Layers size={16} className="text-red-600" />
                      </div>
                      <p className="text-2xl font-extrabold text-gray-900">{initialProducts.length} <span className="text-base text-gray-600 font-semibold">Equipamentos</span></p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-transparent rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Linha de Produtos</span>
                        <Box size={16} className="text-gray-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 leading-relaxed">Paleteiras • Stackers • Empilhadeiras • Retráteis</p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-transparent rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tecnologia Avançada</span>
                        <Zap size={16} className="text-gray-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Íon-Lítio 24V / 48V / 80V</p>
                      <p className="text-xs text-gray-600 mt-1">Recarga rápida & Zero emissões</p>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gray-900 rounded-2xl p-5 text-center">
                    <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">Precisa de Ajuda?</p>
                    <a
                      href="#contact"
                      className="block w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm transition-colors shadow-lg shadow-red-600/30"
                    >
                      Fale com Especialista
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-1">Use os Filtros Avançados</h3>
                  <p className="text-sm text-gray-600">Filtre por categoria, capacidade, elevação máxima e voltagem da bateria</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 size={14} className="text-red-600" />
                  <span>Estoque Próprio</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 size={14} className="text-red-600" />
                  <span>Assistência 24/7</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 size={14} className="text-red-600" />
                  <span>Peças Originais</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Category Range Bar Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
          <button
            onClick={() => { setCategoryFilter('all'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'all' && rangeFilter === 'all'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Layers size={14} />
            <span>Todos ({initialProducts.length})</span>
          </button>

          <button
            onClick={() => { setCategoryFilter('Paleteiras Elétricas'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'Paleteiras Elétricas'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Truck size={14} className="text-red-500" />
            <span>Paleteiras</span>
          </button>
          
          <button
            onClick={() => { setCategoryFilter('Empilhadeiras Patoladas (Stackers)'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'Empilhadeiras Patoladas (Stackers)'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Box size={14} className="text-red-500" />
            <span>Stackers</span>
          </button>

          <button
            onClick={() => { setCategoryFilter('Empilhadeiras Contrabalançadas'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'Empilhadeiras Contrabalançadas'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Forklift size={14} className="text-red-500" />
            <span>Contrabalançadas</span>
          </button>

          <button
            onClick={() => { setCategoryFilter('Empilhadeiras Retráteis (Reach Trucks)'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'Empilhadeiras Retráteis (Reach Trucks)'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowDownUp size={14} className="text-red-500" />
            <span>Retráteis</span>
          </button>

          <button
            onClick={() => { setCategoryFilter('Selecionadoras de Pedidos & Rebocadores'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'Selecionadoras de Pedidos & Rebocadores'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <PackageCheck size={14} className="text-red-500" />
            <span>Selecionadoras & Rebocadores</span>
          </button>

          <button
            onClick={() => { setCategoryFilter('Equipamentos Especiais & VNA'); setRangeFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              categoryFilter === 'Equipamentos Especiais & VNA'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Cog size={14} className="text-red-500" />
            <span>VNA & Especiais</span>
          </button>
        </div>
      </section>

      {/* Filter Sidebar & Product Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="catalog-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-lg space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-red-600" />
                Filtros de Busca
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={12} />
                Limpar
              </button>
            </div>

            {/* Search Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search / Busca</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Modelo (ex: DS3, F4, EFL302B3)..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Categoria de Equipamento</label>
              <select
                value={categoryFilter}
                onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Paleteiras Elétricas">Paleteiras Elétricas</option>
                <option value="Empilhadeiras Patoladas (Stackers)">Empilhadeiras Patoladas (Stackers)</option>
                <option value="Empilhadeiras Contrabalançadas">Empilhadeiras Contrabalançadas</option>
                <option value="Empilhadeiras Retráteis (Reach Trucks)">Empilhadeiras Retráteis (Reach Trucks)</option>
                <option value="Selecionadoras de Pedidos & Rebocadores">Selecionadoras & Rebocadores</option>
                <option value="Equipamentos Especiais & VNA">Equipamentos Especiais & VNA</option>
              </select>
            </div>

            {/* Load Capacity Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Capacidade de Carga</label>
              <select
                value={capacityFilter}
                onChange={e => { setCapacityFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              >
                <option value="all">Todas as Capacidades</option>
                <option value="under_1500">Até 1.500 kg (1.5T)</option>
                <option value="1600_2500">1.600 kg a 2.500 kg (1.6T - 2.5T)</option>
                <option value="3000_5000">3.000 kg a 5.000 kg (3.0T - 5.0T)</option>
                <option value="over_5000">Acima de 5.000 kg (5.0T+)</option>
              </select>
            </div>

            {/* Max Lift Height Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Elevação Máxima</label>
              <select
                value={liftHeightFilter}
                onChange={e => { setLiftHeightFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              >
                <option value="all">Todas as Alturas</option>
                <option value="under_4500">Até 4.500 mm (4,5m)</option>
                <option value="5000_6000">5.000 mm a 6.000 mm (5m - 6m)</option>
                <option value="over_6000">Acima de 6.000 mm (+6m)</option>
              </select>
            </div>

            {/* Battery Voltage Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Voltagem da Bateria</label>
              <select
                value={voltageFilter}
                onChange={e => { setVoltageFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              >
                <option value="all">Todas as Voltagens</option>
                <option value="80V">High Voltage (80V)</option>
                <option value="low_voltage">Low Voltage (48V / 24V)</option>
              </select>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase shadow transition-colors"
              >
                Filtrar
              </button>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase transition-colors"
              >
                Reset
              </button>
            </div>

          </div>

          {/* Main Product Cards Column */}
          <div className="lg:col-span-9">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Exibindo <span className="font-extrabold text-gray-900">
                  {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                </span> de <span className="font-bold text-gray-900">{filteredProducts.length}</span> modelos encontrados ({initialProducts.length} total)
              </p>

              <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                Página {currentPage} de {totalPages}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                <Search className="mx-auto text-gray-400 mb-4" size={44} />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum equipamento encontrado</h3>
                <p className="text-sm text-gray-500 mb-4">Tente selecionar outro critério de busca ou resetar os filtros.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs shadow hover:bg-red-700 transition-colors"
                >
                  Resetar Todos os Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white border border-gray-200/90 hover:border-red-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        {/* Image Frame */}
                        <div className="relative aspect-[4/3] bg-white rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                          <span className="absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase shadow-sm">
                            {product.batteryVoltage} Li-Ion
                          </span>

                          {product.category && (
                            <span className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded bg-slate-900/80 text-white font-medium text-[9px] uppercase backdrop-blur-sm shadow-sm">
                              {product.category.replace('Empilhadeiras ', '').replace('Paleteiras ', 'Paleteira ')}
                            </span>
                          )}

                          <img
                            src={product.mainImage}
                            alt={product.title}
                            loading="lazy"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            style={{ mixBlendMode: 'multiply' }}
                            onError={(e) => {
                              e.currentTarget.src = 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp'
                            }}
                          />
                        </div>

                        <div className="mb-2">
                          <h3 className="font-extrabold text-gray-900 text-xl group-hover:text-red-600 transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-xs text-red-600 font-bold line-clamp-1 mt-0.5">
                            {product.subtitle.replace(/^Empilhadeira Elétrica EP /i, 'Empilhadeira Elétrica ').replace(/^Paleteira Elétrica EP /i, 'Paleteira Elétrica ').replace(/^Empilhadeira Patolada EP /i, 'Empilhadeira Patolada ').replace(/^EP Equipment /i, '')}
                          </p>
                        </div>

                        {/* Specs Box */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 mb-4">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-400">Capacidade</span>
                            <span className="font-extrabold text-gray-900">{product.capacity}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-gray-400">Elevação</span>
                            <span className="font-extrabold text-gray-900">{product.liftingHeight}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 mt-2">
                        <Link
                          href={`/empilhadeiras-eletricas/${product.slug}`}
                          aria-label={`Ver especificações completas e ficha técnica da ${product.title}`}
                          title={`Ficha Técnica - ${product.title}`}
                          className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
                        >
                          <span>Ficha Técnica {product.title.replace(/^Empilhadeira Elétrica /i, '')}</span>
                          <ChevronRight size={14} />
                        </Link>

                        <button
                          onClick={() => handleWhatsAppQuote(product.title)}
                          className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          <span>Orçamento</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Section - Redesigned with Content */}
                {totalPages > 1 && (
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-16 relative"
                  >
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-slate-50 rounded-3xl -z-10" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10" />
                    
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/70 rounded-3xl p-8 sm:p-10 shadow-2xl">
                      
                      {/* Header Section */}
                      <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 mb-4">
                          <Layers size={16} className="text-red-600" />
                          <span className="text-xs font-extrabold uppercase tracking-wider text-red-700">Navegação do Catálogo</span>
                        </div>
                        
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                          Explore Mais <span className="text-red-600">Equipamentos</span>
                        </h3>
                        
                        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                          Navegue pelo catálogo completo da <strong className="text-gray-900">EP Equipment</strong> com mais de <strong className="text-red-600">{initialProducts.length} modelos</strong> de empilhadeiras elétricas, paleteiras, stackers e retráteis. Use os filtros ao lado para encontrar o equipamento ideal para sua operação.
                        </p>

                        {/* Current Status */}
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl">
                            <span className="text-gray-500 font-medium">Página Atual:</span>
                            <span className="text-red-600 font-extrabold text-base">{currentPage}</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 font-bold">{totalPages}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl">
                            <span className="text-gray-500 font-medium">Visualizando:</span>
                            <span className="text-gray-900 font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span>
                            <span className="text-gray-500">de {filteredProducts.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                        
                        {/* Previous Button */}
                        <motion.button
                          whileHover={{ scale: currentPage === 1 ? 1 : 1.03 }}
                          whileTap={{ scale: currentPage === 1 ? 1 : 0.97 }}
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`w-full lg:w-auto min-w-[180px] px-6 py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-3 transition-all duration-300 ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                              : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-red-600 hover:to-red-700 text-white border-2 border-gray-900 hover:border-red-600 shadow-lg shadow-gray-900/20 hover:shadow-red-600/30'
                          }`}
                        >
                          <ChevronLeft size={20} className="flex-shrink-0" />
                          <div className="text-left">
                            <div className="text-[10px] opacity-70 uppercase tracking-wider">Página</div>
                            <div>Anterior</div>
                          </div>
                        </motion.button>

                        {/* Page Numbers with Enhanced Design */}
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                          {getPageNumbers().map((p, idx) => (
                            typeof p === 'number' ? (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: currentPage === p ? 1 : 1.15, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => goToPage(p)}
                                className={`relative min-w-[52px] h-[52px] px-4 rounded-2xl text-base font-extrabold transition-all duration-300 ${
                                  currentPage === p
                                    ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl shadow-red-600/40 scale-110'
                                    : 'bg-white text-gray-700 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:text-red-600 border-2 border-gray-200 hover:border-red-300 shadow-md hover:shadow-lg'
                                }`}
                              >
                                {currentPage === p && (
                                  <motion.div
                                    layoutId="activePage"
                                    className="absolute inset-0 rounded-2xl ring-4 ring-red-600/30 ring-offset-2"
                                  />
                                )}
                                <span className="relative z-10">{p}</span>
                              </motion.button>
                            ) : (
                              <span key={idx} className="px-2 text-lg font-extrabold text-gray-300">
                                ···
                              </span>
                            )
                          ))}
                        </div>

                        {/* Next Button */}
                        <motion.button
                          whileHover={{ scale: currentPage === totalPages ? 1 : 1.03 }}
                          whileTap={{ scale: currentPage === totalPages ? 1 : 0.97 }}
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`w-full lg:w-auto min-w-[180px] px-6 py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-3 transition-all duration-300 ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                              : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-red-600 hover:to-red-700 text-white border-2 border-gray-900 hover:border-red-600 shadow-lg shadow-gray-900/20 hover:shadow-red-600/30'
                          }`}
                        >
                          <div className="text-right">
                            <div className="text-[10px] opacity-70 uppercase tracking-wider">Página</div>
                            <div>Próxima</div>
                          </div>
                          <ChevronRight size={20} className="flex-shrink-0" />
                        </motion.button>

                      </div>

                      {/* Footer Info with CTA */}
                      <div className="pt-6 border-t-2 border-gray-100">
                        <div className="grid sm:grid-cols-2 gap-4">
                          
                          {/* Info Box */}
                          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                                <Zap size={20} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-gray-900 text-sm mb-1">Não encontrou o modelo ideal?</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Use os filtros ao lado ou entre em contato para uma consultoria personalizada.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Quick Action Box */}
                          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-5 border border-red-200">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <CheckCircle2 size={20} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-gray-900 text-sm mb-1">Suporte Especializado EP</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Dealer oficial com estoque, assistência técnica e peças originais.
                                </p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </motion.section>
                )}
              </>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
