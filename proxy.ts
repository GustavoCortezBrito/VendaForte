import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Telas que o revisor (Paulo e Rodrigo) pode abrir: ler, comentar e aprovar. O resto do painel
// (catálogo, criar e editar post, usuários) manda de volta para as redes sociais. As rotas da API
// têm a mesma trava, então esta é só a parte visível.
const REVISOR_PAGES = [/^\/admin\/?$/, /^\/admin\/rascunhos(\/|$)/, /^\/admin\/redes(\/|$)/]

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

    if (payload.role === 'revisor' && !REVISOR_PAGES.some((page) => page.test(pathname))) {
      return NextResponse.redirect(new URL('/admin/redes', request.url))
    }

    // Só quem administra gerencia usuários
    if (pathname.startsWith('/admin/usuarios') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
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
