import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getUserFromRequest } from '@/lib/auth'
import { getFilesToImport, isDraftSlug } from '@/lib/drafts'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST - Leva os textos prontos de content/rascunhos para o painel, como rascunho (published = false).
 * Nunca sobrescreve: um endereço que já existe no banco é pulado. Só roda a pedido, pelo botão do painel.
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Corpo opcional: { slug } importa só esse rascunho; sem corpo, importa todos os que faltam
    const body = await request.json().catch(() => ({}))
    const onlySlug = typeof body?.slug === 'string' && isDraftSlug(body.slug) ? body.slug : undefined

    const rows = await getFilesToImport(onlySlug)
    if (rows === null) {
      return NextResponse.json(
        { error: 'O banco de dados não respondeu, então nada foi importado. Tente de novo em instantes.' },
        { status: 503 }
      )
    }

    const imported: string[] = []
    const failed: { slug: string; error: string }[] = []

    // Um por vez: se um falhar, os outros ainda entram
    for (const row of rows) {
      const { error } = await supabaseAdmin.from('posts').insert({
        ...row,
        published: false,
        published_at: null,
        author_id: user.id,
      })
      if (error) failed.push({ slug: row.slug, error: error.message })
      else imported.push(row.slug)
    }

    if (imported.length) revalidatePath('/admin/rascunhos')

    return NextResponse.json({ success: failed.length === 0, imported, failed }, { status: failed.length ? 207 : 200 })
  } catch (error) {
    console.error('Erro ao importar rascunhos:', error)
    const message = error instanceof Error ? error.message : 'Erro interno ao importar rascunhos'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
