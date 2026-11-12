'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'

/**
 * Avisos e confirmações do painel, no estilo do site, no lugar das janelas do navegador
 * (`alert` e `confirm`). O `FeedbackHost` fica uma vez no layout do painel; `notify` e `askConfirm`
 * podem ser chamados de qualquer tela. Se nenhum host estiver montado, caem de volta nas janelas
 * do navegador, então uma mensagem nunca se perde.
 */

type Tone = 'ok' | 'erro'

interface ToastItem {
  id: number
  message: string
  tone: Tone
}

interface ConfirmRequest {
  message: string
  confirmLabel: string
  danger: boolean
  resolve: (ok: boolean) => void
}

const toastListeners = new Set<(toast: ToastItem) => void>()
type ConfirmListener = (request: ConfirmRequest) => void

let confirmListener: ConfirmListener | null = null
let sequence = 0

// Fora do componente: o host registra e solta o ouvinte por aqui
const registerConfirm = (listener: ConfirmListener) => {
  confirmListener = listener
}
const unregisterConfirm = (listener: ConfirmListener) => {
  if (confirmListener === listener) confirmListener = null
}

// Quase todas as mensagens do painel são de erro ou de aviso quando começam assim; o resto é sucesso
const PROBLEM = /^(erro|por favor|informe|não foi|nao foi|não encontrado|sem conexão|falha)|\berro\b|não foi publicado|tente de novo/i

/** Mostra um aviso na tela. O tom (sucesso ou problema) sai do texto, a não ser que seja informado. */
export function notify(message: string, tone?: Tone) {
  const resolved: Tone = tone ?? (PROBLEM.test(message) ? 'erro' : 'ok')
  if (toastListeners.size === 0) {
    window.alert(message)
    return
  }
  const toast = { id: ++sequence, message, tone: resolved }
  toastListeners.forEach((listener) => listener(toast))
}

/** Pergunta antes de uma ação sem volta. Resolve `true` se a pessoa confirmar. */
export function askConfirm(message: string, options: { confirmLabel?: string; danger?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (!confirmListener) {
      resolve(window.confirm(message))
      return
    }
    confirmListener({ message, confirmLabel: options.confirmLabel ?? 'Confirmar', danger: options.danger ?? true, resolve })
  })
}

export default function FeedbackHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [request, setRequest] = useState<ConfirmRequest | null>(null)
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const dialog = useRef<HTMLDivElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)

  const dismiss = (id: number) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const timerMap = timers.current
    const onToast = (toast: ToastItem) => {
      setToasts((current) => [...current.slice(-3), toast])
      timerMap.set(
        toast.id,
        setTimeout(() => {
          timerMap.delete(toast.id)
          setToasts((current) => current.filter((item) => item.id !== toast.id))
        }, toast.tone === 'erro' ? 9000 : 5000)
      )
    }
    toastListeners.add(onToast)
    registerConfirm(setRequest)
    return () => {
      toastListeners.delete(onToast)
      unregisterConfirm(setRequest)
      timerMap.forEach((timer) => clearTimeout(timer))
      timerMap.clear()
    }
  }, [])

  const answer = (ok: boolean) => {
    request?.resolve(ok)
    setRequest(null)
  }

  // Confirmação: o foco entra no "Cancelar", Tab não escapa, Esc cancela e o foco volta de onde veio
  useEffect(() => {
    if (!request) return
    const opener = document.activeElement as HTMLElement | null
    cancel.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        request.resolve(false)
        setRequest(null)
        return
      }
      if (event.key !== 'Tab') return
      const items = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled])')
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [request])

  return (
    <MotionConfig reducedMotion="user">
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              role={toast.tone === 'erro' ? 'alert' : 'status'}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-[22px] border bg-ink-raised py-3 pl-4 pr-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] ${
                toast.tone === 'erro' ? 'border-red-500/40' : 'border-emerald-500/30'
              }`}
            >
              {toast.tone === 'erro' ? (
                <CircleAlert size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-red-400" />
              ) : (
                <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-400" />
              )}
              <p className="min-w-0 flex-1 py-0.5 text-sm leading-relaxed text-neutral-100">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Fechar o aviso"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {request && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center overscroll-contain bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => answer(false)}
          >
            <motion.div
              ref={dialog}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-mensagem"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-ink-raised p-7 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
            >
              <p id="confirm-mensagem" className="text-base leading-relaxed text-neutral-100">
                {request.message}
              </p>
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  ref={cancel}
                  type="button"
                  onClick={() => answer(false)}
                  className="h-11 cursor-pointer rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => answer(true)}
                  className={`h-11 cursor-pointer rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    request.danger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-ink hover:bg-neutral-200'
                  }`}
                >
                  {request.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
