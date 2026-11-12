/**
 * Textos das redes sociais: tipos, rótulos e regras de cada passo do fluxo.
 *
 * Fluxo: rascunho -> em_aprovacao -> aprovado -> publicado. O revisor (Paulo, Rodrigo) ou o admin
 * aprova ou pede ajustes; quem escreve (editor, admin) manda para aprovação e marca como publicado.
 * Mexer na legenda de um texto aprovado ou publicado o devolve para rascunho: o que foi aprovado
 * não pode mudar sem nova aprovação.
 */
import { canEdit, canReview, type Role } from '@/lib/permissions'

export const CHANNELS = ['Instagram', 'LinkedIn', 'Facebook', 'WhatsApp', 'Perfil Google'] as const
export type Channel = (typeof CHANNELS)[number]

export const STATUSES = ['rascunho', 'em_aprovacao', 'ajustes', 'aprovado', 'publicado'] as const
export type Status = (typeof STATUSES)[number]

export const STATUS_LABEL: Record<Status, string> = {
  rascunho: 'Rascunho',
  em_aprovacao: 'Em aprovação',
  ajustes: 'Pedido de ajustes',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
}

export const STATUS_STYLE: Record<Status, string> = {
  rascunho: 'bg-white/[0.04] text-neutral-300 border-white/10',
  em_aprovacao: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  ajustes: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  aprovado: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  publicado: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
}

/** Limite de caracteres de cada rede para a legenda; o aviso aparece perto do limite. */
export const CAPTION_LIMIT: Record<Channel, number> = {
  Instagram: 2200,
  LinkedIn: 3000,
  Facebook: 5000,
  WhatsApp: 1000,
  'Perfil Google': 1500,
}

export interface SocialPost {
  id: string
  source_id: string | null
  channel: Channel
  post_number: number | null
  post_title: string | null
  title: string
  caption: string
  art_url: string | null
  art_note: string | null
  link: string | null
  scheduled_for: string | null
  owner: string | null
  conditional: boolean
  status: Status
  reviewed_by: string | null
  reviewed_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface SocialComment {
  id: string
  post_id: string
  author_id: string | null
  author_name: string
  author_role: string | null
  kind: 'comentario' | 'aprovado' | 'ajustes'
  body: string
  created_at: string
}

export const isChannel = (value: unknown): value is Channel => (CHANNELS as readonly string[]).includes(value as string)
export const isStatus = (value: unknown): value is Status => (STATUSES as readonly string[]).includes(value as string)

/** Mensagem para quando as tabelas ainda não existem no Supabase (SQL não rodou). */
export const MISSING_TABLE_HINT =
  'As tabelas das redes sociais ainda não existem no Supabase. Rode o arquivo supabase/migrations/2026-11-02-redes-sociais-e-revisores.sql no SQL Editor do Supabase e recarregue esta página.'

export const isMissingTable = (message: string | undefined | null) =>
  /social_(posts|comments)|schema cache|does not exist|relation .* does not exist/i.test(message || '')

export type Action = 'enviar' | 'aprovar' | 'ajustes' | 'publicar' | 'voltar'

/** Quem pode fazer o quê, e de qual status para qual. Devolve o novo status ou o motivo da recusa. */
export function nextStatus(
  action: Action,
  from: Status,
  role: Role,
  post: Pick<SocialPost, 'caption'>
): { ok: true; status: Status } | { ok: false; error: string } {
  const user = { role }
  switch (action) {
    case 'enviar':
      if (!canEdit(user)) return { ok: false, error: 'Só quem edita manda para aprovação.' }
      if (from !== 'rascunho' && from !== 'ajustes') return { ok: false, error: 'Só rascunho ou pedido de ajustes vai para aprovação.' }
      if (!post.caption.trim()) return { ok: false, error: 'Escreva a legenda antes de mandar para aprovação.' }
      return { ok: true, status: 'em_aprovacao' }
    case 'aprovar':
      if (!canReview(user)) return { ok: false, error: 'Só o revisor ou o admin aprova.' }
      if (from !== 'em_aprovacao') return { ok: false, error: 'Só o que está em aprovação pode ser aprovado.' }
      return { ok: true, status: 'aprovado' }
    case 'ajustes':
      if (!canReview(user)) return { ok: false, error: 'Só o revisor ou o admin pede ajustes.' }
      if (from !== 'em_aprovacao') return { ok: false, error: 'Só o que está em aprovação recebe pedido de ajustes.' }
      return { ok: true, status: 'ajustes' }
    case 'publicar':
      if (!canEdit(user)) return { ok: false, error: 'Só quem edita marca como publicado.' }
      if (from !== 'aprovado') return { ok: false, error: 'Só um texto aprovado pode ser marcado como publicado.' }
      return { ok: true, status: 'publicado' }
    case 'voltar':
      if (!canEdit(user)) return { ok: false, error: 'Só quem edita devolve para rascunho.' }
      if (from === 'rascunho') return { ok: false, error: 'Já é rascunho.' }
      return { ok: true, status: 'rascunho' }
  }
}

export const ACTIONS: readonly Action[] = ['enviar', 'aprovar', 'ajustes', 'publicar', 'voltar']
export const isAction = (value: unknown): value is Action => (ACTIONS as readonly string[]).includes(value as string)

/** "2026-11-05" -> "05/11" (sem fuso: a data do calendário é a data do dia, não um instante). */
export function shortDate(iso: string | null | undefined): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return match ? `${match[3]}/${match[2]}` : 'sem data'
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

const utcDate = (iso: string | null | undefined) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null
}

/** "2026-11-05" -> "qui". */
export function weekdayShort(iso: string | null | undefined): string {
  const date = utcDate(iso)
  return date ? WEEKDAYS[date.getUTCDay()] : ''
}

/** Segunda-feira da semana da data, como "2026-11-02"; agrupa a lista por semana. */
export function weekStart(iso: string | null | undefined): string {
  const date = utcDate(iso)
  if (!date) return ''
  const back = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - back)
  return date.toISOString().slice(0, 10)
}

/** Cor de cada rede na lista (só para reconhecer de relance; não imita a marca). */
export const CHANNEL_STYLE: Record<Channel, string> = {
  Instagram: 'bg-pink-50 text-pink-800 border-pink-200',
  LinkedIn: 'bg-blue-50 text-blue-800 border-blue-200',
  Facebook: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  WhatsApp: 'bg-green-50 text-green-800 border-green-200',
  'Perfil Google': 'bg-yellow-50 text-yellow-800 border-yellow-200',
}
