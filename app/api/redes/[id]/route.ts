import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { canEdit, FORBIDDEN_EDIT_MESSAGE } from '@/lib/permissions'
import {
  CAPTION_LIMIT,
  isAction,
  isMissingTable,
  MISSING_TABLE_HINT,
  nextStatus,
  type SocialComment,
  type SocialPost,
} from '@/lib/social'
import { supabaseAdmin } from '@/lib/supabase'

type Context = { params: Promise<{ id: string }> }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE = /^\d{4}-\d{2}-\d{2}$/
const COMMENT_MAX = 2000

const fail = (error: string, status: number) => NextResponse.json({ error }, { status })
const missing = () => NextResponse.json({ error: MISSING_TABLE_HINT, missingTables: true }, { status: 503 })

async function load(id: string) {
  const { data, error } = await supabaseAdmin.from('social_posts').select('*').eq('id', id).maybeSingle()
  return { post: (data as SocialPost | null) ?? null, error }
}

async function addComment(post: SocialPost, user: { id: string; name: string; role: string }, kind: SocialComment['kind'], body: string) {
  return supabaseAdmin.from('social_comments').insert({
    post_id: post.id,
    author_id: user.id,
    author_name: user.name,
    author_role: user.role,
    kind,
    body,
  })
}

/** GET - Um texto com a conversa dele. Qualquer perfil logado. */
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return fail('Não autenticado', 401)

    const { id } = await params
    if (!UUID.test(id)) return fail('Texto não encontrado', 404)

    const { post, error } = await load(id)
    if (error) return isMissingTable(error.message) ? missing() : fail('Não foi possível carregar o texto.', 503)
    if (!post) return fail('Texto não encontrado', 404)

    const { data: comments } = await supabaseAdmin
      .from('social_comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    return NextResponse.json({ post, comments: comments || [] })
  } catch (error) {
    console.error('Erro ao ler texto da rede:', error)
    return fail('Erro interno do servidor', 500)
  }
}

