import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })

    // Deletar cookie diretamente na Response (compatível com Next.js 16)
    response.cookies.delete('vendaforte_auth_token')

    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
