/**
 * Lê o calendário de conteúdo (docs/seo/agenda-conteudo.json) e separa as peças que viram texto de
 * rede social. Fica num arquivo à parte, só do servidor, para o JSON não ir para o navegador.
 */
import agenda from '@/docs/seo/agenda-conteudo.json'
import { isChannel, type Channel, type SocialPost, type Status } from '@/lib/social'

interface AgendaItem {
  id: string
  condicional?: boolean
  post?: number
  tituloPost?: string
  data: string
  canal: string
  titulo: string
  link?: string
  responsavel?: string
  nota?: string
}

/** Peças do calendário que viram texto de rede social (as outras são prazos, revisões e feriados). */
export function socialItemsFromAgenda(): Omit<SocialPost, 'id' | 'created_at' | 'updated_at'>[] {
  return (agenda as AgendaItem[])
    .filter((item) => isChannel(item.canal))
    .map((item) => ({
      source_id: item.id,
      channel: item.canal as Channel,
      post_number: item.post ?? null,
      post_title: item.tituloPost ?? null,
      title: item.titulo,
      caption: '',
      art_url: null,
      art_note: item.nota ?? null,
      link: item.link ?? null,
      scheduled_for: item.data,
      owner: item.responsavel ?? null,
      conditional: Boolean(item.condicional),
      status: 'rascunho' as Status,
      reviewed_by: null,
      reviewed_at: null,
      published_at: null,
    }))
}
