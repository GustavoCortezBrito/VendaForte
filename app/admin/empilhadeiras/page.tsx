'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import { BTN_ICON, BTN_PRIMARY, BTN_WHITE, CHIP_OFF, CHIP_ON, EYEBROW, INPUT, PAGE_TITLE } from '@/components/admin/ui'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Trash2, Edit, Plus, Eye, Search,
  ChevronLeft, ChevronRight, Truck, ExternalLink, Loader2
} from 'lucide-react'
import { askConfirm, notify } from '@/components/admin/Feedback'

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
    if (!(await askConfirm(`Tem certeza que deseja excluir o modelo "${title}"?`, { confirmLabel: 'Excluir' }))) return

    try {
      const res = await fetch(`/api/empilhadeiras?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setForklifts(prev => prev.filter(item => item.id !== id))
        notify(`Equipamento "${title}" excluído com sucesso!`)
      } else {
        const errData = await res.json()
        notify(`Erro ao excluir: ${errData.error}`)
      }
    } catch {
      notify('Erro na requisição ao excluir.')
    }
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-ink pb-20">
      <AdminNav active="empilhadeiras">
        <Link
          href="/empilhadeiras-eletricas"
          target="_blank"
          className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:flex"
        >
          <ExternalLink size={15} aria-hidden="true" />
          <span>Ver no site</span>
        </Link>
        <Link href="/admin/empilhadeiras/novo" className={BTN_PRIMARY}>
          <Plus size={14} aria-hidden="true" />
          <span>Novo equipamento</span>
        </Link>
      </AdminNav>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <header className="max-w-3xl">
          <p className={EYEBROW}>Catálogo</p>
          <h1 className={`mt-3 ${PAGE_TITLE}`}>Empilhadeiras</h1>
          <p className="mt-3 text-neutral-400">{forklifts.length} modelos cadastrados.</p>
        </header>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
            <input
              type="search"
              aria-label="Buscar equipamento"
              placeholder="Buscar por modelo, subtítulo ou capacidade…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className={`${INPUT} rounded-full pl-11`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar pela tensão da bateria">
            <span className="mr-1 text-sm text-ink-muted">Bateria</span>
            {['all', '24V', '48V', '80V'].map((v) => (
              <button key={v} type="button" onClick={() => setVoltageFilter(v)} aria-pressed={voltageFilter === v} className={voltageFilter === v ? CHIP_ON : CHIP_OFF}>
                {v === 'all' ? 'Todas' : v}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p role="status" className="mt-16 flex items-center justify-center gap-3 text-sm font-medium text-neutral-400">
            <Loader2 size={18} className="animate-spin text-red-500" aria-hidden="true" />
            Carregando os equipamentos…
          </p>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-white/15 bg-ink-raised px-6 py-16 text-center">
            <Truck className="mx-auto text-neutral-600" size={40} aria-hidden="true" />
            <p className="mt-4 text-xl font-semibold text-white">Nenhum equipamento encontrado</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">Mude a busca ou o filtro de bateria.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedItems.map((item) => {
                const voltBadge = (item.batteryVoltage || '80V').replace(/\s+/g, '').toUpperCase()
                return (
                  <motion.li key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised transition-colors duration-300 hover:border-white/25">
                      {/* Fotos do catálogo são recortes de fundo branco: o quadro precisa ser branco */}
                      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[22px] bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.mainImage || '/sede.png'}
                          alt={item.title}
                          className="h-full w-full object-contain p-4 mix-blend-multiply"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/sede.png' }}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">{voltBadge}</span>
                      </div>

                      <div className="flex flex-1 flex-col p-5 pt-3">
                        <h2 className="text-lg font-semibold tracking-tight text-white">{item.title}</h2>
                        <p className="mt-0.5 line-clamp-1 text-sm text-neutral-400">{item.subtitle || item.type || 'Empilhadeira elétrica'}</p>

                        <dl className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-2xl bg-white/[0.03] px-3 py-2">
                            <dt className="text-[11px] text-ink-muted">Carga</dt>
                            <dd className="text-sm font-semibold text-white">{item.capacity || '—'}</dd>
                          </div>
                          <div className="rounded-2xl bg-white/[0.03] px-3 py-2">
                            <dt className="text-[11px] text-ink-muted">Elevação</dt>
                            <dd className="text-sm font-semibold text-white">{item.liftingHeight || '—'}</dd>
                          </div>
                        </dl>

                        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                          <div className="flex gap-2">
                            <Link
                              href={`/empilhadeiras-eletricas/${item.slug}`}
                              target="_blank"
                              className={BTN_ICON}
                              title="Ver no site"
                              aria-label={`Ver ${item.title} no site`}
                            >
                              <Eye size={17} aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.title)}
                              className={`${BTN_ICON} hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400`}
                              title="Excluir"
                              aria-label={`Excluir ${item.title}`}
                            >
                              <Trash2 size={17} aria-hidden="true" />
                            </button>
                          </div>
                          <Link href={`/admin/empilhadeiras/editar/${item.id}`} className={BTN_WHITE} aria-label={`Editar ${item.title}`}>
                            <Edit size={13} aria-hidden="true" />
                            <span>Editar</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </motion.li>
                )
              })}
            </ul>

            {totalPages > 1 && (
              <nav aria-label="Páginas" className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={BTN_ICON}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNumber) => {
                      if (totalPages <= 7) return true
                      return pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 2
                    })
                    .map((pageNumber, idx, array) => {
                      const prevPage = array[idx - 1]
                      const showEllipsis = prevPage && pageNumber - prevPage > 1
                      return (
                        <div key={pageNumber} className="flex items-center gap-2">
                          {showEllipsis && <span aria-hidden="true" className="px-1 text-ink-muted">…</span>}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(pageNumber)}
                            aria-current={currentPage === pageNumber ? 'page' : undefined}
                            aria-label={`Página ${pageNumber}`}
                            className={`grid h-11 w-11 cursor-pointer place-items-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                              currentPage === pageNumber ? 'bg-red-600 text-white' : 'border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </div>
                      )
                    })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={BTN_ICON}
                    aria-label="Próxima página"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="text-sm text-neutral-400">
                  Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} a {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} empilhadeiras
                </p>
              </nav>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
