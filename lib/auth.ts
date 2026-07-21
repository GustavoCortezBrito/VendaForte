import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
const TOKEN_NAME = 'vendaforte_auth_token'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
}

export interface TokenPayload extends AuthUser {
  iat: number
  exp: number
}

/**
 * Gera um token JWT para o usuário
 */
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token válido por 7 dias
  )
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Autentica um usuário com email e senha
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // Buscar usuário no banco
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Credenciais inválidas' }
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: 'Credenciais inválidas' }
    }

    // Gerar token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

    const token = generateToken(authUser)

    return {
      success: true,
      user: authUser,
      token
    }
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return { success: false, error: 'Erro ao autenticar usuário' }
  }
}

export function getUserFromRequest(request: { cookies: { get: (name: string) => { value: string } | undefined } }): AuthUser | null {
  try {
    const token = request.cookies.get(TOKEN_NAME)?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)

    if (!payload) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch (error) {
    console.error('Erro ao obter usuário a partir da requisição:', error)
    return null
  }
}

/**
 * Obtém o usuário autenticado a partir do cookie
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_NAME)?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)

    if (!payload) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    return null
  }
}

/**
 * Define o cookie de autenticação
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/'
  })
}

/**
 * Remove o cookie de autenticação
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}

/**
 * Verifica se o usuário tem permissão de admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Não autenticado')
  }

  if (user.role !== 'admin') {
    throw new Error('Permissão negada - apenas administradores')
  }

  return user
}

/**
 * Verifica se o usuário está autenticado (admin ou editor)
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Não autenticado')
  }

  return user
}

/**
 * Cria um novo usuário (apenas admin pode fazer isso)
 */
export async function createUser(data: {
  email: string
  password: string
  name: string
  role: 'admin' | 'editor'
}) {
  try {
    // Hash da senha
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Inserir no banco
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: data.email,
        password_hash: passwordHash,
        name: data.name,
        role: data.role
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Atualiza a senha de um usuário
 */
export async function updatePassword(userId: string, newPassword: string) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10)

    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
