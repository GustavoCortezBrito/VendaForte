'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, MessageCircle, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { PRODUCT_STAGE } from '@/components/site/styles'
import { stagePhoto } from '@/lib/product-photo'

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
            className="absolute inset-0 bg-ink/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative z-10 w-full max-w-4xl bg-ink-raised rounded-[28px] overflow-hidden border border-white/10 flex flex-col max-h-[90vh]"
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {title}
                  </h3>
                </div>
                {subtitle && (
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">{subtitle}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-ink-raised border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Fechar visualização"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Imagem Ampliada */}
            <div className={`relative flex-1 min-h-[280px] sm:min-h-[420px] ${PRODUCT_STAGE} flex items-center justify-center p-6 sm:p-10 overflow-hidden`}>
              <motion.img
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                src={stagePhoto(imageSrc, 1080)}
                alt={title}
                className="max-h-[55vh] w-auto max-w-full object-contain select-none"
              />
            </div>

            {/* Footer com Especificações & Ações */}
            <div className="p-4 sm:p-6 bg-ink-raised border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Pills de especificações */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-neutral-300 flex-wrap justify-center sm:justify-start">
                {capacity && (
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-ink-muted block text-[9px] font-bold">Capacidade</span>
                    <span className="font-bold text-white text-xs">{capacity}</span>
                  </div>
                )}
                {liftingHeight && (
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-ink-muted block text-[9px] font-bold">Elevação</span>
                    <span className="font-bold text-white text-xs">{liftingHeight}</span>
                  </div>
                )}
                {batteryVoltage && (
                  <div className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-xl border border-red-500/20">
                    <span className="text-red-400 block text-[9px] font-bold">Bateria</span>
                    <span className="font-bold text-red-400 text-xs">{batteryVoltage}</span>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {slug && (
                  <Link
                    href={`/produtos/${slug}`}
                    onClick={onClose}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors"
                  >
                    <span>Ficha Técnica</span>
                    <ExternalLink size={13} />
                  </Link>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsApp}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs transition"
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
