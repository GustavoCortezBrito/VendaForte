'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { BTN_PRIMARY, EYEBROW, INPUT, LABEL } from '@/components/site/styles'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      // Login bem-sucedido, redirecionar para o Hub Administrativo
      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro ao conectar com o servidor')
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* A fachada da matriz, a mesma da abertura do site */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image src="/fotos/home/fachada.webp" alt="" fill priority sizes="55vw" className="object-cover object-[60%_center]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <span className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-xl">
              <Image src="/logo.png" alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-semibold tracking-tight text-white">Venda Forte</span>
              <span className="mt-1 block text-xs font-medium text-white/70">Dealer oficial EP Equipment</span>
            </span>
          </span>
          <p className="max-w-md text-balance text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-white">
            Catálogo, blog e redes sociais num só lugar.
          </p>
        </div>
      </aside>

      <section className="flex items-center justify-center bg-ink px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <p className={EYEBROW}>Painel administrativo</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white">Entrar</h1>
          <p className="mt-3 text-neutral-400">Use o e-mail e a senha que você recebeu.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {error && (
              <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className={LABEL}>
                E-mail
              </label>
              <div className="relative">
                <Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  spellCheck={false}
                  className={`${INPUT} pl-11`}
                  placeholder="nome@empresa.com.br"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-senha" className={LABEL}>
                Senha
              </label>
              <div className="relative">
                <Lock size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  id="login-senha"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className={`${INPUT} pl-11 pr-14`}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Esconder a senha' : 'Mostrar a senha'}
                  className="absolute right-1.5 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`${BTN_PRIMARY} w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Entrando…
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <Link href="/" className="mt-10 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar para o site
          </Link>
        </div>
      </section>
    </main>
  )
}
