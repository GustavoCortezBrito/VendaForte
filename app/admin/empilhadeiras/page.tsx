'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Trash2, Edit, Plus, Eye, LogOut, Search,
  ChevronLeft, ChevronRight, Truck, FileText, ExternalLink
} from 'lucide-react'

interface Forklift {
  id: string
  slug: string
  title: string
  subtitle: string
  type: string
  capacity: string
  liftingHeight: string
  batteryVoltage: string
  mainImage: string
  description: string
}

export default function AdminEmpilhadeirasPage() {
  const router = useRouter()
  const [forklifts, setForklifts] = useState<Forklift[]>([])
  const [filtered, setFiltered] = useState<Forklift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [voltageFilter, setVoltageFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) router.push('/admin/login')
        else fetchForklifts()
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  useEffect(() => {
    filterData()
  }, [forklifts, searchTerm, voltageFilter])

  async function fetchForklifts() {
    try {
      const res = await fetch('/api/empilhadeiras')
      const data = await res.json()
      setForklifts(data.forklifts || [])
    } catch (err) {
      console.error('Erro ao carregar empilhadeiras:', err)
    } finally {
      setLoading(false)
    }
  }

  function filterData() {
    let result = forklifts

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase()
      result = result.filter(item =>
        item.title.toLowerCase().includes(s) ||
        item.subtitle.toLowerCase().includes(s) ||
        item.capacity.toLowerCase().includes(s) ||
        item.slug.toLowerCase().includes(s)
      )
    }

    if (voltageFilter !== 'all') {
      result = result.filter(item => {
        const v = (item.batteryVoltage || '').replace(/\s+/g, '').toUpperCase()
        return v.includes(voltageFilter.toUpperCase())
      })
    }

    setFiltered(result)
    setCurrentPage(1)
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Tem certeza que deseja excluir o modelo "${title}"?`)) return

    try {
      const res = await fetch(`/api/empilhadeiras?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setForklifts(prev => prev.filter(item => item.id !== id))
        alert(`Equipamento "${title}" excluído com sucesso!`)
      } else {
        const errData = await res.json()
        alert(`Erro ao excluir: ${errData.error}`)
      }
    } catch {
      alert('Erro na requisição ao excluir.')
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-20">

      {/* ── Navbar Admin (identidade visual da Homepage) ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-600/20">
                  VF
                </div>
                <div>
                  <span className="text-base font-bold text-gray-900 leading-none block">Venda Forte</span>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Painel Admin</span>
                </div>
              </Link>

              {/* Tabs de navegação */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/admin/empilhadeiras"
                  className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-red-600/20"
                >
                  <Truck size={14} />
                  <span>Empilhadeiras</span>
                </Link>
                <Link
                  href="/admin/blog"
                  className="px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <FileText size={14} />
                  <span>Blog & Notícias</span>
                </Link>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/empilhadeiras-eletricas"
                target="_blank"
                className="text-xs font-semibold text-gray-600 hover:text-red-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Ver no Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Sair do Painel"
              >
                <LogOut size={18} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="text-red-600 font-semibold text-xs uppercase tracking-wider">Gestão do Catálogo</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Catálogo de <span className="text-red-600">Empilhadeiras</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {forklifts.length} modelos cadastrados e disponíveis para visualização pública.
            </p>
          </div>

          <Link
            href="/admin/empilhadeiras/novo"
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Novo Equipamento</span>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por modelo, subtítulo ou capacidade..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bateria:</span>
            {['all', '80V', '48V'].map(v => (
              <button
                key={v}
                onClick={() => setVoltageFilter(v)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  voltageFilter === v
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {v === 'all' ? 'Todas' : v}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-600">Carregando equipamentos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
            <Truck className="mx-auto text-gray-300 mb-3" size={48} />
            <h3 className="text-base font-bold text-gray-900">Nenhum equipamento encontrado</h3>
            <p className="text-xs text-gray-500 mt-1">Tente ajustar seus termos de pesquisa ou filtros.</p>
          </div>
        ) : (
          /* Grid of Forklifts */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedItems.map(item => {
                const voltBadge = (item.batteryVoltage || '80V').replace(/\s+/g, '').toUpperCase()
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-slate-100 p-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.mainImage || '/sede.png'}
                          alt={item.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).src = '/sede.png' }}
                        />
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                          {voltBadge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-base group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-red-600 font-semibold mt-0.5 line-clamp-1">
                          {item.subtitle || item.type || 'Empilhadeira Elétrica'}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                          <div className="bg-gray-50 rounded-xl p-2">
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">Carga</span>
                            <span className="font-bold text-gray-800">{item.capacity || '—'}</span>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-2">
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">Elevação</span>
                            <span className="font-bold text-gray-800">{item.liftingHeight || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between gap-2 mt-2">
                      <Link
                        href={`/empilhadeiras-eletricas/${item.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                        title="Ver no site"
                      >
                        <Eye size={16} />
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/empilhadeiras/editar/${item.id}`}
                          className="px-3 py-1.5 rounded-full bg-gray-900 hover:bg-red-600 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit size={12} />
                          <span>Editar</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Paginação - Estilo Blog Admin */}
            {totalPages > 1 && (
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:bg-red-50 hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 bg-white"
                    title="Página anterior"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(pageNumber => {
                        if (totalPages <= 7) return true
                        return (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 2
                        )
                      })
                      .map((pageNumber, idx, array) => {
                        const prevPage = array[idx - 1]
                        const showEllipsis = prevPage && pageNumber - prevPage > 1
                        return (
                          <div key={pageNumber} className="flex items-center gap-2">
                            {showEllipsis && <span className="text-gray-400 font-bold px-1">...</span>}
                            <button
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full font-bold transition-all text-sm sm:text-base ${
                                currentPage === pageNumber
                                  ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-100'
                                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-600 hover:text-red-600 hover:scale-105 active:scale-95'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          </div>
                        )
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:bg-red-50 hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 bg-white"
                    title="Próxima página"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Info de resultados */}
                <div className="text-center">
                  <p className="text-gray-600 font-medium text-sm">
                    Mostrando <span className="text-red-600 font-bold">{Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}-{Math.min(currentPage * itemsPerPage, filtered.length)}</span> de <span className="text-red-600 font-bold">{filtered.length}</span> empilhadeiras
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
