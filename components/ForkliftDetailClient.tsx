'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  Check,
  Truck,
  BatteryCharging,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { ForkliftProduct } from './ForkliftsCatalogClient'

interface Props {
  product: ForkliftProduct
  relatedProducts: ForkliftProduct[]
}

export default function ForkliftDetailClient({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState(product.mainImage)
  const [copied, setCopied] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const phoneNumber = '+5549988395635'

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsAppQuote = () => {
    const message = `Olá! Gostaria de solicitar uma cotação e ficha técnica completa da empilhadeira: ${product.title} (${product.capacity}).`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const allImages = Array.from(new Set([product.mainImage, ...product.galleryImages])).filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900 pt-24 pb-20 font-sans">
      
      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-red-600 transition-colors">Início</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <Link href="/empilhadeiras-eletricas" className="hover:text-red-600 transition-colors">Empilhadeiras Elétricas</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-extrabold">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] bg-white rounded-3xl p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-xl" style={{ isolation: 'isolate' }}>
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span className="px-3.5 py-1 bg-red-600 font-bold text-white text-xs rounded-md shadow-sm">
                  {product.batteryVoltage} Li-Ion
                </span>
                <span className="px-3.5 py-1 bg-white font-bold text-gray-700 text-xs rounded-md border border-gray-200 shadow-sm">
                  {product.type}
                </span>
              </div>

              <img
                src={activeImage}
                alt={`Empilhadeira Elétrica ${product.title}`}
                className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
                style={{ mixBlendMode: 'multiply' }}
                onError={(e) => {
                  e.currentTarget.src = product.mainImage || 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp'
                }}
              />
            </div>

            {/* Thumbnails list */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-xl bg-white border flex-shrink-0 p-2 overflow-hidden transition-all shadow-sm ${
                      activeImage === img
                        ? 'border-red-600 ring-2 ring-red-600/30'
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Highlights Grid */}
            <div className="pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-red-600" />
                Destaques & Diferenciais do Equipamento
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.highlights.map((h, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1">{h.title.replace(/ EP$/i, '')}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Quote Action Box */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                  Venda Forte Equipamentos
                </span>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 font-bold transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                  <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>

              <p className="text-red-600 text-sm sm:text-base font-bold mt-1 mb-4">
                {product.subtitle.replace(/^Empilhadeira Elétrica EP /i, 'Empilhadeira Elétrica ')}
              </p>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal mb-6">
                {product.description.replace(/ EP /gi, ' ')}
              </p>

              {/* Specs Cards Bar */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Capacidade Nominal</span>
                  <span className="text-lg font-extrabold text-gray-900">{product.capacity}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Elevação Máxima</span>
                  <span className="text-lg font-extrabold text-gray-900">{product.liftingHeight}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Sistema de Bateria</span>
                  <span className="text-lg font-extrabold text-red-600">{product.batteryVoltage} Lítio</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm">
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Raio de Giro</span>
                  <span className="text-lg font-extrabold text-gray-900">{product.turningRadius}</span>
                </div>
              </div>

              {/* Recommended Applications */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Aplicações Recomendadas:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium">
                  {product.applications.map((app, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-red-600 flex-shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl space-y-4">
              <button
                onClick={handleWhatsAppQuote}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-base shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Solicitar Cotação no WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-red-600" />
                  Garantia Oficial VendaForte
                </span>
                <span>Entrega em todo o Brasil</span>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Specs Table com botão Ver Mais */}
        {product.specs && Object.keys(product.specs).length > 0 && (() => {
          const specsArray = Object.entries(product.specs)
          const displayedSpecs = showAllSpecs ? specsArray : specsArray.slice(0, 8)

          return (
            <div className="mt-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <FileText size={22} className="text-red-600" />
                  Ficha Técnica Completa ({product.title})
                </h2>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {specsArray.length} Especificações
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-700">
                  <tbody>
                    {displayedSpecs.map(([key, val], idx) => (
                      <tr 
                        key={key} 
                        className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50/60' : 'bg-white'}`}
                      >
                        <td className="py-3 px-4 font-bold text-gray-900 w-1/2">{key}</td>
                        <td className="py-3 px-4 text-gray-700 font-medium">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {specsArray.length > 8 && (
                <div className="mt-6 text-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm border border-red-200 hover:border-red-600 group"
                  >
                    <span>{showAllSpecs ? 'Recolher Especificações' : `Ver Mais Especificações (${specsArray.length - 8} adicionais)`}</span>
                    {showAllSpecs ? (
                      <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                    ) : (
                      <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )
        })()}

      </section>
    </div>
  )
}
