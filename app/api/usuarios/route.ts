import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { isAdmin, isRole } from '@/lib/permissions'
import { supabaseAdmin } from '@/lib/supabase'

const COLUMNS = 'id, email, name, role, created_at'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 10
const ROLE_CONSTRAINT_HINT =
  'O banco ainda não aceita o perfil "revisor". Rode o arquivo supabase/migrations/2026-11-02-redes-sociais-e-revisores.sql no SQL Editor do Supabase e tente de novo.'

const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

/** Só admin mexe em usuários. */
function requireAdminUser(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return { error: fail('Não autenticado', 401) }
  if (!isAdmin(user)) return { error: fail('Só quem administra o painel gerencia usuários.', 403) }
  return { user }
}

const roleError = (message: string) => (/users_role_check|violates check constraint/i.test(message) ? ROLE_CONSTRAINT_HINT : null)

async function adminCount() {
  const { count } = await supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('role', 'admin')
  return count ?? 0
}

/** GET - Lista os usuários (nunca devolve a senha). */
export async function GET(request: NextRequest) {
  try {
    const auth = requireAdminUser(request)
    if (auth.error) return auth.error

    const { data, error } = await supabaseAdmin.from('users').select(COLUMNS).order('created_at', { ascending: true })
    if (error) return fail('Não foi possível carregar os usuários.', 503)
    return NextResponse.json({ users: data || [], me: auth.user.id })
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    return fail('Erro interno do servidor', 500)
  }
}

/** POST - Cria um usuário: { name, email, password, role }. */
export async function POST(request: NextRequest) {
  try {
    const auth = requireAdminUser(request)
    if (auth.error) return auth.error

    const body = await request.json().catch(() => ({}))
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!name) return fail('Informe o nome.', 400)
    if (!EMAIL.test(email)) return fail('E-mail inválido.', 400)
    if (password.length < PASSWORD_MIN) return fail(`A senha precisa de pelo menos ${PASSWORD_MIN} caracteres.`, 400)
    if (!isRole(body.role)) return fail('Perfil inválido.', 400)

    const password_hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ name, email, password_hash, role: body.role })
      .select(COLUMNS)
      .single()

    if (error) {
      if (error.code === '23505' || /duplicate|unique/i.test(error.message)) return fail('Já existe um usuário com esse e-mail.', 409)
      const hint = roleError(error.message)
      if (hint) return fail(hint, 409)
      console.error('Erro ao criar usuário:', error)
      return fail('Não foi possível criar o usuário.', 500)
    }
    return NextResponse.json({ user: data }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return fail('Erro interno do servidor', 500)
  }
}

/** PATCH - Troca a senha e/ou o perfil: { id, password?, role? }. */
export async function PATCH(request: NextRequest) {
  try {
    const auth = requireAdminUser(request)
    if (auth.error) return auth.error

    const body = await request.json().catch(() => ({}))
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return fail('Usuário não informado.', 400)

    const { data: target } = await supabaseAdmin.from('users').select(COLUMNS).eq('id', id).maybeSingle()
    if (!target) return fail('Usuário não encontrado.', 404)

    const update: Record<string, unknown> = {}

    if (body.password !== undefined) {
      if (typeof body.password !== 'string' || body.password.length < PASSWORD_MIN) {
        return fail(`A senha precisa de pelo menos ${PASSWORD_MIN} caracteres.`, 400)
      }
      update.password_hash = await bcrypt.hash(body.password, 10)
    }

    if (body.role !== undefined) {
      if (!isRole(body.role)) return fail('Perfil inválido.', 400)
      if (target.role === 'admin' && body.role !== 'admin' && (await adminCount()) <= 1) {
        return fail('Este é o único administrador. Crie outro antes de mudar o perfil dele.', 409)
      }
      update.role = body.role
    }

    if (!Object.keys(update).length) return fail('Nada para alterar.', 400)

    const { error } = await supabaseAdmin.from('users').update(update).eq('id', id)
    if (error) {
      const hint = roleError(error.message)
      if (hint) return fail(hint, 409)
      console.error('Erro ao atualizar usuário:', error)
      return fail('Não foi possível salvar.', 500)
    }
    // Quem mudou de perfil só sente a diferença no próximo login, porque o perfil vai dentro do token
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return fail('Erro interno do servidor', 500)
  }
}

/** DELETE - Remove um usuário: ?id=. Não remove a si mesmo nem o último administrador. */
export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAdminUser(request)
    if (auth.error) return auth.error

    const id = new URL(request.url).searchParams.get('id') || ''
    if (!id) return fail('Usuário não informado.', 400)
    if (id === auth.user.id) return fail('Você não pode remover o próprio usuário.', 409)

    const { data: target } = await supabaseAdmin.from('users').select(COLUMNS).eq('id', id).maybeSingle()
    if (!target) return fail('Usuário não encontrado.', 404)
    if (target.role === 'admin' && (await adminCount()) <= 1) return fail('Este é o único administrador.', 409)

    const { error } = await supabaseAdmin.from('users').delete().eq('id', id)
    if (error) {
      console.error('Erro ao remover usuário:', error)
      return fail('Não foi possível remover.', 500)
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro ao remover usuário:', error)
    return fail('Erro interno do servidor', 500)
  }
}
