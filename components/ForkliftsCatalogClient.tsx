'use client'

import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import PageHeader from '@/components/site/PageHeader'
import Image from 'next/image'
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
import { useDragScroll } from '@/components/useDragScroll'
import { TYPE_LABELS, formatLift } from '@/lib/product-seo'
import { PRODUCT_STAGE } from '@/components/site/styles'
import { stagePhoto } from '@/lib/product-photo'

import type { CatalogItem, ForkliftProduct } from '@/lib/catalog'

export type { ForkliftProduct }

interface Props {
  /** Só os campos que a lista usa (cerca de 90 KB nos 222 modelos); a ficha completa fica na página do modelo. */
  initialProducts: CatalogItem[]
  /** Página pedida em `/produtos?pagina=N`. Vale enquanto não há filtro; com filtro, a página é do navegador. */
  initialPage?: number
  /** Conteúdo gerado no servidor (links dos tipos), mostrado no fim da página. */
  children?: ReactNode
}

const ITEMS_PER_PAGE = 12

const CATEGORIES_CONFIG = [
  { id: 'all', label: 'Todos os Modelos', icon: Layers },
  { id: 'Paleteiras Elétricas', label: 'Paleteiras', icon: Truck },
  { id: 'Empilhadeiras Patoladas (Stackers)', label: 'Stackers', icon: Box },
  { id: 'Empilhadeiras Contrabalançadas', label: 'Contrabalançadas', icon: Forklift },
  { id: 'Empilhadeiras Retráteis (Reach Trucks)', label: 'Retráteis', icon: ArrowDownUp },
  { id: 'Selecionadoras de Pedidos & Rebocadores', label: 'Selecionadoras', icon: PackageCheck },
  { id: 'Equipamentos Especiais & VNA', label: 'Outros (VNA & Especiais)', icon: Cog },
]