/**
 * PATCH - Edita os campos (editor e admin) e/ou muda o andamento (`acao`).
 * Mexer na legenda de um texto em aprovação ou aprovado o devolve para rascunho; publicado só muda
 * depois de "voltar para rascunho". Pedido de ajustes exige um comentário.
 */
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return fail('Não autenticado', 401)

    const { id } = await params
    if (!UUID.test(id)) return fail('Texto não encontrado', 404)

    const body = await request.json().catch(() => ({}))
    const { post, error } = await load(id)
    if (error) return isMissingTable(error.message) ? missing() : fail('Não foi possível carregar o texto.', 503)
    if (!post) return fail('Texto não encontrado', 404)

    const update: Record<string, unknown> = {}
    const comment = typeof body.comentario === 'string' ? body.comentario.trim() : ''
    if (comment.length > COMMENT_MAX) return fail(`O comentário passa de ${COMMENT_MAX} caracteres.`, 400)

    // 1) Campos do texto
    const touchesFields = ['caption', 'art_url', 'art_note', 'scheduled_for'].some((key) => key in body)
    if (touchesFields) {
      if (!canEdit(user)) return fail(FORBIDDEN_EDIT_MESSAGE, 403)
      if (post.status === 'publicado') return fail('Este texto já foi publicado. Devolva para rascunho antes de alterar.', 409)

      if ('caption' in body) {
        if (typeof body.caption !== 'string') return fail('Legenda inválida.', 400)
        if (body.caption.length > CAPTION_LIMIT[post.channel]) {
          return fail(`A legenda do ${post.channel} passa de ${CAPTION_LIMIT[post.channel]} caracteres.`, 400)
        }
        update.caption = body.caption
      }
      if ('art_url' in body) {
        const url = typeof body.art_url === 'string' ? body.art_url.trim() : ''
        if (url && !/^https?:\/\/\S+$/i.test(url)) return fail('O link da arte precisa começar com http:// ou https://.', 400)
        update.art_url = url || null
      }
      if ('art_note' in body) {
        if (typeof body.art_note !== 'string' || body.art_note.length > 1000) return fail('Orientação da arte inválida ou longa demais.', 400)
        update.art_note = body.art_note.trim() || null
      }
      if ('scheduled_for' in body) {
        const date = typeof body.scheduled_for === 'string' ? body.scheduled_for : ''
        if (date && (!DATE.test(date) || Number.isNaN(Date.parse(date)))) return fail('Data inválida.', 400)
        update.scheduled_for = date || null
      }

      const captionChanged = 'caption' in update && update.caption !== post.caption
      if (captionChanged && (post.status === 'em_aprovacao' || post.status === 'aprovado')) {
        update.status = 'rascunho'
        update.reviewed_by = null
        update.reviewed_at = null
      }
    }

    // 2) Mudança de andamento
    let newStatus = post.status
    let kind: SocialComment['kind'] = 'comentario'
    if (body.acao !== undefined) {
      if (!isAction(body.acao)) return fail('Ação desconhecida.', 400)
      if (touchesFields) return fail('Salve os campos e depois mude o andamento, uma coisa por vez.', 400)

      const result = nextStatus(body.acao, post.status, user.role, post)
      if (!result.ok) return fail(result.error, 403)
      if (body.acao === 'ajustes' && !comment) return fail('Explique o que precisa mudar para pedir ajustes.', 400)

      newStatus = result.status
      update.status = newStatus
      if (body.acao === 'aprovar' || body.acao === 'ajustes') {
        update.reviewed_by = user.id
        update.reviewed_at = new Date().toISOString()
        kind = body.acao === 'aprovar' ? 'aprovado' : 'ajustes'
      }
      if (body.acao === 'publicar') update.published_at = new Date().toISOString()
      if (body.acao === 'voltar') {
        update.reviewed_by = null
        update.reviewed_at = null
        update.published_at = null
      }
    }

    if (!Object.keys(update).length && !comment) return fail('Nada para alterar.', 400)

    if (Object.keys(update).length) {
      // Só grava se o texto ainda está no status em que foi lido: dois cliques ao mesmo tempo não passam por cima um do outro
      const { data: saved, error: saveError } = await supabaseAdmin
        .from('social_posts')
        .update(update)
        .eq('id', id)
        .eq('status', post.status)
        .select('id')
      if (saveError) {
        console.error('Erro ao salvar texto da rede:', saveError)
        return fail('Não foi possível salvar. Nada foi alterado.', 500)
      }
      if (!saved || saved.length === 0) return fail('Outra pessoa mexeu neste texto agora há pouco. Recarregue a página e tente de novo.', 409)
    }

    if (comment || kind !== 'comentario') {
      const { error: commentError } = await addComment(post, user, kind, comment)
      if (commentError) console.error('Erro ao registrar comentário:', commentError)
    }

    const { post: fresh } = await load(id)
    return NextResponse.json({ post: fresh, statusChanged: newStatus !== post.status })
  } catch (error) {
    console.error('Erro ao atualizar texto da rede:', error)
    return fail('Erro interno do servidor', 500)
  }
}

/** POST - Comentário solto num texto. Qualquer perfil logado, inclusive o revisor. */
export async function POST(request: NextRequest, { params }: Context) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return fail('Não autenticado', 401)

    const { id } = await params
    if (!UUID.test(id)) return fail('Texto não encontrado', 404)

    const body = await request.json().catch(() => ({}))
    const text = typeof body.comentario === 'string' ? body.comentario.trim() : ''
    if (!text) return fail('Escreva o comentário.', 400)
    if (text.length > COMMENT_MAX) return fail(`O comentário passa de ${COMMENT_MAX} caracteres.`, 400)

    const { post, error } = await load(id)
    if (error) return isMissingTable(error.message) ? missing() : fail('Não foi possível carregar o texto.', 503)
    if (!post) return fail('Texto não encontrado', 404)

    const { error: commentError } = await addComment(post, user, 'comentario', text)
    if (commentError) {
      console.error('Erro ao registrar comentário:', commentError)
      return fail('Não foi possível enviar o comentário.', 500)
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro ao comentar texto da rede:', error)
    return fail('Erro interno do servidor', 500)
  }
}
