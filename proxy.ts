import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas protegidas do admin (exceto login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('vendaforte_auth_token')?.value

    if (!token) {
      // Redirecionar para login se não tiver token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = verifyToken(token)

    if (!payload) {
      // Token inválido, redirecionar para login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('vendaforte_auth_token')
      return response
    }

    // Token válido, permitir acesso
    return NextResponse.next()
  }

  // Se estiver logado e tentar acessar /admin/login, redirecionar para /admin/blog
  if (pathname === '/admin/login') {
    const token = request.cookies.get('vendaforte_auth_token')?.value

    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/blog', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
