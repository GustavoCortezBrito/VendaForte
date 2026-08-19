'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Zap, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  SlidersHorizontal, 
  RotateCcw, 
  Layers, 
  Truck, 
  Box, 
  Forklift, 
  PackageCheck, 
  ArrowDownUp, 
  Cog, 
  ZoomIn,
  X,
  Scale,
  ArrowUpFromLine,
  Filter,
  BatteryCharging,
  Gauge
} from 'lucide-react'
import ImageLightboxModal from '@/components/ImageLightboxModal'

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

const CATEGORIES_CONFIG = [
  { id: 'all', label: 'Todos os Modelos', icon: Layers },
  { id: 'Paleteiras Elétricas', label: 'Paleteiras', icon: Truck },
  { id: 'Empilhadeiras Patoladas (Stackers)', label: 'Stackers', icon: Box },
  { id: 'Empilhadeiras Contrabalançadas', label: 'Contrabalançadas', icon: Forklift },
  { id: 'Empilhadeiras Retráteis (Reach Trucks)', label: 'Retráteis', icon: ArrowDownUp },
  { id: 'Selecionadoras de Pedidos & Rebocadores', label: 'Order Pickers & Rebocadores', icon: PackageCheck },
  { id: 'Equipamentos Especiais & VNA', label: 'Outros (VNA & Especiais)', icon: Cog },
]

