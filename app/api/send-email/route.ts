import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Inicializar Resend apenas se a API key existir
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// O conteúdo vem do formulário: escapado para não virar HTML no email
const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]!))

export async function POST(request: NextRequest) {
  try {
    // Verificar se Resend está configurado
    if (!resend) {
      return NextResponse.json(
        { error: 'Serviço de email não configurado. Configure RESEND_API_KEY.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    // `origem` identifica formulários fora da página principal, como a campanha /promo
    const { nome, email, telefone, empresa, cidade, equipamento, mensagem, origem } = body

    // Validação básica
    if (!nome || !email || !telefone || !mensagem) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Enviar email usando Resend
    const data = await resend.emails.send({
      from: 'Venda Forte <onboarding@resend.dev>',
      to: ['rodrigo@grupovendaforte.com'],
      replyTo: email,
      subject: `🔴 Nova Solicitação${origem ? ` (${origem})` : ''} - ${nome}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
              }
              .header {
                background: #dc2626;
                color: white;
                padding: 20px;
                text-align: left;
              }
              .header h1 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
              }
              .content {
                padding: 30px 20px;
              }
              .field {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eeeeee;
              }
              .field:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: 600;
                color: #666666;
                font-size: 13px;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .value {
                color: #111827;
                font-size: 15px;
                margin-top: 5px;
              }
              .value a {
                color: #dc2626;
                text-decoration: none;
              }
              .footer {
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>${origem ? `Nova Solicitação · ${escapeHtml(origem)}` : 'Nova Solicitação do Site'}</h1>
              </div>

              <div class="content">
                <div class="field">
                  <div class="label">Nome</div>
                  <div class="value">${escapeHtml(nome)}</div>
                </div>

                <div class="field">
                  <div class="label">E-mail</div>
                  <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
                </div>

                <div class="field">
                  <div class="label">Telefone</div>
                  <div class="value"><a href="tel:${escapeHtml(telefone)}">${escapeHtml(telefone)}</a></div>
                </div>

                ${empresa ? `
                <div class="field">
                  <div class="label">Empresa</div>
                  <div class="value">${escapeHtml(empresa)}</div>
                </div>
                ` : ''}

                ${cidade ? `
                <div class="field">
                  <div class="label">Cidade</div>
                  <div class="value">${escapeHtml(cidade)}</div>
                </div>
                ` : ''}

                ${equipamento ? `
                <div class="field">
                  <div class="label">Tipo de Equipamento</div>
                  <div class="value">${escapeHtml(equipamento)}</div>
                </div>
                ` : ''}

                <div class="field">
                  <div class="label">Mensagem</div>
                  <div class="value">${escapeHtml(mensagem).replace(/\n/g, '<br>')}</div>
                </div>
              </div>

              <div class="footer">
                Enviado através do formulário de contato<br>
                <strong>www.grupovendaforte.com${origem ? ' · campanha promocional' : ''}</strong>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: (error instanceof Error && error.message) || 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}
