'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, MessageCircle, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  title: string
  subtitle?: string
  capacity?: string
  liftingHeight?: string
  batteryVoltage?: string
  slug?: string
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageSrc,
  title,
  subtitle,
  capacity,
  liftingHeight,
  batteryVoltage,
  slug,
}: LightboxProps) {
  const phoneNumber = '+5549988395635'

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleWhatsApp = () => {
    const text = `Olá! Estava visualizando a imagem ampliada da empilhadeira ${title} no site da Venda Forte e gostaria de solicitar uma cotação.`
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          
          {/* Backdrop com blur escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/80">
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                    {title}
                  </h3>
                </div>
                {subtitle && (
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-sm transition-colors flex-shrink-0"
                aria-label="Fechar visualização"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Imagem Ampliada */}
            <div className="relative flex-1 min-h-[280px] sm:min-h-[420px] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6 sm:p-10 overflow-hidden">
              <motion.img
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                src={imageSrc}
                alt={title}
                className="max-h-[55vh] w-auto max-w-full object-contain filter drop-shadow-xl select-none"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            {/* Footer com Especificações & Ações */}
            <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Pills de especificações */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-gray-700 flex-wrap justify-center sm:justify-start">
                {capacity && (
                  <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-gray-200/60">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Capacidade</span>
                    <span className="font-extrabold text-gray-900 text-xs">{capacity}</span>
                  </div>
                )}
                {liftingHeight && (
                  <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-gray-200/60">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Elevação</span>
                    <span className="font-extrabold text-gray-900 text-xs">{liftingHeight}</span>
                  </div>
                )}
                {batteryVoltage && (
                  <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl border border-red-100">
                    <span className="text-red-400 block text-[9px] uppercase font-bold">Bateria</span>
                    <span className="font-extrabold text-red-700 text-xs">{batteryVoltage}</span>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {slug && (
                  <Link
                    href={`/produtos/${slug}`}
                    onClick={onClose}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold text-xs transition-colors"
                  >
                    <span>Ficha Técnica</span>
                    <ExternalLink size={13} />
                  </Link>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsApp}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle size={15} />
                  <span>Pedir Cotação</span>
                </motion.button>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
