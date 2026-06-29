'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 10
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 flex items-center justify-center"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-600 opacity-10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-800 opacity-10 rounded-full blur-3xl"
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 200 
              }}
              className="mb-8"
            >
              <div className="relative">
                {/* Pulse Rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-red-500 rounded-2xl blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 bg-red-500 rounded-2xl blur-xl"
                />

                {/* Logo Container */}
                <motion.div 
                  className="relative w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src="/logo.png" 
                    alt="Venda Forte" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement!
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center p-6">
                          <svg viewBox="0 0 100 100" class="w-full h-full text-white" fill="currentColor">
                            <path d="M50 10 L30 30 L30 50 L10 50 L10 90 L30 90 L30 70 L50 70 L50 90 L90 90 L90 50 L70 50 L70 30 Z"/>
                          </svg>
                        </div>
                      `
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Venda Forte
              </h1>
              <p className="text-red-200 text-lg">
                Equipamentos Industriais
              </p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-64 md:w-80"
            >
              {/* Progress Container */}
              <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                {/* Shimmer Effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                {/* Progress Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full relative overflow-hidden"
                >
                  {/* Animated Glow */}
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </div>

              {/* Progress Text */}
              <motion.div 
                className="mt-3 text-center text-red-200 text-sm font-medium"
                key={progress}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {progress}%
              </motion.div>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
              ))}
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mt-6 text-red-200 text-sm"
            >
              Carregando...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
