'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = '+5549988395635'
  const message = 'Olá! Gostaria de solicitar um orçamento de equipamentos.'

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Pulse Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />

        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center group hover:shadow-green-500/50 transition-shadow"
        >
          {/* WhatsApp Icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-9 h-9 text-white"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>

          {/* Notification Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">1</span>
          </motion.div>
        </motion.button>

        {/* Tooltip - Hidden */}
      </motion.div>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-6 z-50 w-80 md:w-96"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/logo.png" 
                      alt="Venda Forte" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para ícone do WhatsApp se a logo não carregar
                        const parent = e.currentTarget.parentElement!
                        parent.innerHTML = `
                          <div class="w-full h-full bg-red-600 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" class="w-8 h-8 text-white" fill="currentColor">
                              <path d="M50 10 L30 30 L30 50 L10 50 L10 90 L30 90 L30 70 L50 70 L50 90 L90 90 L90 50 L70 50 L70 30 Z"/>
                            </svg>
                          </div>
                        `
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">Grupo Venda Forte</div>
                    <p className="text-green-100 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                      Normalmente responde em minutos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 bg-gray-50 min-h-[200px] flex flex-col justify-end space-y-3">
                {/* Agent Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-800">
                      Olá! 👋 Como podemos ajudar você com equipamentos industriais?
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">Agora</span>
                  </div>
                </motion.div>

                {/* Suggested Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-2 ml-10"
                >
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm text-left shadow-sm hover:shadow transition-all border border-gray-200"
                  >
                    💰 Solicitar orçamento
                  </button>
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm text-left shadow-sm hover:shadow transition-all border border-gray-200"
                  >
                    🏗️ Ver equipamentos disponíveis
                  </button>
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm text-left shadow-sm hover:shadow transition-all border border-gray-200"
                  >
                    🔧 Manutenção e suporte
                  </button>
                </motion.div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-white border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Iniciar Conversa no WhatsApp
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
