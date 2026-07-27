'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, ArrowRight, ShieldCheck, BatteryCharging, CheckCircle2, ChevronRight } from 'lucide-react'
import forkliftsData from '@/lib/data/electric-forklifts.json'

export default function EPForkliftsSection() {
  const featured = forkliftsData.slice(0, 4)

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 text-gray-900 relative overflow-hidden border-t border-gray-200/80" id="empilhadeiras-eletricas">
      
      {/* Background Decorative Element */}
      <div className="hidden md:block absolute top-10 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-red-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 rounded-full border border-red-100 shadow-sm">
              Linha Completa de Equipamentos
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight tracking-tight">
              Empilhadeiras <span className="text-red-600">Elétricas</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
              Tecnologia de ponta em baterias de Lítio (80V/48V), motores PMSM duplos e aceleração inteligente para máxima produtividade com custo operacional mínimo.
            </p>
          </div>

          <div>
            <Link
              href="/empilhadeiras-eletricas"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all uppercase tracking-wider"
            >
              <span>Ver Catálogo Completo ({forkliftsData.length} Modelos)</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Categories / Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-extrabold text-base mb-4 shadow-sm">
              80V
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Baterias Íon-Lítio 80V</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Recarga rápida em 1 hora, oportunidade de carga durante intervalos e vida útil de mais de 3.000 ciclos de operação.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-extrabold text-base mb-4 shadow-sm">
              3R
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Linha 3 Rodas Compacta</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Raio de giro ultra reduzido a partir de 1535 mm para máxima manobrabilidade dentro de contêineres e corredores estreitos.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-extrabold text-base mb-4 shadow-sm">
              4R
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Linha 4 Rodas Robustez</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Estabilidade máxima em pisos irregulares e pátios externos com capacidade de carga de até 2.000 kg (2.0T) e elevação de 6m.
            </p>
          </div>
        </div>

        {/* Featured Products Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-gray-200/90 hover:border-red-500/50 rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[4/3] bg-white rounded-2xl p-3 flex items-center justify-center mb-4 border border-gray-100 overflow-hidden shadow-inner">
                  <span className="absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase shadow-sm">
                    {p.batteryVoltage} Li-Ion
                  </span>
                  <img
                    src={p.mainImage}
                    alt={p.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp'
                    }}
                  />
                </div>

                <h3 className="font-extrabold text-gray-900 text-xl group-hover:text-red-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-red-600 font-bold line-clamp-1 mt-0.5 mb-3">
                  {p.subtitle.replace(/^Empilhadeira Elétrica EP /i, 'Empilhadeira Elétrica ')}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 mb-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Capacidade</span>
                    <span className="font-extrabold text-gray-900">{p.capacity}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Elevação</span>
                    <span className="font-extrabold text-gray-900">{p.liftingHeight}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/empilhadeiras-eletricas/${p.slug}`}
                className="w-full py-3 rounded-xl bg-gray-900 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm uppercase tracking-wider"
              >
                <span>Ver Ficha Técnica</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Banner Link */}
        <div className="mt-12 text-center">
          <Link
            href="/empilhadeiras-eletricas"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-red-600 font-bold transition-colors"
          >
            <span>Quer comparar todos os {forkliftsData.length} modelos de Empilhadeiras Elétricas?</span>
            <span className="underline text-red-600 font-extrabold">Acesse o Catálogo Completo →</span>
          </Link>
        </div>

      </div>
    </section>
  )
}
