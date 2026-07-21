'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X, Settings } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Progress bar do scroll
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'Início', href: '/#home' },
    { label: 'Sobre', href: '/#about' },
    { label: 'Produtos', href: '/#services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Avaliações', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contato', href: '/#contact' },
  ]

  return (
    <>
      {/* Barra de Progresso de Scroll Animada */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Logo Image */}
                <img 
                  src="/logo.png" 
                  alt="Venda Forte Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback se imagem não existir
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement!
                    parent.classList.add('bg-red-600')
                    parent.innerHTML = '<span class="text-white font-bold text-xl">VF</span>'
                  }}
                />
              </div>
              <div>
                <div className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Venda Forte
                </div>
                <p className={`text-xs font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-gray-500' : 'text-white/80'
                }`}>
                  Grupo
                </p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`font-medium relative group transition-colors duration-300 ${
                      isScrolled 
                        ? 'text-gray-800 hover:text-red-600' 
                        : 'text-white hover:text-red-300'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${
                      isScrolled ? 'bg-red-600' : 'bg-white'
                    }`}></span>
                  </motion.a>
                ))}
                
                {/* Ícone Admin */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    href="/admin/login"
                    className={`p-2 rounded-lg transition-all ${
                      isScrolled
                        ? 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
                        : 'hover:bg-white/10 text-white'
                    }`}
                    title="Painel Admin"
                  >
                    <Settings size={20} />
                  </Link>
                </motion.div>
                
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  aria-label="Solicitar orçamento de empilhadeiras"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  Fale Conosco
                </motion.a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md transition-colors ${
                  isScrolled 
                    ? 'text-gray-800 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${
              isScrolled ? 'bg-white' : 'bg-gray-900/95 backdrop-blur-lg'
            } shadow-lg border-t ${
              isScrolled ? 'border-gray-200' : 'border-white/10'
            }`}
          >
            <div className="px-4 pt-4 pb-6 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                    isScrolled
                      ? 'text-gray-800 hover:bg-red-50 hover:text-red-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                aria-label="Entre em contato pelo formulário"
                className="block px-4 py-3 mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg transition-all text-center font-semibold"
              >
                Entre em Contato
              </a>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  )
}
