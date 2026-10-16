import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Mantém o projeto do Supabase ativo. No plano Free ele é pausado depois de
 * cerca de uma semana sem uso, e o admin e o blog param de ler o banco. O cron
 * da Vercel (vercel.json) chama esta rota todo dia e ela faz uma leitura leve.
 *
 * Só responde com o segredo do cron: a Vercel envia `Authorization: Bearer
 * <CRON_SECRET>` sozinha quando a variável CRON_SECRET existe no projeto.
 */
export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const received = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { count, error } = await supabaseAdmin
      .from('posts')
      .select('slug', { count: 'exact', head: true })
      .abortSignal(AbortSignal.timeout(10_000))
    if (error) throw error

    return NextResponse.json({ ok: true, posts: count, checkedAt: new Date().toISOString() })
  } catch (error) {
    // Falha visível no painel de cron da Vercel, em vez de passar despercebida
    const message = error instanceof Error ? error.message : 'Supabase não respondeu'
    return NextResponse.json({ ok: false, error: message.slice(0, 200) }, { status: 502 })
  }
}
