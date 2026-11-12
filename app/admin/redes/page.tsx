'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Download, Loader2, MessageSquare, Search } from 'lucide-react'
import AdminNav, { useMe } from '@/components/admin/AdminNav'
import { canEdit, canReview } from '@/lib/permissions'
import {
  CHANNELS,
  CHANNEL_STYLE,
  STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  shortDate,
  weekStart,
  weekdayShort,
  type Channel,
  type SocialPost,
  type Status,
} from '@/lib/social'

type Row = SocialPost & { comments: number }

const CHIP = 'rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
const CHIP_ON = `${CHIP} border-white bg-white text-ink`
const CHIP_OFF = `${CHIP} border-white/10 bg-ink-raised text-neutral-200 hover:bg-white/[0.06]`

export default function RedesPage() {
  const me = useMe()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [missingTables, setMissingTables] = useState(false)
  const [status, setStatus] = useState<Status | 'todos'>('todos')
  const [channel, setChannel] = useState<Channel | 'todos'>('todos')
  const [query, setQuery] = useState('')
  const [importing, setImporting] = useState(false)
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/redes')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMissingTables(Boolean(data.missingTables))
        setError(data.error || 'Não foi possível carregar os textos.')
        setRows([])
      } else {
        setError('')
        setMissingTables(false)
        setRows(data.posts as Row[])
      }
    } catch {
      setError('Sem conexão com o servidor. Tente de novo em instantes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Depois da primeira renderização: o carregamento muda o estado da tela
    void Promise.resolve().then(load)
  }, [load])

  async function importar() {
    setImporting(true)
    setNotice('')
    try {
      const res = await fetch('/api/redes', { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setNotice(data.error || 'Não foi possível importar.')
      else {
        setNotice(data.imported ? `${data.imported} ${data.imported === 1 ? 'peça importada' : 'peças importadas'} do calendário.` : 'Todas as peças do calendário já estão aqui.')
        await load()
      }
    } catch {
      setNotice('Sem conexão com o servidor.')
    } finally {
      setImporting(false)
    }
  }

  const counts = useMemo(() => {
    const result = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>
    for (const row of rows) result[row.status] += 1
    return result
  }, [rows])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return rows.filter(
      (row) =>
        (status === 'todos' || row.status === status) &&
        (channel === 'todos' || row.channel === channel) &&
        (!term || `${row.title} ${row.post_title ?? ''} ${row.caption}`.toLowerCase().includes(term))
    )
  }, [rows, status, channel, query])

  const weeks = useMemo(() => {
    const groups = new Map<string, Row[]>()
    for (const row of visible) {
      const key = weekStart(row.scheduled_for)
      groups.set(key, [...(groups.get(key) || []), row])
    }
    return [...groups.entries()]
  }, [visible])

  const mayEdit = canEdit(me)
  const waiting = counts.em_aprovacao

  return (
    <div className="min-h-screen bg-ink ">
      <AdminNav active="redes" />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Redes sociais</h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-400">
              Legenda, arte e conversa de cada peça do calendário (Instagram, LinkedIn, Facebook, WhatsApp e Perfil Google). Quem escreve manda para aprovação; Paulo e Rodrigo aprovam ou pedem ajustes aqui mesmo.
            </p>
          </div>
          {mayEdit && rows.length > 0 && (
            <button
              onClick={importar}
              disabled={importing}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-raised px-4 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:bg-white/[0.06] disabled:opacity-60"
            >
              {importing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Importar peças novas do calendário
            </button>
          )}
        </header>

        {notice && (
          <div role="status" className="mb-6 rounded-[28px] border border-white/10 bg-ink-raised px-5 py-3 text-sm font-semibold text-neutral-200">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            <p className="flex items-center gap-2 font-bold">
              <AlertTriangle size={18} /> {missingTables ? 'Falta uma preparação no banco de dados' : 'Não foi possível abrir'}
            </p>
            <p className="mt-2 leading-relaxed">{error}</p>
            {missingTables && (
              <ol className="mt-4 list-decimal space-y-1 pl-5 leading-relaxed">
                <li>Abra o projeto no Supabase e entre em SQL Editor.</li>
                <li>
                  Cole o conteúdo de <strong>supabase/migrations/2026-11-02-redes-sociais-e-revisores.sql</strong> e clique em Run.
                </li>
                <li>Volte aqui e recarregue a página.</li>
              </ol>
            )}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-ink-raised p-10 text-center ">
            <h2 className="text-lg font-bold text-white">Ainda não há peças aqui</h2>
            {mayEdit ? (
              <>
                <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-400">
                  O calendário tem as peças de Instagram, LinkedIn, Facebook, WhatsApp e Perfil Google com data e responsável. Importar cria uma peça vazia para cada uma, pronta para receber a legenda. Nada é publicado.
                </p>
                <button
                  onClick={importar}
                  disabled={importing}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {importing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Importar do calendário
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">Quando o Gustavo importar as peças do calendário, elas aparecem aqui.</p>
            )}
          </div>
        ) : (
          <>
            {canReview(me) && waiting > 0 && (
              <button
                onClick={() => setStatus('em_aprovacao')}
                className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-6 py-4 text-left text-sm font-semibold text-amber-300 hover:bg-amber-500/15"
              >
                <CheckCircle2 size={18} />
                {waiting === 1 ? '1 texto espera a sua aprovação.' : `${waiting} textos esperam a sua aprovação.`} Clique para ver.
              </button>
            )}

            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por andamento">
              <button onClick={() => setStatus('todos')} className={status === 'todos' ? CHIP_ON : CHIP_OFF} aria-pressed={status === 'todos'}>
                Todos <span className="opacity-60">({rows.length})</span>
              </button>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatus(s)} className={status === s ? CHIP_ON : CHIP_OFF} aria-pressed={status === s}>
                  {STATUS_LABEL[s]} <span className="opacity-60">({counts[s]})</span>
                </button>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-3">
              <label className="relative min-w-[16rem] flex-1">
                <span className="sr-only">Buscar por título ou legenda</span>
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por título, post ou legenda..."
                  className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-ink-muted focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por rede">
                <button onClick={() => setChannel('todos')} className={channel === 'todos' ? CHIP_ON : CHIP_OFF} aria-pressed={channel === 'todos'}>
                  Todas as redes
                </button>
                {CHANNELS.map((c) => (
                  <button key={c} onClick={() => setChannel(c)} className={channel === c ? CHIP_ON : CHIP_OFF} aria-pressed={channel === c}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <p className="mb-4 text-xs font-semibold text-ink-muted">
              Mostrando {visible.length} de {rows.length} peças
            </p>

            {visible.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-ink-raised p-10 text-center text-sm text-neutral-400 ">
                Nenhuma peça com esses filtros.{' '}
                <button
                  className="font-bold text-red-500 hover:underline"
                  onClick={() => {
                    setStatus('todos')
                    setChannel('todos')
                    setQuery('')
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {weeks.map(([week, items]) => (
                  <section key={week} aria-label={`Semana de ${shortDate(week)}`}>
                    <h2 className="mb-3 text-xs font-bold text-ink-muted">Semana de {shortDate(week)}</h2>
                    <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised ">
                      {items.map((row) => (
                        <li key={row.id}>
                          <Link
                            href={`/admin/redes/${row.id}`}
                            className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-white/[0.06]"
                          >
                            <span className="w-16 shrink-0 text-sm font-bold tabular-nums text-white">
                              <span className="block text-[10px] font-semibold text-ink-muted">{weekdayShort(row.scheduled_for)}</span>
                              {shortDate(row.scheduled_for)}
                            </span>
                            <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${CHANNEL_STYLE[row.channel]}`}>{row.channel}</span>
                            <span className="min-w-[14rem] flex-1">
                              <span className="block text-sm font-semibold text-white">{row.title}</span>
                              <span className="block text-xs text-ink-muted">
                                {row.post_number ? `Post ${row.post_number}: ${row.post_title}` : 'Fora dos posts do blog'}
                                {row.conditional && ' · depende de confirmação'}
                              </span>
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-ink-muted">{row.caption.trim() ? 'Legenda escrita' : 'Sem legenda'}</span>
                            {row.comments > 0 && (
                              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink-muted" title={`${row.comments} comentários`}>
                                <MessageSquare size={14} />
                                {row.comments}
                              </span>
                            )}
                            <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${STATUS_STYLE[row.status]}`}>{STATUS_LABEL[row.status]}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
