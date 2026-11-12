'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Download, ExternalLink, Loader2, Pencil, Rocket, Undo2, X } from 'lucide-react'

interface PostActionsProps {
  slug: string
  /** `banco`: já está no painel; `arquivo`: texto pronto ainda sem importar. */
  source: 'banco' | 'arquivo'
  published: boolean
  /** Quantidade de erros da conferência automática: com erro, não dá para publicar. */
  errors: number
  /** Quando preenchido, publicar e despublicar ficam desativados e o motivo aparece na tela (ambiente local). */
  blockedReason?: string
  /** Perfil de revisor: pode ler o texto, mas não importar, editar nem publicar. */
  readOnly?: boolean
}

/** O que a pessoa confirma antes de publicar. Não fica guardado: vale para este clique. */
const CONFIRMATIONS = [
  'O Paulo (ou quem ele indicou) revisou o texto técnico.',
  'Conferi os números na ficha oficial da EP.',
  'A capa e as imagens estão certas.',
]

const ACTION =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

/** Botões de um post na tela de visualização: importar, editar, publicar e despublicar. */
export default function PostActions({ slug, source, published, errors, blockedReason, readOnly }: PostActionsProps) {
  const router = useRouter()
  const [dialog, setDialog] = useState<'publicar' | 'despublicar' | null>(null)
  const [checked, setChecked] = useState<boolean[]>(CONFIRMATIONS.map(() => false))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const firstCheckbox = useRef<HTMLInputElement>(null)
  const cancelButton = useRef<HTMLButtonElement>(null)

  const allChecked = checked.every(Boolean)

  function close() {
    setDialog(null)
    setError('')
    setChecked(CONFIRMATIONS.map(() => false))
  }

  useEffect(() => {
    if (!dialog) return
    if (dialog === 'publicar') firstCheckbox.current?.focus()
    else cancelButton.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dialog, busy])

  async function send(request: () => Promise<Response>, onDone: () => void) {
    setBusy(true)
    setError('')
    try {
      const response = await request()
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok && response.status !== 207) {
        setError(data.error || 'Não foi possível concluir. Tente de novo em instantes.')
        return
      }
      onDone()
      router.refresh()
    } catch {
      setError('Sem conexão com o servidor. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  function setPublished(value: boolean) {
    return send(
      () =>
        fetch('/api/blog', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, published: value }),
        }),
      () => {
        setNotice(value ? 'Publicado. O blog atualiza em instantes.' : 'Despublicado. O post saiu do blog.')
        close()
      }
    )
  }

  function importFile() {
    return send(
      () =>
        fetch('/api/blog/importar-rascunhos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        }),
      () => setNotice('Importado para o painel como rascunho.')
    )
  }

  if (readOnly) {
    return (
      <p className="max-w-xs text-sm font-semibold text-ink-muted md:text-right">
        Você pode ler e conferir este texto. Quem edita e publica é quem escreve; para pedir mudança, fale com o Gustavo.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <div className="flex flex-wrap gap-2">
        {source === 'arquivo' && (
          <button
            type="button"
            onClick={importFile}
            disabled={busy}
            className={`${ACTION} bg-white text-ink hover:bg-neutral-200 focus-visible:outline-white`}
          >
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
            Importar para o painel
          </button>
        )}

        {source === 'banco' && (
          <Link
            href={`/admin/blog/editar/${slug}`}
            className={`${ACTION} border border-white/15 bg-ink-raised text-neutral-100 hover:bg-white/[0.06] focus-visible:outline-white`}
          >
            <Pencil size={16} aria-hidden="true" />
            Editar texto
          </Link>
        )}

        {source === 'banco' && !published && (
          <button
            type="button"
            onClick={() => setDialog('publicar')}
            disabled={Boolean(blockedReason)}
            className={`${ACTION} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600`}
          >
            <Rocket size={16} aria-hidden="true" />
            Publicar
          </button>
        )}

        {source === 'banco' && published && (
          <>
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ACTION} border border-white/15 bg-ink-raised text-neutral-100 hover:bg-white/[0.06] focus-visible:outline-white`}
            >
              <ExternalLink size={16} aria-hidden="true" />
              Ver no site
            </a>
            <button
              type="button"
              onClick={() => setDialog('despublicar')}
              disabled={Boolean(blockedReason)}
              className={`${ACTION} border border-red-500/30 bg-ink-raised text-red-400 hover:bg-red-500/15 focus-visible:outline-red-600`}
            >
              <Undo2 size={16} aria-hidden="true" />
              Despublicar
            </button>
          </>
        )}
      </div>

      {blockedReason && ((source === 'banco' && !published) || published) && (
        <p role="status" className="max-w-md text-sm font-semibold text-amber-300">
          {blockedReason}
        </p>
      )}
      {error && !dialog && (
        <p role="alert" className="max-w-md text-sm font-medium text-red-500">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
          <CheckCircle2 size={16} aria-hidden="true" />
          {notice}
        </p>
      )}

      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => !busy && close()}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialogo-titulo"
            className="w-full max-w-lg rounded-2xl bg-ink-raised p-6 text-left shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="dialogo-titulo" className="text-xl font-extrabold text-white">
                {dialog === 'publicar' ? 'Publicar este post?' : 'Tirar este post do blog?'}
              </h2>
              <button
                type="button"
                onClick={close}
                disabled={busy}
                aria-label="Fechar"
                className="rounded-full p-1 text-ink-muted hover:bg-white/10 hover:text-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {dialog === 'publicar' ? (
              <>
                <p className="mt-2 text-sm text-neutral-400">
                  O post vai para o blog agora, com a data de hoje, e entra no mapa do site. Confirme cada item:
                </p>
                <ul className="mt-4 space-y-3">
                  {CONFIRMATIONS.map((text, index) => (
                    <li key={text}>
                      <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-100">
                        <input
                          ref={index === 0 ? firstCheckbox : undefined}
                          type="checkbox"
                          checked={checked[index]}
                          onChange={(event) =>
                            setChecked((prev) => prev.map((value, i) => (i === index ? event.target.checked : value)))
                          }
                          className="mt-0.5 h-4 w-4 accent-red-600"
                        />
                        {text}
                      </label>
                    </li>
                  ))}
                </ul>
                {errors > 0 && (
                  <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-400">
                    A conferência automática achou {errors} {errors === 1 ? 'erro' : 'erros'}. Corrija antes de publicar.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">
                O post volta a ser rascunho: sai da lista do blog, da busca e do mapa do site, e o endereço deixa de abrir. O
                texto fica guardado no painel.
              </p>
            )}

            {error && (
              <p role="alert" className="mt-4 text-sm font-medium text-red-500">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                ref={cancelButton}
                onClick={close}
                disabled={busy}
                className={`${ACTION} border border-white/15 bg-ink-raised text-neutral-100 hover:bg-white/[0.06] focus-visible:outline-white`}
              >
                Cancelar
              </button>
              {dialog === 'publicar' ? (
                <button
                  type="button"
                  onClick={() => setPublished(true)}
                  disabled={busy || !allChecked || errors > 0}
                  className={`${ACTION} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600`}
                >
                  {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Rocket size={16} aria-hidden="true" />}
                  {busy ? 'Publicando...' : 'Publicar agora'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPublished(false)}
                  disabled={busy}
                  className={`${ACTION} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600`}
                >
                  {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Undo2 size={16} aria-hidden="true" />}
                  {busy ? 'Despublicando...' : 'Despublicar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