export default function ForkliftsCatalogClient({ initialProducts, initialPage = 1, children }: Props) {
  const [activeLightboxProduct, setActiveLightboxProduct] = useState<CatalogItem | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rangeFilter, setRangeFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [liftHeightFilter, setLiftHeightFilter] = useState('all')
  const [voltageFilter, setVoltageFilter] = useState('all')
  // Página escolhida com filtros ativos. Sem filtro, a página vem do endereço (?pagina=N) e cada número é um link.
  const [filterPage, setFilterPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  // Fileira de categorias: também rola arrastando com o mouse
  const { ref: categoriesRef, dragging, handlers: dragHandlers } = useDragScroll<HTMLDivElement>()
  // Bordas da fileira: mostram a seta e o esmaecido só do lado em que ainda há o que rolar
  const [chipEdge, setChipEdge] = useState({ start: true, end: false })
  useEffect(() => {
    const el = categoriesRef.current
    if (!el) return
    const update = () => setChipEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [categoriesRef])
  const scrollChips = (direction: 1 | -1) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    categoriesRef.current?.scrollBy({ left: direction * 320, behavior: reduce ? 'auto' : 'smooth' })
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
      const typeLower = (p.type + ' ' + (p.category || '') + ' ' + p.subtitle + ' ' + p.title).toLowerCase()
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

  const hasActiveFilters = Boolean(search || categoryFilter !== 'all' || rangeFilter !== 'all' || capacityFilter !== 'all' || liftHeightFilter !== 'all' || voltageFilter !== 'all')
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1
  const currentPage = Math.min(hasActiveFilters ? filterPage : initialPage, totalPages)

  // Reset to page 1 on filter changes
  useEffect(() => {
    setFilterPage(1)
  }, [search, categoryFilter, rangeFilter, capacityFilter, liftHeightFilter, voltageFilter])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Ao trocar de página por link, leva a tela de volta ao início da lista
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!hasActiveFilters) document.getElementById('catalog-products-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage])

  const handleResetFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setRangeFilter('all')
    setCapacityFilter('all')
    setLiftHeightFilter('all')
    setVoltageFilter('all')
    setFilterPage(1)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setFilterPage(page)
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

  const pageHref = (page: number) => (page > 1 ? `/produtos?pagina=${page}` : '/produtos')

  const pageControl = (
    page: number,
    label: ReactNode,
    classes: string,
    options: { title?: string; current?: boolean; rel?: 'prev' | 'next' } = {}
  ) =>
    hasActiveFilters ? (
      <button type="button" onClick={() => goToPage(page)} className={classes} title={options.title} aria-current={options.current ? 'page' : undefined}>
        {label}
      </button>
    ) : (
      <Link href={pageHref(page)} scroll={false} className={classes} title={options.title} rel={options.rel} aria-current={options.current ? 'page' : undefined}>
        {label}
      </Link>
    )

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
    <div className="min-h-screen bg-ink pb-24 font-sans text-white">
      
      <PageHeader
        before={
          <nav aria-label="Você está em" className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/" className="transition-colors hover:text-white">Início</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-neutral-300">Produtos</span>
          </nav>
        }
        eyebrow="Dealer oficial EP Equipment · Tecnologia íon-lítio"
        title="Produtos e equipamentos"
        lead={<p>Explore {initialProducts.length} modelos de empilhadeiras elétricas, paleteiras, stackers, retráteis e equipamentos para intralogística.</p>}
      />

      {/* STICKY TOOLBAR (Categories & Search Bar that follow on scroll) */}
      <div className="sticky top-20 z-30 bg-ink/95 backdrop-blur-md border-b border-white/10 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Barra de categorias: rola arrastando, pelo dedo, pela roda ou pelas setas; sem barra de rolagem */}
          <div className="relative flex items-center flex-1 min-w-0">
            <div
              ref={categoriesRef}
              {...dragHandlers}
              className={`flex items-center gap-2 overflow-x-auto py-0.5 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0 ${dragging ? 'cursor-grabbing select-none' : 'sm:cursor-grab'}`}
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
                    onClick={(event) => {
                      setCategoryFilter(cat.id)
                      event.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
                    }}
                    aria-pressed={isSelected}
                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-ink'
                        : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-ink' : 'text-red-500'} />
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium ${
                      isSelected ? 'bg-ink/10 text-ink' : 'bg-white/[0.06] text-ink-muted'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Esmaecido e seta nas pontas em que ainda há o que rolar */}
            <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-ink to-transparent transition-opacity duration-300 ${chipEdge.start ? 'opacity-0' : 'opacity-100'}`} />
            <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-ink to-transparent transition-opacity duration-300 ${chipEdge.end ? 'opacity-0' : 'opacity-100'}`} />
            <button
              type="button"
              onClick={() => scrollChips(-1)}
              aria-label="Categorias anteriores"
              tabIndex={chipEdge.start ? -1 : 0}
              className={`absolute left-0 top-1/2 hidden h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/15 bg-ink-raised text-white transition duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:grid ${chipEdge.start ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollChips(1)}
              aria-label="Mais categorias"
              tabIndex={chipEdge.end ? -1 : 0}
              className={`absolute right-0 top-1/2 hidden h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/15 bg-ink-raised text-white transition duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:grid ${chipEdge.end ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Quick Search Box inside Sticky Bar */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={15} />
              <input
                type="text"
                placeholder="Buscar modelo (ex: F4, DS3, EFL302B3)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-ink-muted transition-colors focus:border-red-500/70 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-red-500/15"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-white p-0.5 rounded-full"
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
          <aside className="sticky top-40 hidden space-y-5 rounded-[28px] border border-white/10 bg-ink-raised p-6 lg:col-span-3 lg:block">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-red-500" />
                Filtros do Catálogo
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={11} />
                  Limpar
                </button>
              )}
            </div>

            {/* Categories Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">
                Categoria
              </label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-600 focus:bg-white/10 transition"
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
              <label className="block text-xs font-bold text-neutral-300">
                Linha / série
              </label>
              <select
                value={rangeFilter}
                onChange={e => setRangeFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-600 focus:bg-white/10 transition"
              >
                <option value="all">Todas as Séries</option>
                <option value="3wheel">3 rodas</option>
                <option value="4wheel">4 rodas</option>
                <option value="pedestrian">Operador a pé</option>
                <option value="rider">Operador embarcado</option>
                <option value="high_voltage">Alta Voltagem Li-Ion (80V+)</option>
              </select>
            </div>

            {/* Capacity Filter (Load Capacity) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">
                Capacidade de carga
              </label>
              <select
                value={capacityFilter}
                onChange={e => setCapacityFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-600 focus:bg-white/10 transition"
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
              <label className="block text-xs font-bold text-neutral-300">
                Elevação máxima
              </label>
              <select
                value={liftHeightFilter}
                onChange={e => setLiftHeightFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-600 focus:bg-white/10 transition"
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
              <label className="block text-xs font-bold text-neutral-300">
                Bateria e voltagem
              </label>
              <select
                value={voltageFilter}
                onChange={e => setVoltageFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-600 focus:bg-white/10 transition"
              >
                <option value="all">Todas as Voltagens</option>
                <option value="24V">24V Li-Ion</option>
                <option value="48V">48V Li-Ion</option>
                <option value="80V">80V Li-Ion</option>
                <option value="high_voltage">Alta Tensão (+80V / 309V)</option>
              </select>
            </div>

            {/* Os filtros se aplicam na hora; aqui só o atalho para limpar */}
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                className="w-full py-2.5 rounded-full border border-white/15 hover:bg-white/10 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:bg-white/10 disabled:text-ink-muted disabled:cursor-not-allowed"
              >
                <RotateCcw size={12} />
                <span>Limpar filtros</span>
              </button>
            </div>

            {/* Support Callout */}
            <div className="pt-2 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-3 text-xs text-neutral-400 space-y-1.5">
                <p className="font-bold text-white">Dúvida no dimensionamento?</p>
                <p className="text-[11px] leading-relaxed">Nossos especialistas ajudam você a escolher o modelo ideal.</p>
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent('Olá! Gostaria de uma consultoria para escolher o equipamento EP ideal.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-300 font-bold text-[11px] pt-0.5"
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/10 bg-ink-raised py-2.5 pl-5 pr-2.5">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-bold text-white text-sm">
                  {filteredProducts.length}
                </span>
                <span>{filteredProducts.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}</span>
                {hasActiveFilters && (
                  <span className="hidden sm:inline text-red-500 font-semibold">• filtros aplicados</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-neutral-300 bg-white/5 hover:bg-white/10 flex items-center gap-1.5"
                >
                  <Filter size={13} className="text-red-500" />
                  <span>Filtros {hasActiveFilters && '•'}</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Resetar</span>
                  </button>
                )}

                <span className="text-xs text-neutral-400 font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-full">
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
                  className="lg:hidden space-y-4 overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised p-5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="font-bold text-xs text-white">Filtros de Busca</h3>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="text-xs font-bold text-red-500 flex items-center gap-1"
                        >
                          <RotateCcw size={11} />
                          Reset
                        </button>
                      )}
                      <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="text-ink-muted hover:text-white p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">Categoria</label>
                      <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white"
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
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">Linha / Série</label>
                      <select
                        value={rangeFilter}
                        onChange={e => setRangeFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white"
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
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">Capacidade</label>
                      <select
                        value={capacityFilter}
                        onChange={e => setCapacityFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white"
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
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">Elevação</label>
                      <select
                        value={liftHeightFilter}
                        onChange={e => setLiftHeightFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white"
                      >
                        <option value="all">Todas as Alturas</option>
                        <option value="under_2000">Até 2.000 mm</option>
                        <option value="2500_4500">2.500 - 4.500 mm</option>
                        <option value="5000_6500">5.000 - 6.500 mm</option>
                        <option value="over_7000">+7.000 mm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">Voltagem</label>
                      <select
                        value={voltageFilter}
                        onChange={e => setVoltageFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white"
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
                      className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-semibold text-xs"
                    >
                      Ver Resultados ({filteredProducts.length})
                    </button>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2.5 rounded-full border border-white/15 text-white font-semibold text-xs"
                    >
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-ink-raised p-12 text-center">
                <Search className="mx-auto text-neutral-400 mb-3" size={38} />
                <h3 className="text-base font-bold text-white mb-1">Nenhum equipamento encontrado</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Tente alterar os termos de busca ou redefinir os filtros selecionados.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full text-sm hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Resetar Todos os Filtros</span>
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid (3 cols on large, 2 on medium, 1 on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {paginatedProducts.map((product, index) => {
                    const cleanSubtitle = product.subtitle
                      .replace(/^Empilhadeira Elétrica EP /i, '')
                      .replace(/^Paleteira Elétrica EP /i, '')
                      .replace(/^Empilhadeira Patolada EP /i, '')
                      .replace(/^EP Equipment /i, '')

                    const typeLabel = TYPE_LABELS[product.type] ?? product.type

                    const categoryClean = product.category
                      ? product.category.replace('Empilhadeiras ', '').replace('Paleteiras ', 'Paleteira ')
                      : 'Equipamento'

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
                        className="group relative flex flex-col justify-between rounded-[28px] border border-white/10 bg-ink-raised p-3 transition-colors duration-500 hover:border-white/25 sm:p-4"
                      >
                        {/* Ambient Background Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/0 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 rounded-[28px] transition-opacity duration-300 pointer-events-none" />

                        <div className="relative z-10">
                          {/* Image Showcase Frame */}
                          <div
                            onClick={() => setActiveLightboxProduct(product)}
                            className={`relative aspect-[4/3] ${PRODUCT_STAGE} rounded-[20px] p-4 mb-3.5 overflow-hidden cursor-zoom-in group/frame`}
                            title={`Clique para ampliar imagem da ${product.title}`}
                          >
                            {/* Battery Badge */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ink/90 text-white text-[10px] font-bold backdrop-blur-md border border-white/10">
                                <Zap size={10} className="text-amber-400 fill-amber-400" />
                                <span>{product.batteryVoltage}</span>
                              </span>
                            </div>

                            {/* Hover Zoom Pill */}
                            <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover/frame:opacity-100 transition duration-200 transform translate-y-1 group-hover/frame:translate-y-0">
                              <div className="bg-ink/95 hover:bg-white/10 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md flex items-center gap-1">
                                <ZoomIn size={12} className="text-red-500" />
                                <span>Ampliar</span>
                              </div>
                            </div>

                            {/* Category Tag */}
                            <div className="absolute bottom-2.5 left-2.5 z-10">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-ink/90 text-neutral-300 text-[9px] font-bold backdrop-blur-md border border-white/10">
                                {categoryClean}
                              </span>
                            </div>

                            {/* Product Image */}
                            <Image
                              src={stagePhoto(product.mainImage)}
                              alt={product.title}
                              fill
                              priority={index < 3}
                              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="mb-3">
                            <h3 className="font-bold text-white text-xl group-hover:text-red-400 transition-colors tracking-tight leading-tight">
                              {product.title}
                            </h3>
                            <p className="text-xs text-neutral-400 font-medium line-clamp-1 mt-1" title={cleanSubtitle}>
                              {typeLabel}
                            </p>
                          </div>

                          {/* Spec Metric Cards */}
                          <div className="grid grid-cols-2 gap-2.5 my-3.5">
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors group-hover:border-white/15">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-ink-muted">
                                <Scale size={11} className="text-red-500" />
                                <span>Capacidade</span>
                              </div>
                              <span className="block font-bold text-white text-sm mt-0.5 truncate">
                                {product.capacity}
                              </span>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors group-hover:border-white/15">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-ink-muted">
                                <ArrowUpFromLine size={11} className="text-red-500" />
                                <span>Elevação</span>
                              </div>
                              <span className="block font-bold text-white text-sm mt-0.5 truncate">
                                {formatLift(product.liftingHeight)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 relative z-10">
                          <Link
                            href={`/produtos/${product.slug}`}
                            className="py-2.5 px-3 rounded-full border border-white/15 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors text-center group/btn"
                          >
                            <span>Ficha Técnica</span>
                            <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>

                          <button
                            onClick={() => handleWhatsAppQuote(product.title)}
                            className="py-2.5 px-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>Cotação</span>
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Paginação: sem filtro, cada número é um link (/produtos?pagina=N) que o Google segue; com filtro, botões */}
                {totalPages > 1 && (
                  <nav aria-label="Navegação de páginas" className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                    <p className="text-xs text-neutral-400">
                      Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} modelos
                    </p>

                    <div className="flex items-center gap-1.5">
                      {currentPage > 1 ? (
                        pageControl(currentPage - 1, (
                          <>
                            <ChevronLeft size={16} />
                            <span className="hidden sm:inline pr-1">Anterior</span>
                          </>
                        ), 'p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition border bg-ink-raised text-neutral-300 hover:text-red-400 border-white/10 hover:bg-white/5', { title: 'Página anterior', rel: 'prev' })
                      ) : (
                        <span aria-hidden="true" className="p-2 rounded-xl text-xs font-bold flex items-center gap-1 border bg-white/10 text-ink-muted border-white/10 cursor-not-allowed">
                          <ChevronLeft size={16} />
                          <span className="hidden sm:inline pr-1">Anterior</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((p, idx) => (
                          typeof p === 'number' ? (
                            <span key={idx}>
                              {pageControl(p, p, `w-9 h-9 rounded-xl text-xs font-bold transition border flex items-center justify-center ${
                                currentPage === p
                                  ? 'bg-red-600 text-white border-red-600'
                                  : 'bg-ink-raised text-neutral-300 hover:text-red-400 border-white/10 hover:bg-white/5'
                              }`, { current: currentPage === p })}
                            </span>
                          ) : (
                            <span key={idx} className="px-1 text-ink-muted text-xs font-bold">
                              •••
                            </span>
                          )
                        ))}
                      </div>

                      {currentPage < totalPages ? (
                        pageControl(currentPage + 1, (
                          <>
                            <span className="hidden sm:inline pl-1">Próxima</span>
                            <ChevronRight size={16} />
                          </>
                        ), 'p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition border bg-ink-raised text-neutral-300 hover:text-red-400 border-white/10 hover:bg-white/5', { title: 'Próxima página', rel: 'next' })
                      ) : (
                        <span aria-hidden="true" className="p-2 rounded-xl text-xs font-bold flex items-center gap-1 border bg-white/10 text-ink-muted border-white/10 cursor-not-allowed">
                          <span className="hidden sm:inline pl-1">Próxima</span>
                          <ChevronRight size={16} />
                        </span>
                      )}
                    </div>
                  </nav>
                )}
              </>
            )}

          </main>

        </div>
      </div>

      {children}

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
