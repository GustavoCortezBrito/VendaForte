import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { canEdit, FORBIDDEN_EDIT_MESSAGE } from '@/lib/permissions'
import { isMissingTable, MISSING_TABLE_HINT, type SocialPost } from '@/lib/social'
import { socialItemsFromAgenda } from '@/lib/social-agenda'
import { supabaseAdmin } from '@/lib/supabase'

const missing = () => NextResponse.json({ error: MISSING_TABLE_HINT, missingTables: true }, { status: 503 })

/** GET - Lista os textos das redes, com a quantidade de comentários de cada um. Qualquer perfil logado. */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('social_posts')
      .select('*')
      .order('scheduled_for', { ascending: true })
      .order('channel', { ascending: true })

    if (error) {
      if (isMissingTable(error.message)) return missing()
      return NextResponse.json({ error: 'Não foi possível carregar os textos. Tente de novo em instantes.' }, { status: 503 })
    }

    const { data: comments } = await supabaseAdmin.from('social_comments').select('post_id')
    const counts: Record<string, number> = {}
    for (const row of comments || []) counts[row.post_id] = (counts[row.post_id] || 0) + 1

    const posts = ((data || []) as SocialPost[]).map((post) => ({ ...post, comments: counts[post.id] || 0 }))
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Erro ao listar textos das redes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

/**
 * POST - Importa as peças de rede social do calendário (docs/seo/agenda-conteudo.json) como rascunho vazio.
 * Nunca sobrescreve: peça que já existe (mesmo source_id) é pulada. Só roda pelo botão do painel.
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    if (!canEdit(user)) return NextResponse.json({ error: FORBIDDEN_EDIT_MESSAGE }, { status: 403 })

    const { data: existing, error: readError } = await supabaseAdmin.from('social_posts').select('source_id')
    if (readError) {
      if (isMissingTable(readError.message)) return missing()
      return NextResponse.json({ error: 'O banco de dados não respondeu, então nada foi importado.' }, { status: 503 })
    }

    const have = new Set((existing || []).map((row) => row.source_id))
    const items = socialItemsFromAgenda()
    const toInsert = items.filter((item) => !have.has(item.source_id))

    if (toInsert.length) {
      const { error } = await supabaseAdmin.from('social_posts').insert(toInsert)
      if (error) {
        console.error('Erro ao importar textos das redes:', error)
        return NextResponse.json({ error: 'Não foi possível importar. Nada foi gravado.' }, { status: 500 })
      }
    }

    return NextResponse.json({ imported: toInsert.length, alreadyThere: items.length - toInsert.length })
  } catch (error) {
    console.error('Erro ao importar textos das redes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
