import Link from 'next/link'

export default function NotFound() {
  return (
    <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
            background: '#0d0d0d',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem',
          }}
        >
          {/* Glow decorativo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          {/* Logo / Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '2.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: '#dc2626',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                Venda Forte
              </div>
              <div style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Grupo
              </div>
            </div>
          </div>

          {/* Número 404 */}
          <div
            style={{
              fontSize: 'clamp(80px, 18vw, 160px)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'transparent',
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 40%, #fca5a5 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              position: 'relative',
              zIndex: 1,
              marginBottom: '0.5rem',
              userSelect: 'none',
            }}
          >
            404
          </div>

          {/* Linha decorativa */}
          <div
            style={{
              width: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, #dc2626, #fca5a5)',
              borderRadius: '2px',
              marginBottom: '1.75rem',
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* Título */}
          <h1
            style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 700,
              color: '#fff',
              textAlign: 'center',
              marginBottom: '0.75rem',
              position: 'relative',
              zIndex: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Página não encontrada
          </h1>

          {/* Descrição */}
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.65)',
              textAlign: 'center',
              maxWidth: '400px',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            O endereço que você acessou não existe ou foi movido.
            Vamos te levar de volta para o lugar certo.
          </p>

          {/* Botões */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                background: '#dc2626',
                color: '#fff',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(220,38,38,0.30)',
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Voltar ao início
            </Link>

            <Link
              href="/empilhadeiras-eletricas"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Ver catálogo
            </Link>
          </div>

          {/* Links rápidos */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '2.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {[
              { href: '/sobre', label: 'Sobre nós' },
              { href: '/blog', label: 'Blog' },
              { href: '/#contact', label: 'Contato' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '13px',
                  color: '#ef4444',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Rodapé mínimo */}
          <p
            style={{
              marginTop: '3rem',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            © {new Date().getFullYear()} Venda Forte · Grupo Forte
          </p>
        </main>
  )
}
