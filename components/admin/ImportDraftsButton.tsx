'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from 'lucide-react'

/** Leva os textos prontos em arquivo para o painel, como rascunho. Só roda ao clicar. */
export default function ImportDraftsButton({ count }: { count: number }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  async function run() {
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/api/blog/importar-rascunhos', { method: 'POST' })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!response.ok && response.status !== 207) {
        setMessage({ ok: false, text: data.error || 'Não foi possível importar. Tente de novo em instantes.' })
        return
      }
      const imported: string[] = data.imported ?? []
      const failed: { slug: string; error: string }[] = data.failed ?? []
      if (failed.length) {
        setMessage({
          ok: false,
          text: `${imported.length} importado(s). Não entraram: ${failed.map((item) => `${item.slug} (${item.error})`).join('; ')}.`,
        })
      } else {
        setMessage({ ok: true, text: `${imported.length} rascunho(s) importado(s) para o painel.` })
      }
      router.refresh()
    } catch {
      setMessage({ ok: false, text: 'Sem conexão com o servidor. Tente de novo.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
        {busy ? 'Importando...' : `Importar ${count} ${count === 1 ? 'texto' : 'textos'} para o painel`}
      </button>
      {message && (
        <p role="status" className={`max-w-md text-sm font-medium ${message.ok ? 'text-green-700' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
