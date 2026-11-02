'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const isHomePage = pathname === '/'
  // Header é considerado "light" (fundo branco / texto escuro) se rolou OU se está em qualquer página que não seja a home
  const isLightHeader = isScrolled || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'Início', href: '/#home' },
    { label: 'Produtos', href: '/produtos' },
    { label: 'Sobre', href: '/#about' },
    { label: 'Serviços', href: '/#services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Avaliações', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contato', href: '/#contact' },
  ]

  return (
    <>
      {/* Barra de progresso da rolagem: CSS puro (ver .scroll-progress em globals.css) */}
      <div
        aria-hidden="true"
        className="scroll-progress fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 z-[60]"
      />

      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isLightHeader 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" aria-label="Página Inicial - Grupo Venda Forte" title="Grupo Venda Forte - Página Inicial" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Logo Image */}
                <img 
                  src="/logo.png" 
                  alt="Venda Forte Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement!
                    parent.classList.add('bg-red-600')
                    parent.innerHTML = '<span class="text-white font-bold text-xl">VF</span>'
                  }}
                />
              </div>
              <div>
                <div className={`text-xl font-bold transition-colors duration-300 ${
                  isLightHeader ? 'text-gray-900' : 'text-white'
                }`}>
                  Venda Forte
                </div>
                <p className={`text-xs font-medium transition-colors duration-300 ${
                  isLightHeader ? 'text-gray-500' : 'text-white/80'
                }`}>
                  Grupo
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {menuItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={`Acessar seção ${item.label}`}
                    className={`font-medium relative group transition-colors duration-300 ${
                      isLightHeader 
                        ? 'text-gray-800 hover:text-red-600' 
                        : 'text-white hover:text-red-300'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${
                      isLightHeader ? 'bg-red-600' : 'bg-white'
                    }`}></span>
                  </a>
                ))}

                <Link
                  href="/admin"
                  rel="nofollow"
                  aria-label="Acessar Painel Administrativo"
                  title="Painel Administrativo"
                  className={`p-2 rounded-lg transition-all ${
                    isLightHeader
                      ? 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <Settings size={20} />
                </Link>

                <a
                  href="/#contact"
                  aria-label="Fale Conosco - Solicitar orçamento de empilhadeiras"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  Fale Conosco
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md transition-colors ${
                  isLightHeader 
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
          <div
            aria-hidden="true"
            className={`md:hidden ${
              isLightHeader ? 'bg-white' : 'bg-gray-900/95 backdrop-blur-lg'
            } shadow-lg border-t ${
              isLightHeader ? 'border-gray-200' : 'border-white/10'
            }`}
          >
            <div className="px-4 pt-4 pb-6 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  tabIndex={-1}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                    isLightHeader
                      ? 'text-gray-800 hover:bg-red-50 hover:text-red-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/#contact"
                tabIndex={-1}
                onClick={() => setIsOpen(false)}
                aria-label="Entre em contato pelo formulário"
                className="block px-4 py-3 mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg transition-all text-center font-semibold"
              >
                Entre em Contato
              </a>
              <Link
                href="/admin"
                rel="nofollow"
                tabIndex={-1}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${
                  isLightHeader ? 'text-gray-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Settings size={16} />
                Painel administrativo
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
