import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { isLocalRequest } from '@/lib/environment'

export async function GET(request: NextRequest) {
  try {
    // Ler cookie diretamente do Request (compatível com Next.js 16)
    const token = request.cookies.get('vendaforte_auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
      // Falso em ambiente local: o painel desativa os botões que mudam o que está no ar
      canPublish: !isLocalRequest(request.headers),
    })
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
