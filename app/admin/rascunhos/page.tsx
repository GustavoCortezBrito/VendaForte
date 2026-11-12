import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, CheckCircle2, Clock, Eye, Pencil, Plus, XCircle } from 'lucide-react'
import DraftsHeader from '@/components/admin/DraftsHeader'
import ImportDraftsButton from '@/components/admin/ImportDraftsButton'
import { getCurrentUser } from '@/lib/auth'
import { canEdit } from '@/lib/permissions'
import { formatPostDate } from '@/lib/blog-format'
import { getDraftOverview, type DraftSummary } from '@/lib/drafts'

export const metadata: Metadata = {
  title: 'Rascunhos | Painel Venda Forte',
  robots: { index: false, follow: false },
}

// O estado muda a cada importação, edição ou publicação: a lista precisa mostrar o de agora
export const dynamic = 'force-dynamic'

function Status({ draft }: { draft: DraftSummary }) {
  const errors = draft.checks.filter((check) => check.level === 'erro').length
  const warnings = draft.checks.filter((check) => check.level === 'aviso').length
  return (
    <>
      {errors > 0 && (
        <span className="inline-flex items-center gap-1 font-semibold text-red-500">
          <XCircle size={14} aria-hidden="true" />
          {errors} {errors === 1 ? 'erro' : 'erros'}
        </span>
      )}
      {warnings > 0 && (
        <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
          <AlertTriangle size={14} aria-hidden="true" />
          {warnings} {warnings === 1 ? 'aviso' : 'avisos'}
        </span>
      )}
      {errors === 0 && warnings === 0 && (
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
          <CheckCircle2 size={14} aria-hidden="true" />
          Conferência sem problemas
        </span>
      )}
    </>
  )
}

function DraftCard({ draft, mayEdit }: { draft: DraftSummary; mayEdit: boolean }) {
  const fromFile = draft.source === 'arquivo'
  return (
    <article className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-ink-raised p-5 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={draft.image || '/sede.png'} alt="" className="aspect-[16/9] w-full rounded-xl bg-white/[0.06] object-cover sm:w-48 sm:shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span
            className={`rounded-full px-2.5 py-1 ${fromFile ? 'bg-sky-500/15 text-sky-300' : 'bg-amber-500/15 text-amber-300'}`}
          >
            {fromFile ? 'Texto pronto, falta importar' : 'Rascunho'}
          </span>
          {draft.category && <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-red-400">{draft.category}</span>}
          {draft.plannedDate && (
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <Clock size={13} aria-hidden="true" />
              Previsto para {formatPostDate(draft.plannedDate)}
            </span>
          )}
          {draft.updatedAt && (
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <Clock size={13} aria-hidden="true" />
              Alterado em {formatPostDate(draft.updatedAt, 'short')}
            </span>
          )}
        </div>

        <h2 className="mt-2 text-lg font-bold leading-snug text-white">{draft.title || 'Sem título'}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{draft.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span>
            {draft.words} palavras · {draft.readingTime}
          </span>
          <Status draft={draft} />
          {fromFile && (
            <span className="font-semibold text-neutral-200">
              {draft.pending.length} {draft.pending.length === 1 ? 'pendência' : 'pendências'}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-2 sm:flex-col">
        <Link
          href={`/admin/rascunhos/${draft.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          <Eye size={16} aria-hidden="true" />
          Visualizar
        </Link>
        {!fromFile && mayEdit && (
          <Link
            href={`/admin/blog/editar/${draft.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-ink-raised px-5 py-3 text-sm font-bold text-neutral-100 transition-colors hover:bg-white/[0.06]"
          >
            <Pencil size={16} aria-hidden="true" />
            Editar
          </Link>
        )}
      </div>
    </article>
  )
}

export default async function DraftsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')
  const mayEdit = canEdit(user)

  const { drafts, files, databaseOk } = await getDraftOverview()

  return (
    <div className="min-h-screen bg-white/[0.03]">
      <DraftsHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Rascunhos do blog</h1>
            <p className="mt-2 max-w-3xl text-neutral-400">
              Textos que ainda não foram ao ar. Visualize como ficará no site, edite, e publique quando estiver pronto. Rascunho{' '}
              <strong>não aparece no blog, na busca nem no mapa do site</strong>.
            </p>
          </div>
          {mayEdit && (
            <Link
              href="/admin/blog/novo"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-raised px-5 py-3 text-sm font-bold text-neutral-100 transition-colors hover:bg-white/[0.06]"
            >
              <Plus size={16} aria-hidden="true" />
              Novo rascunho
            </Link>
          )}
        </header>

        {!databaseOk && (
          <div role="alert" className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
            <p className="font-bold">O banco de dados não respondeu.</p>
            <p className="mt-1">Os rascunhos salvos no painel não aparecem agora, e não dá para importar. Recarregue a página em instantes.</p>
          </div>
        )}

        {databaseOk && files.length > 0 && (
          <section className="mb-10 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5" aria-labelledby="prontos">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-xl">
                <h2 id="prontos" className="text-lg font-extrabold text-sky-200">
                  {files.length} {files.length === 1 ? 'texto pronto' : 'textos prontos'} para entrar no painel
                </h2>
                <p className="mt-1 text-sm text-sky-300">
                  Estão no projeto, mas ainda não no painel. Importar cria um rascunho de cada um (nada vai ao ar e nada existente é
                  sobrescrito); depois você edita e publica por aqui. Dá para visualizar antes de importar.
                </p>
              </div>
              {mayEdit && <ImportDraftsButton count={files.length} />}
            </div>
            <ul className="mt-5 space-y-3">
              {files.map((draft) => (
                <li key={draft.slug}>
                  <DraftCard draft={draft} mayEdit={mayEdit} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="no-painel">
          <h2 id="no-painel" className="mb-4 text-lg font-extrabold text-white">
            No painel {databaseOk && <span className="font-medium text-ink-muted">({drafts.length})</span>}
          </h2>
          {databaseOk && drafts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/15 bg-ink-raised p-10 text-center">
              <p className="text-lg font-semibold text-neutral-100">Nenhum rascunho no painel</p>
              <p className="mt-2 text-ink-muted">Crie um com “Novo rascunho”, ou importe os textos prontos, se houver.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {drafts.map((draft) => (
                <li key={draft.slug}>
                  <DraftCard draft={draft} mayEdit={mayEdit} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
