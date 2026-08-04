'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Truck, FileText, ArrowRight, LogOut, ExternalLink, Settings, ShieldCheck } from 'lucide-react'

export default function AdminHubPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/admin/login')
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data) {
          setUser(data.user)
          setLoading(false)
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-600">Carregando Painel Administrativo...</p>
        </div>
      </div>
    )
  }

  const SECTIONS = [
    {
      id: 'empilhadeiras',
      title: 'Catálogo de Empilhadeiras',
      subtitle: 'Gestão de Equipamentos Industriais',
      description: 'Cadastre e edite empilhadeiras elétricas, capacidades de carga, fichas técnicas completas e galeria de imagens.',
      badge: 'Catálogo Público',
      icon: Truck,
      href: '/admin/empilhadeiras',
      gradient: 'from-red-600 to-red-700',
      lightBg: 'bg-red-50',
      borderColor: 'hover:border-red-500',
      buttonText: 'Gerenciar Catálogo',
    },
    {
      id: 'blog',
      title: 'Blog & Notícias',
      subtitle: 'Publicações e Artigos Técnicos',
      description: 'Crie e edite postagens do blog da Venda Forte, dicas de manutenção preventiva, operação e novidades da linha EP Equipment.',
      badge: 'Conteúdo & SEO',
      icon: FileText,
      href: '/admin/blog',
      gradient: 'from-gray-900 to-slate-800',
      lightBg: 'bg-gray-100',
      borderColor: 'hover:border-gray-900',
      buttonText: 'Gerenciar Blog',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex flex-col justify-between">

      {/* Header Admin */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-600/20">
                VF
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 leading-none block">Venda Forte</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Painel de Controle</span>
              </div>
            </Link>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-xs font-semibold text-gray-600 hover:text-red-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Ver Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Sair da Conta"
              >
                <LogOut size={18} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Conteúdo Principal Hub */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-red-600 font-semibold text-xs uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Painel Administrativo Venda Forte
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
            O que você deseja <span className="text-red-600">gerenciar hoje?</span>
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Selecione uma das opções abaixo para administrar os produtos do catálogo ou as publicações do blog.
          </p>
        </motion.div>

        {/* Grid de Escolha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SECTIONS.map((sec, idx) => (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link
                href={sec.href}
                className={`group bg-white border border-gray-200 ${sec.borderColor} rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden`}
              >
                {/* Efeito sutil no fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 bg-gradient-to-br ${sec.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <sec.icon size={26} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">{sec.subtitle}</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-red-600 transition-colors">
                      {sec.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-8 mt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-red-600">
                  <span>{sec.buttonText}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </main>

      {/* Footer minimalista */}
      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-400">
        Venda Forte Painel Admin &copy; {new Date().getFullYear()} — Todos os direitos reservados.
      </footer>

    </div>
  )
}
