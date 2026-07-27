'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Trash2, 
  Edit, 
  Plus, 
  Eye, 
  LogOut, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Truck,
  FileText,
  Zap,
  SlidersHorizontal,
  RotateCcw
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
    // Autenticação
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
    } catch (err) {
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
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-gray-900 text-white sticky top-0 z-50 border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-lg">
              <span className="bg-red-600 px-2 py-0.5 rounded font-black">VF</span>
              <span>Venda Forte Admin</span>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-2">
              <Link
                href="/admin/empilhadeiras"
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Truck size={14} />
                <span>Empilhadeiras</span>
              </Link>
              <Link
                href="/admin/blog"
                className="px-3.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText size={14} />
                <span>Blog & Notícias</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/empilhadeiras-eletricas"
              target="_blank"
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <Eye size={14} />
              <span>Ver Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
              title="Sair do Painel"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Title & CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Gerenciar Empilhadeiras & Equipamentos
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Administre os {forklifts.length} modelos cadastrados no catálogo da Venda Forte.
            </p>
          </div>

          <Link
            href="/admin/empilhadeiras/novo"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all"
          >
            <Plus size={16} />
            <span>Novo Equipamento</span>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por modelo, título ou capacidade..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Voltagem:</span>
            <button
              onClick={() => setVoltageFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                voltageFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setVoltageFilter('80V')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                voltageFilter === '80V' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              80V
            </button>
            <button
              onClick={() => setVoltageFilter('48V')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                voltageFilter === '48V' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              48V
            </button>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-600">Carregando catálogo de equipamentos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <Truck className="mx-auto text-gray-300 mb-3" size={48} />
            <h3 className="text-base font-bold text-gray-900">Nenhum equipamento encontrado</h3>
            <p className="text-xs text-gray-500 mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Imagem</th>
                    <th className="py-3.5 px-4">Modelo / Título</th>
                    <th className="py-3.5 px-4">Capacidade</th>
                    <th className="py-3.5 px-4">Elevação</th>
                    <th className="py-3.5 px-4">Voltagem</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                          <img src={item.mainImage} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-gray-900 text-base">{item.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{item.capacity}</td>
                      <td className="py-3 px-4 font-bold text-gray-700">{item.liftingHeight}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-extrabold text-[10px]">
                          {item.batteryVoltage} Li-Ion
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/empilhadeiras-eletricas/${item.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Visualizar no site"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/empilhadeiras/editar/${item.id}`}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Exibindo {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
