'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import forkliftsData from '@/lib/data/electric-forklifts.json'

export default function EPForkliftsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const findProduct = (slug: string) => forkliftsData.find(p => p.slug === slug)
  const featured = [
    findProduct('f4') || forkliftsData[0],
    findProduct('ds3') || forkliftsData[1],
    findProduct('tvl151') || forkliftsData[2],
    findProduct('efl302b3') || forkliftsData[3],
  ].filter(Boolean)

  return (
    <section
      ref={ref}
      className="py-20 bg-white border-t border-gray-100 font-sans"
      id="empilhadeiras-eletricas"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100">
              <Sparkles size={13} className="text-red-500" />
              EP Equipment — {forkliftsData.length} Equipamentos
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mt-2">
              Equipamentos em <span className="text-red-600">Destaque</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-lg">
              Paleteiras, Stackers, Empilhadeiras Contrabalançadas e Retráteis com bateria Íon-Lítio.
            </p>
          </div>

          <Link
            href="/empilhadeiras-eletricas"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600 transition-all whitespace-nowrap self-start md:self-auto"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * idx, duration: 0.45 }}
              whileHover={{ y: -6 }}
              className="group bg-white border border-gray-200 hover:border-red-400/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image area */}
              <div className="relative aspect-[4/3] bg-white flex items-center justify-center p-4 overflow-hidden" style={{ isolation: 'isolate' }}>
                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px] uppercase">
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

              {/* Content */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-base group-hover:text-red-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{p.subtitle}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Capacidade</span>
                    <span className="text-sm font-extrabold text-gray-900">{p.capacity}</span>
                  </div>
                  <Link
                    href={`/empilhadeiras-eletricas/${p.slug}`}
                    className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Ficha Técnica
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
