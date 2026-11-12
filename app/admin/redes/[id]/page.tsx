'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, Copy, Loader2, Send, Undo2, XCircle } from 'lucide-react'
import AdminNav, { useMe } from '@/components/admin/AdminNav'
import { canEdit } from '@/lib/permissions'
import {
  CAPTION_LIMIT,
  CHANNEL_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
  nextStatus,
  shortDate,
  weekdayShort,
  type Action,
  type SocialComment,
  type SocialPost,
} from '@/lib/social'

const FIELD =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-ink-muted focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:bg-white/[0.03] disabled:text-neutral-400'
const BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'

const ACTION_BUTTON: Record<Action, { label: string; icon: typeof Send; style: string }> = {
  enviar: { label: 'Mandar para aprovação', icon: Send, style: 'bg-red-600 text-white hover:bg-red-700' },
  aprovar: { label: 'Aprovar', icon: CheckCircle2, style: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  ajustes: { label: 'Pedir ajustes', icon: XCircle, style: 'border border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/15' },
  publicar: { label: 'Marcar como publicado', icon: Check, style: 'bg-sky-600 text-white hover:bg-sky-700' },
  voltar: { label: 'Voltar para rascunho', icon: Undo2, style: 'border border-white/10 bg-ink-raised text-neutral-200 hover:bg-white/[0.06]' },
}

const KIND_LABEL: Record<SocialComment['kind'], string> = { comentario: 'Comentário', aprovado: 'Aprovou', ajustes: 'Pediu ajustes' }
const KIND_STYLE: Record<SocialComment['kind'], string> = {
  comentario: 'bg-white/[0.06] text-neutral-200',
  aprovado: 'bg-emerald-500/15 text-emerald-300',
  ajustes: 'bg-orange-500/15 text-orange-300',
}

const when = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export default function RedeDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const me = useMe()
  const [post, setPost] = useState<SocialPost | null>(null)
  const [comments, setComments] = useState<SocialComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [caption, setCaption] = useState('')
  const [artUrl, setArtUrl] = useState('')
  const [artNote, setArtNote] = useState('')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [copied, setCopied] = useState('')

  const apply = useCallback((next: SocialPost) => {
    setPost(next)
    setCaption(next.caption)
    setArtUrl(next.art_url ?? '')
    setArtNote(next.art_note ?? '')
  }, [])

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/redes/${id}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Não foi possível abrir este texto.')
      } else {
        setError('')
        apply(data.post)
        setComments(data.comments)
      }
    } catch {
      setError('Sem conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }, [id, apply])

  useEffect(() => {
    // Depois da primeira renderização: o carregamento muda o estado da tela
    void Promise.resolve().then(load)
  }, [load])

  async function send(body: Record<string, unknown>, okText: string) {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/redes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ ok: false, text: data.error || 'Não foi possível salvar.' })
        return false
      }
      if (data.post) apply(data.post)
      setComment('')
      setMessage({ ok: true, text: okText })
      await load()
      return true
    } catch {
      setMessage({ ok: false, text: 'Sem conexão com o servidor.' })
      return false
    } finally {
      setBusy(false)
    }
  }

  async function sendComment() {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/redes/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario: comment }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setMessage({ ok: false, text: data.error || 'Não foi possível enviar o comentário.' })
      else {
        setComment('')
        await load()
      }
    } catch {
      setMessage({ ok: false, text: 'Sem conexão com o servidor.' })
    } finally {
      setBusy(false)
    }
  }

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setMessage({ ok: false, text: 'O navegador não deixou copiar. Selecione o texto e copie à mão.' })
    }
  }

  const mayEdit = canEdit(me)
  const locked = !mayEdit || post?.status === 'publicado'
  const dirty = Boolean(post) && (caption !== post!.caption || artUrl !== (post!.art_url ?? '') || artNote !== (post!.art_note ?? ''))
  const limit = post ? CAPTION_LIMIT[post.channel] : 0
  const over = caption.length > limit

  const actions = post && me ? (Object.keys(ACTION_BUTTON) as Action[]).filter((a) => nextStatus(a, post.status, me.role, { caption: post.caption }).ok) : []

  return (
    <div className="min-h-screen bg-ink ">
      <AdminNav active="redes" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/admin/redes" className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-red-400">
          <ArrowLeft size={14} /> Voltar para as redes sociais
        </Link>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : error || !post ? (
          <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm font-semibold text-red-300">
            <AlertTriangle size={18} className="mb-2" /> {error || 'Texto não encontrado.'}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-6">
              <header className="rounded-[28px] border border-white/10 bg-ink-raised p-6 ">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${CHANNEL_STYLE[post.channel]}`}>{post.channel}</span>
                  <span className="text-xs font-bold tabular-nums text-neutral-200">
                    {weekdayShort(post.scheduled_for)} {shortDate(post.scheduled_for)}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${STATUS_STYLE[post.status]}`}>{STATUS_LABEL[post.status]}</span>
                  {post.conditional && (
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-bold text-neutral-400">Depende de confirmação</span>
                  )}
                </div>
                <h1 className="mt-4 text-xl font-bold leading-snug text-white sm:text-2xl">{post.title}</h1>
                <p className="mt-2 text-sm text-neutral-400">
                  {post.post_number ? `Ligado ao post ${post.post_number} do blog: “${post.post_title}”.` : 'Não está ligado a um post do blog.'}
                  {post.owner ? ` Responsável: ${post.owner}.` : ''}
                </p>
              </header>

              <section className="rounded-[28px] border border-white/10 bg-ink-raised p-6 ">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="legenda" className="text-sm font-bold text-white">
                    Legenda
                  </label>
                  <button
                    onClick={() => copy(caption, 'legenda')}
                    disabled={!caption.trim()}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:bg-white/10 disabled:opacity-40"
                  >
                    {copied === 'legenda' ? <Check size={14} /> : <Copy size={14} />}
                    {copied === 'legenda' ? 'Copiada' : 'Copiar legenda'}
                  </button>
                </div>
                <textarea
                  id="legenda"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={locked}
                  rows={12}
                  placeholder={mayEdit ? 'Escreva a legenda como vai aparecer na rede.' : 'O Gustavo ainda não escreveu a legenda.'}
                  className={FIELD}
                />
                <p className={`mt-2 text-xs font-semibold tabular-nums ${over ? 'text-red-500' : 'text-ink-muted'}`}>
                  {caption.length} de {limit} caracteres no {post.channel}
                </p>

                {post.link && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold text-ink-muted">Link com rastreio (vai na legenda)</p>
                    <p className="mt-1 break-all text-xs text-neutral-200">{post.link}</p>
                    <button onClick={() => copy(post.link!, 'link')} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline">
                      {copied === 'link' ? <Check size={14} /> : <Copy size={14} />}
                      {copied === 'link' ? 'Copiado' : 'Copiar link'}
                    </button>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="arte-link" className="mb-1 block text-xs font-bold text-ink-muted">
                      Link da arte
                    </label>
                    <input
                      id="arte-link"
                      value={artUrl}
                      onChange={(e) => setArtUrl(e.target.value)}
                      disabled={locked}
                      placeholder="https://drive.google.com/..."
                      className={FIELD}
                    />
                    {artUrl && /^https?:\/\//i.test(artUrl) && (
                      <a href={artUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-semibold text-red-500 hover:underline">
                        Abrir a arte
                      </a>
                    )}
                  </div>
                  <div>
                    <label htmlFor="arte-nota" className="mb-1 block text-xs font-bold text-ink-muted">
                      O que a arte mostra
                    </label>
                    <textarea id="arte-nota" value={artNote} onChange={(e) => setArtNote(e.target.value)} disabled={locked} rows={3} className={FIELD} />
                  </div>
                </div>

                {mayEdit && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => send({ caption, art_url: artUrl, art_note: artNote }, 'Salvo.')}
                      disabled={busy || !dirty || over || post.status === 'publicado'}
                      className={`${BUTTON} bg-white text-ink hover:bg-neutral-200`}
                    >
                      {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Salvar
                    </button>
                    {(post.status === 'em_aprovacao' || post.status === 'aprovado') && dirty && (
                      <p className="text-xs font-semibold text-amber-400">Mudar a legenda devolve o texto para rascunho: a aprovação vale só para o que foi aprovado.</p>
                    )}
                    {post.status === 'publicado' && <p className="text-xs font-semibold text-ink-muted">Já publicado. Volte para rascunho para alterar.</p>}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-white/10 bg-ink-raised p-6 " aria-label="Andamento">
                <h2 className="text-sm font-bold text-white">Andamento</h2>
                {post.reviewed_at && (post.status === 'aprovado' || post.status === 'ajustes') && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {post.status === 'aprovado' ? 'Aprovado' : 'Ajustes pedidos'} em {when(post.reviewed_at)}.
                  </p>
                )}
                {dirty && actions.length > 0 && <p className="mt-3 text-xs font-semibold text-amber-400">Salve as mudanças antes de mudar o andamento.</p>}
                {actions.includes('ajustes') && !comment.trim() && (
                  <p className="mt-3 text-xs text-ink-muted">Para pedir ajustes, escreva o que precisa mudar na caixa de comentário, na conversa abaixo.</p>
                )}
                <div className="mt-4 flex flex-col gap-3">
                  {actions.length === 0 && <p className="text-xs text-ink-muted">Nada para você fazer neste texto agora.</p>}
                  {actions.map((action) => {
                    const { label, icon: Icon, style } = ACTION_BUTTON[action]
                    const needsComment = action === 'ajustes'
                    return (
                      <button
                        key={action}
                        onClick={() => send({ acao: action, comentario: comment }, `${label}: feito.`)}
                        disabled={busy || dirty || (needsComment && !comment.trim())}
                        title={needsComment && !comment.trim() ? 'Explique o que precisa mudar na caixa de comentário' : undefined}
                        className={`${BUTTON} ${style}`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-ink-raised p-6 " aria-label="Conversa">
                <h2 className="text-sm font-bold text-white">Conversa</h2>
                <ul className="mt-4 space-y-4">
                  {comments.length === 0 && <li className="text-xs text-ink-muted">Ninguém comentou ainda.</li>}
                  {comments.map((c) => (
                    <li key={c.id} className="text-sm">
                      <p className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                        <strong className="text-neutral-100">{c.author_name}</strong>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${KIND_STYLE[c.kind]}`}>{KIND_LABEL[c.kind]}</span>
                        <span className="tabular-nums">{when(c.created_at)}</span>
                      </p>
                      {c.body && <p className="mt-1 whitespace-pre-wrap leading-relaxed text-neutral-100">{c.body}</p>}
                    </li>
                  ))}
                </ul>
                <label htmlFor="comentario" className="sr-only">
                  Comentário
                </label>
                <textarea
                  id="comentario"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Escreva um comentário. Para pedir ajustes, diga o que precisa mudar."
                  className={`${FIELD} mt-5`}
                />
                <button onClick={sendComment} disabled={busy || !comment.trim()} className={`${BUTTON} mt-3 w-full border border-white/10 bg-ink-raised text-neutral-100 hover:bg-white/[0.06]`}>
                  Enviar comentário
                </button>
              </section>

              {message && (
                <p role="status" className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${message.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                  {message.text}
                </p>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