export default function ForkliftsCatalogClient({ initialProducts }: Props) {
  const [activeLightboxProduct, setActiveLightboxProduct] = useState<ForkliftProduct | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rangeFilter, setRangeFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [liftHeightFilter, setLiftHeightFilter] = useState('all')
  const [voltageFilter, setVoltageFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (!categoriesRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = categoriesRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoriesRef.current) return
    const amount = 240
    categoriesRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    })
  }

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

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProducts.length }
    initialProducts.forEach(p => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1
      }
    })
    return counts
  }, [initialProducts])

  // Filtered Products
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
        if (categoryFilter === 'Equipamentos Especiais & VNA' || categoryFilter === 'Outros') {
          matchesCategory = p.category === 'Equipamentos Especiais & VNA' || 
            Boolean(p.category && (p.category.includes('Especial') || p.category.includes('VNA') || p.category.includes('Outros'))) ||
            !p.category
        } else if (categoryFilter === 'Selecionadoras de Pedidos & Rebocadores') {
          matchesCategory = p.category === 'Selecionadoras de Pedidos & Rebocadores' ||
            Boolean(p.category && (p.category.includes('Selecionadora') || p.category.includes('Rebocador')))
        } else {
          matchesCategory = p.category === categoryFilter || p.categorySlug === categoryFilter
        }
      }

      // Range Filter (Série)
      let matchesRange = true
      const typeLower = (p.type + ' ' + (p.category || '') + ' ' + p.subtitle + ' ' + p.description + ' ' + p.title).toLowerCase()
      if (rangeFilter === '3wheel') {
        matchesRange = typeLower.includes('3 roda') || typeLower.includes('3-roda') || typeLower.includes('3 wheel') ||
                       p.title.toLowerCase().startsWith('tvl') || p.title.toLowerCase().startsWith('tcl') || p.title.toLowerCase().startsWith('efs')
      } else if (rangeFilter === '4wheel') {
        matchesRange = (typeLower.includes('4 roda') || p.categorySlug === 'empilhadeiras-eletricas' || typeLower.includes('contrabalançada')) && !typeLower.includes('3 roda')
      } else if (rangeFilter === 'pedestrian') {
        matchesRange = typeLower.includes('pedestrian') || typeLower.includes('walkie') || typeLower.includes('a pé') || typeLower.includes('f4') || typeLower.includes('epl')
      } else if (rangeFilter === 'rider') {
        matchesRange = typeLower.includes('rider') || typeLower.includes('embarcado') || typeLower.includes('plataforma') || typeLower.includes('stand-on')
      } else if (rangeFilter === 'high_voltage') {
        matchesRange = p.batteryVoltage.includes('80') || p.batteryVoltage.includes('309') || p.title.toLowerCase().includes('hv') || p.subtitle.includes('80V')
      }

      // Capacity Filter
      const capKg = parseCapacityKg(p.capacity)
      let matchesCapacity = true
      if (capacityFilter === 'under_1500') matchesCapacity = capKg <= 1500
      else if (capacityFilter === '1600_2000') matchesCapacity = capKg >= 1600 && capKg <= 2000
      else if (capacityFilter === '2500_3500') matchesCapacity = capKg >= 2500 && capKg <= 3500
      else if (capacityFilter === '4000_5000') matchesCapacity = capKg >= 4000 && capKg <= 5000
      else if (capacityFilter === 'over_5000') matchesCapacity = capKg > 5000

      // Lift Height Filter
      const liftMm = parseLiftHeightMm(p.liftingHeight)
      let matchesLift = true
      if (liftHeightFilter === 'under_2000') matchesLift = liftMm <= 2000
      else if (liftHeightFilter === '2500_4500') matchesLift = liftMm >= 2500 && liftMm <= 4500
      else if (liftHeightFilter === '5000_6500') matchesLift = liftMm >= 5000 && liftMm <= 6500
      else if (liftHeightFilter === 'over_7000') matchesLift = liftMm >= 7000

      // Battery Voltage Filter
      const voltageClean = ((p.batteryVoltage || '') + ' ' + (p.title || '') + ' ' + (p.subtitle || '')).replace(/\s+/g, '').toLowerCase()
      let matchesVoltage = true
      if (voltageFilter === '24V') {
        matchesVoltage = voltageClean.includes('24v') || voltageClean.includes('2x12v')
      } else if (voltageFilter === '48V') {
        matchesVoltage = voltageClean.includes('48v')
      } else if (voltageFilter === '80V') {
        matchesVoltage = voltageClean.includes('80v')
      } else if (voltageFilter === 'high_voltage') {
        matchesVoltage = voltageClean.includes('80v') || voltageClean.includes('96v') || voltageClean.includes('309v')
      }

      return matchesSearch && matchesCategory && matchesRange && matchesCapacity && matchesLift && matchesVoltage
    })
  }, [initialProducts, search, categoryFilter, rangeFilter, capacityFilter, liftHeightFilter, voltageFilter])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, rangeFilter, capacityFilter, liftHeightFilter, voltageFilter])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const hasActiveFilters = search || categoryFilter !== 'all' || rangeFilter !== 'all' || capacityFilter !== 'all' || liftHeightFilter !== 'all' || voltageFilter !== 'all'

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
    const gridEl = document.getElementById('catalog-products-top')
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleWhatsAppQuote = (productTitle: string) => {
    const message = `Olá! Gostaria de solicitar um orçamento para o equipamento EP: ${productTitle}.`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      
      if (currentPage < totalPages - 2) pages.push('...')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pt-20 pb-20 font-sans">
      
      {/* Top Breadcrumbs & Page Header */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
            <Link href="/" className="hover:text-red-600 transition-colors">Início</Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-900 font-bold">Produtos</span>
          </nav>

          {/* Title row */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-100">
              <Zap size={13} className="text-red-600" />
              <span>Dealer Oficial EP Equipment • Tecnologia Íon-Lítio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Produtos & Equipamentos
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Explore {initialProducts.length} modelos de empilhadeiras elétricas, paleteiras, stackers, retráteis e equipamentos para intralogística.
            </p>
          </div>

        </div>
      </div>

      {/* STICKY TOOLBAR (Categories & Search Bar that follow on scroll) */}
      <div className="sticky top-[64px] sm:top-[70px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Horizontal Category Navigation Bar with Proportional Scroll and Arrows */}
          <div className="relative flex items-center flex-1 min-w-0">
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollCategories('left')}
              className={`hidden sm:flex absolute left-0 z-10 w-7 h-7 -ml-2 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-red-600 shadow-md border border-slate-200 items-center justify-center transition-all ${
                canScrollLeft ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
              }`}
              title="Rolar para a esquerda"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable Container with Proportional Micro-Scrollbar */}
            <div
              ref={categoriesRef}
              className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-proportional flex-1 min-w-0"
            >
              {CATEGORIES_CONFIG.map((cat) => {
                const Icon = cat.icon
                const isSelected = categoryFilter === cat.id
                const count = cat.id === 'all' 
                  ? initialProducts.length 
                  : cat.id === 'Equipamentos Especiais & VNA'
                    ? (categoryCounts['Equipamentos Especiais & VNA'] || 1)
                    : (categoryCounts[cat.id] || 0)

                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={13} className={isSelected ? 'text-white' : 'text-red-600'} />
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollCategories('right')}
              className={`hidden sm:flex absolute right-0 z-10 w-7 h-7 -mr-2 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-red-600 shadow-md border border-slate-200 items-center justify-center transition-all ${
                canScrollRight ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
              }`}
              title="Rolar para a direita"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Search Box inside Sticky Bar */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Buscar modelo (ex: F4, DS3, EFL302B3)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all shadow-xs font-medium"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" id="catalog-products-top">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar (Desktop) matching EP Equipment filters */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 sticky top-36">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-red-600" />
                Filtros do Catálogo
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={11} />
                  Limpar
                </button>
              )}
            </div>

            {/* Categories Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Categoria (Categories)
              </label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Paleteiras Elétricas">Paleteiras Elétricas</option>
                <option value="Empilhadeiras Patoladas (Stackers)">Empilhadeiras Patoladas (Stackers)</option>
                <option value="Empilhadeiras Contrabalançadas">Empilhadeiras Contrabalançadas</option>
                <option value="Empilhadeiras Retráteis (Reach Trucks)">Empilhadeiras Retráteis (Reach Trucks)</option>
                <option value="Selecionadoras de Pedidos & Rebocadores">Selecionadoras & Rebocadores</option>
                <option value="Equipamentos Especiais & VNA">Outros (VNA & Especiais)</option>
              </select>
            </div>

            {/* Range / Série (EP Filter) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Linha / Série (Range)
              </label>
              <select
                value={rangeFilter}
                onChange={e => setRangeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              >
                <option value="all">Todas as Séries</option>
                <option value="3wheel">3 Rodas (3-Wheel Forklift)</option>
                <option value="4wheel">4 Rodas (4-Wheel Forklift)</option>
                <option value="pedestrian">Operador a Pé (Pedestrian / Walkie)</option>
                <option value="rider">Operador Embarcado (Rider / Stand-on)</option>
                <option value="high_voltage">Alta Voltagem Li-Ion (80V+)</option>
              </select>
            </div>

            {/* Capacity Filter (Load Capacity) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Capacidade de Carga (Load Capacity)
              </label>
              <select
                value={capacityFilter}
                onChange={e => setCapacityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              >
                <option value="all">Todas as Capacidades</option>
                <option value="under_1500">Até 1.500 kg (1.5t)</option>
                <option value="1600_2000">1.600 kg a 2.000 kg (1.6t - 2.0t)</option>
                <option value="2500_3500">2.500 kg a 3.500 kg (2.5t - 3.5t)</option>
                <option value="4000_5000">4.000 kg a 5.000 kg (4.0t - 5.0t)</option>
                <option value="over_5000">Acima de 5.000 kg (+5.0t)</option>
              </select>
            </div>

            {/* Max Lift Height Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Elevação Máxima (Max. Lift Height)
              </label>
              <select
                value={liftHeightFilter}
                onChange={e => setLiftHeightFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              >
                <option value="all">Todas as Alturas</option>
                <option value="under_2000">Até 2.000 mm (2,0m)</option>
                <option value="2500_4500">2.500 mm a 4.500 mm (2,5m - 4,5m)</option>
                <option value="5000_6500">5.000 mm a 6.500 mm (5,0m - 6,5m)</option>
                <option value="over_7000">Acima de 7.000 mm (+7,0m)</option>
              </select>
            </div>

            {/* Battery Voltage Filter (Battery Capacity) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bateria & Voltagem (Battery Capacity)
              </label>
              <select
                value={voltageFilter}
                onChange={e => setVoltageFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              >
                <option value="all">Todas as Voltagens</option>
                <option value="24V">24V Li-Ion</option>
                <option value="48V">48V Li-Ion</option>
                <option value="80V">80V Li-Ion (High Voltage)</option>
                <option value="high_voltage">Alta Tensão (+80V / 309V)</option>
              </select>
            </div>

            {/* FILTER & RESET Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
              >
                Filtrar
              </button>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                title="Resetar todos os filtros"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Support Callout */}
            <div className="pt-2 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-900">Dúvida no dimensionamento?</p>
                <p className="text-[11px] leading-relaxed">Nossos especialistas ajudam você a escolher o modelo ideal.</p>
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent('Olá! Gostaria de uma consultoria para escolher o equipamento EP ideal.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold text-[11px] pt-0.5"
                >
                  <span>Falar no WhatsApp</span>
                  <ChevronRight size={12} />
                </a>
              </div>
            </div>

          </aside>

          {/* Main Products Grid Column */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Results Header Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-extrabold text-slate-900 text-sm">
                  {filteredProducts.length}
                </span>
                <span>{filteredProducts.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}</span>
                {hasActiveFilters && (
                  <span className="hidden sm:inline text-red-600 font-semibold">• filtros aplicados</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Filter size={13} className="text-red-600" />
                  <span>Filtros {hasActiveFilters && '•'}</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Resetar</span>
                  </button>
                )}

                <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden bg-white border border-slate-200 rounded-2xl p-4 shadow-md space-y-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-xs text-slate-900 uppercase">Filtros de Busca</h3>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="text-xs font-bold text-red-600 flex items-center gap-1"
                        >
                          <RotateCcw size={11} />
                          Reset
                        </button>
                      )}
                      <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoria</label>
                      <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                      >
                        <option value="all">Todas as Categorias</option>
                        <option value="Paleteiras Elétricas">Paleteiras Elétricas</option>
                        <option value="Empilhadeiras Patoladas (Stackers)">Stackers / Patoladas</option>
                        <option value="Empilhadeiras Contrabalançadas">Empilhadeiras Contrabalançadas</option>
                        <option value="Empilhadeiras Retráteis (Reach Trucks)">Retráteis</option>
                        <option value="Selecionadoras de Pedidos & Rebocadores">Selecionadoras & Rebocadores</option>
                        <option value="Equipamentos Especiais & VNA">Outros (VNA & Especiais)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Linha / Série</label>
                      <select
                        value={rangeFilter}
                        onChange={e => setRangeFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                      >
                        <option value="all">Todas as Séries</option>
                        <option value="3wheel">3 Rodas</option>
                        <option value="4wheel">4 Rodas</option>
                        <option value="pedestrian">Operador a Pé</option>
                        <option value="rider">Operador Embarcado</option>
                        <option value="high_voltage">Alta Voltagem (80V+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Capacidade</label>
                      <select
                        value={capacityFilter}
                        onChange={e => setCapacityFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                      >
                        <option value="all">Todas as Capacidades</option>
                        <option value="under_1500">Até 1.500 kg</option>
                        <option value="1600_2000">1.600 - 2.000 kg</option>
                        <option value="2500_3500">2.500 - 3.500 kg</option>
                        <option value="4000_5000">4.000 - 5.000 kg</option>
                        <option value="over_5000">+5.000 kg</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Elevação</label>
                      <select
                        value={liftHeightFilter}
                        onChange={e => setLiftHeightFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                      >
                        <option value="all">Todas as Alturas</option>
                        <option value="under_2000">Até 2.000 mm</option>
                        <option value="2500_4500">2.500 - 4.500 mm</option>
                        <option value="5000_6500">5.000 - 6.500 mm</option>
                        <option value="over_7000">+7.000 mm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Voltagem</label>
                      <select
                        value={voltageFilter}
                        onChange={e => setVoltageFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                      >
                        <option value="all">Todas as Voltagens</option>
                        <option value="24V">24V Li-Ion</option>
                        <option value="48V">48V Li-Ion</option>
                        <option value="80V">80V Li-Ion</option>
                        <option value="high_voltage">Alta Voltagem (+80V / 309V)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
                    >
                      Ver Resultados ({filteredProducts.length})
                    </button>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
                    >
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                <Search className="mx-auto text-slate-300 mb-3" size={38} />
                <h3 className="text-base font-bold text-slate-900 mb-1">Nenhum equipamento encontrado</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Tente alterar os termos de busca ou redefinir os filtros selecionados.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs shadow-xs hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Resetar Todos os Filtros</span>
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid (3 cols on large, 2 on medium, 1 on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {paginatedProducts.map((product) => {
                    const cleanSubtitle = product.subtitle
                      .replace(/^Empilhadeira Elétrica EP /i, '')
                      .replace(/^Paleteira Elétrica EP /i, '')
                      .replace(/^Empilhadeira Patolada EP /i, '')
                      .replace(/^EP Equipment /i, '')

                    const categoryClean = product.category
                      ? product.category.replace('Empilhadeiras ', '').replace('Paleteiras ', 'Paleteira ')
                      : 'Equipamento'

                    return (
                      <div
                        key={product.id}
                        className="group relative bg-white border border-slate-200/90 hover:border-red-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                      >
                        {/* Ambient Background Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/0 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />

                        <div className="relative z-10">
                          {/* Image Showcase Frame */}
                          <div
                            onClick={() => setActiveLightboxProduct(product)}
                            className="relative aspect-[4/3] bg-gradient-to-b from-slate-100/80 via-slate-50/50 to-white rounded-xl p-4 mb-3.5 overflow-hidden cursor-zoom-in border border-slate-100 group/frame"
                            title={`Clique para ampliar imagem da ${product.title}`}
                          >
                            {/* Battery Badge */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs border border-white/10">
                                <Zap size={10} className="text-amber-400 fill-amber-400 animate-pulse" />
                                <span>{product.batteryVoltage}</span>
                              </span>
                            </div>

                            {/* Hover Zoom Pill */}
                            <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover/frame:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/frame:translate-y-0">
                              <div className="bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md border border-slate-200/60 backdrop-blur-md flex items-center gap-1">
                                <ZoomIn size={12} className="text-red-600" />
                                <span>Ampliar</span>
                              </div>
                            </div>

                            {/* Category Tag */}
                            <div className="absolute bottom-2.5 left-2.5 z-10">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/90 text-slate-700 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border border-slate-200/60">
                                {categoryClean}
                              </span>
                            </div>

                            {/* Product Image */}
                            <img
                              src={product.mainImage}
                              alt={product.title}
                              loading="lazy"
                              className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-500 ease-out"
                              style={{ mixBlendMode: 'multiply' }}
                              onError={(e) => {
                                e.currentTarget.src = 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp'
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="mb-3">
                            <h3 className="font-black text-slate-900 text-xl group-hover:text-red-600 transition-colors tracking-tight leading-tight">
                              {product.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-1" title={cleanSubtitle}>
                              {cleanSubtitle}
                            </p>
                          </div>

                          {/* Spec Metric Cards */}
                          <div className="grid grid-cols-2 gap-2.5 my-3.5">
                            <div className="bg-slate-50 group-hover:bg-red-50/30 rounded-xl p-2.5 border border-slate-100 group-hover:border-red-100/60 transition-colors">
                              <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                                <Scale size={11} className="text-red-500" />
                                <span>Capacidade</span>
                              </div>
                              <span className="block font-black text-slate-900 text-sm mt-0.5 truncate">
                                {product.capacity}
                              </span>
                            </div>

                            <div className="bg-slate-50 group-hover:bg-red-50/30 rounded-xl p-2.5 border border-slate-100 group-hover:border-red-100/60 transition-colors">
                              <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                                <ArrowUpFromLine size={11} className="text-red-500" />
                                <span>Elevação</span>
                              </div>
                              <span className="block font-black text-slate-900 text-sm mt-0.5 truncate">
                                {product.liftingHeight}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 relative z-10">
                          <Link
                            href={`/produtos/${product.slug}`}
                            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all duration-200 text-center shadow-xs hover:shadow-md hover:shadow-red-600/20 group/btn"
                          >
                            <span>Ficha Técnica</span>
                            <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>

                          <button
                            onClick={() => handleWhatsAppQuote(product.title)}
                            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 text-center shadow-xs hover:shadow-md hover:shadow-emerald-600/20"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>Cotação</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Streamlined Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Navegação de páginas" className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} modelos
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border ${
                          currentPage === 1
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-700 hover:text-red-600 border-slate-200 hover:bg-slate-50 shadow-xs'
                        }`}
                        title="Página anterior"
                      >
                        <ChevronLeft size={16} />
                        <span className="hidden sm:inline pr-1">Anterior</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((p, idx) => (
                          typeof p === 'number' ? (
                            <button
                              key={idx}
                              onClick={() => goToPage(p)}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                                currentPage === p
                                  ? 'bg-red-600 text-white border-red-600 shadow-xs shadow-red-600/30'
                                  : 'bg-white text-slate-700 hover:text-red-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {p}
                            </button>
                          ) : (
                            <span key={idx} className="px-1 text-slate-400 text-xs font-bold">
                              •••
                            </span>
                          )
                        ))}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border ${
                          currentPage === totalPages
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-700 hover:text-red-600 border-slate-200 hover:bg-slate-50 shadow-xs'
                        }`}
                        title="Próxima página"
                      >
                        <span className="hidden sm:inline pl-1">Próxima</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}

          </main>

        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxProduct && (
        <ImageLightboxModal
          isOpen={Boolean(activeLightboxProduct)}
          onClose={() => setActiveLightboxProduct(null)}
          imageSrc={activeLightboxProduct.mainImage}
          title={activeLightboxProduct.title}
          subtitle={activeLightboxProduct.subtitle}
          capacity={activeLightboxProduct.capacity}
          liftingHeight={activeLightboxProduct.liftingHeight}
          batteryVoltage={activeLightboxProduct.batteryVoltage}
          slug={activeLightboxProduct.slug}
        />
      )}

    </div>
  )
}
