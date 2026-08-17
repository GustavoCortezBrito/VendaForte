'use client'

import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Layers, Package, ArrowDownUp, Truck, BoxSelect } from 'lucide-react'
import forkliftsData from '@/lib/data/electric-forklifts.json'

type ForkliftProduct = (typeof forkliftsData)[number]

const HIGHLIGHT_SLUGS = new Set(['f4', 'ds3', 'tvl151', 'tvl181'])

const CATALOG_PREVIEW_SLUGS = ['f4-201', 'esl122', 'efl302b3', 'cqd20lb', 'jx1']

const CATALOG_CATEGORIES = [
  {
    label: 'Paleteiras',
    filter: 'Paleteiras Elétricas',
    icon: Package,
  },
  {
    label: 'Stackers',
    filter: 'Empilhadeiras Patoladas (Stackers)',
    icon: ArrowDownUp,
  },
  {
    label: 'Contrabalançadas',
    filter: 'Empilhadeiras Contrabalançadas',
    icon: Truck,
  },
  {
    label: 'Retráteis',
    filter: 'Empilhadeiras Retráteis (Reach Trucks)',
    icon: Layers,
  },
  {
    label: 'Order Pickers',
    filter: 'Selecionadoras de Pedidos & Rebocadores',
    icon: BoxSelect,
  },
] as const

function getCategoryLabel(category?: string) {
  if (!category) return 'Equipamento'
  if (category.includes('Paleteira')) return 'Paleteira'
  if (category.includes('Patolada') || category.includes('Stacker')) return 'Stacker'
  if (category.includes('Contrabalançada')) return 'Contrabalançada'
  if (category.includes('Retrátil') || category.includes('Reach')) return 'Retrátil'
  if (category.includes('Selecionadora') || category.includes('Rebocador')) return 'Order Picker'
  return category.split(' ')[0]
}

export default function EPForkliftsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    forkliftsData.forEach((product) => {
      if (product.category) {
        counts[product.category] = (counts[product.category] || 0) + 1
      }
    })
    return counts
  }, [])

  const previewProducts = useMemo(() => {
    const selected = CATALOG_PREVIEW_SLUGS
      .map((slug) => forkliftsData.find((product) => product.slug === slug))
      .filter(Boolean) as ForkliftProduct[]

    if (selected.length >= 4) return selected

    const fallback = forkliftsData.filter((product) => !HIGHLIGHT_SLUGS.has(product.slug))
    return [...selected, ...fallback].slice(0, 5)
  }, [])

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 bg-gradient-to-b from-slate-50/80 via-white to-white relative overflow-hidden font-sans"
      id="empilhadeiras-eletricas"
    >
      <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header centralizado — padrão das demais sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100 shadow-sm">
            <Layers size={16} className="text-red-500" />
            Catálogo EP Equipment — {forkliftsData.length} Equipamentos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mt-2 mb-4">
            Catálogo Completo de <span className="text-red-600">Equipamentos</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Navegue por categorias, compare capacidades e elevação, e encontre o equipamento ideal para cada operação logística.
          </p>
        </motion.div>

        {/* Navegação por categorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10 sm:mb-12"
        >
          {CATALOG_CATEGORIES.map(({ label, filter, icon: Icon }, idx) => (
            <Link
              key={filter}
              href="/empilhadeiras-eletricas"
              className="group rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 text-center shadow-sm hover:border-red-400 hover:shadow-md transition-all"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Icon size={20} />
              </div>
              <p className="text-sm font-extrabold text-gray-900">{label}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                {categoryCounts[filter] || 0} modelos
              </p>
            </Link>
          ))}
        </motion.div>

        {/* Amostra do catálogo — produtos diferentes do destaque mensal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {previewProducts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * idx, duration: 0.45 }}
              whileHover={{ y: -6 }}
              className="group bg-white border border-gray-200 hover:border-red-400/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-white flex items-center justify-center p-4 overflow-hidden" style={{ isolation: 'isolate' }}>
                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-gray-900 text-white font-bold text-[10px] uppercase">
                  {getCategoryLabel(p.category)}
                </span>
                <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px] uppercase">
                  {p.batteryVoltage} Li-Ion
                </span>
                <img
                  src={p.mainImage}
                  alt={p.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  style={{ mixBlendMode: 'multiply' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp'
                  }}
                />
              </div>

              <div className="p-4 border-t border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-base group-hover:text-red-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 min-h-[2rem]">{p.subtitle}</p>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Capacidade</span>
                    <span className="text-sm font-extrabold text-gray-900">{p.capacity}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Elevação</span>
                    <span className="text-sm font-extrabold text-gray-900">{p.liftingHeight}</span>
                  </div>
                </div>

                <Link
                  href={`/empilhadeiras-eletricas/${p.slug}`}
                  aria-label={`Ver especificações completas e ficha técnica da ${p.title}`}
                  title={`Ficha Técnica - ${p.title}`}
                  className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-gray-700 hover:text-red-600 transition-colors"
                >
                  Ver Ficha Técnica
                  <ChevronRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA principal para o catálogo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 sm:mt-14 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            Amostra de {previewProducts.length} modelos de diferentes categorias — explore os {forkliftsData.length} equipamentos do catálogo
          </p>
          <Link
            href="/empilhadeiras-eletricas"
            aria-label="Explorar catálogo completo de empilhadeiras elétricas EP Equipment"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/25 transition-all group"
          >
            <span>Explorar Catálogo Completo</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
