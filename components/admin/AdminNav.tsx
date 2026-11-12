'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Eye, FileText, LogOut, PenLine, Share2, Truck, Users } from 'lucide-react'
import { canEdit, isAdmin, ROLE_LABEL, type Role } from '@/lib/permissions'

export type AdminSection = 'empilhadeiras' | 'blog' | 'rascunhos' | 'redes' | 'usuarios'

interface Me {
  name: string
  email: string
  role: Role
}

/** Quem está logado, lido uma vez por tela. `null` enquanto carrega. */
export function useMe(): Me | null {
  const [me, setMe] = useState<Me | null>(null)
  useEffect(() => {
    let alive = true
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive && data?.user) setMe({ name: data.user.name, email: data.user.email, role: data.user.role })
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return me
}

const TAB = 'flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
const TAB_ON = `${TAB} bg-white/10 text-white`
const TAB_OFF = `${TAB} text-white/60 hover:text-white`

interface AdminNavProps {
  /** Seção aberta. Fica sem aba marcada na tela inicial do painel. */
  active?: AdminSection | null
  /** Onde a pessoa está dentro da seção, por exemplo "Novo post". Aparece depois das abas. */
  crumb?: ReactNode
  /** 0 a 100: linha fina de progresso na base da barra (formulário longo). */
  progress?: number
  /** Ações da tela (salvar, criar), à direita. */
  children?: ReactNode
}

/**
 * Barra do painel, igual em todas as telas: a mesma cápsula de vidro do cabeçalho do site e da /promo.
 * As abas que o perfil não pode usar não aparecem: o revisor vê só Rascunhos e Redes sociais;
 * Usuários é só do admin.
 */
export default function AdminNav({ active, crumb, progress, children }: AdminNavProps) {
  const router = useRouter()
  const me = useMe()

  const tabs: { id: AdminSection; href: string; label: string; icon: typeof Truck; show: boolean }[] = [
    { id: 'empilhadeiras', href: '/admin/empilhadeiras', label: 'Empilhadeiras', icon: Truck, show: !me || canEdit(me) },
    { id: 'blog', href: '/admin/blog', label: 'Blog e notícias', icon: FileText, show: !me || canEdit(me) },
    { id: 'rascunhos', href: '/admin/rascunhos', label: 'Rascunhos', icon: PenLine, show: true },
    { id: 'redes', href: '/admin/redes', label: 'Redes sociais', icon: Share2, show: true },
    { id: 'usuarios', href: '/admin/usuarios', label: 'Usuários', icon: Users, show: isAdmin(me) },
  ]

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav aria-label="Painel administrativo" className="relative mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-ink/75 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-3 px-2 sm:px-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Link
              href="/admin"
              aria-label="Início do painel"
              className="flex shrink-0 items-center gap-3 rounded-2xl py-1 pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image src="/logo.png" alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span className="hidden leading-none sm:block">
                <span className="block text-[15px] font-semibold tracking-tight text-white">Venda Forte</span>
                <span className="mt-1 block text-[11px] font-medium text-ink-muted">Painel</span>
              </span>
            </Link>

            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs
                .filter((tab) => tab.show)
                .map(({ id, href, label, icon: Icon }) => (
                  <Link key={id} href={href} aria-current={id === active ? 'page' : undefined} aria-label={label} className={id === active ? TAB_ON : TAB_OFF}>
                    <Icon size={15} aria-hidden="true" />
                    <span className={`hidden whitespace-nowrap ${crumb && id !== active ? '2xl:inline' : 'xl:inline'}`}>{label}</span>
                  </Link>
                ))}
            </div>

            {crumb && (
              <>
                <ChevronRight size={14} aria-hidden="true" className="hidden shrink-0 text-neutral-600 sm:block" />
                <span className="hidden min-w-0 truncate text-sm font-semibold text-white sm:block">{crumb}</span>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {children}
            {(!me || canEdit(me)) && (
              <Link
                href="/blog"
                target="_blank"
                className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:flex"
              >
                <Eye size={15} aria-hidden="true" />
                <span>Ver o blog</span>
              </Link>
            )}
            {me && (
              <span className="hidden text-right leading-tight 2xl:block">
                <span className="block text-xs font-semibold text-white">{me.name}</span>
                <span className="block text-[11px] text-ink-muted">{ROLE_LABEL[me.role]}</span>
              </span>
            )}
            <button
              onClick={logout}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              title="Sair do painel"
              aria-label="Sair do painel"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {typeof progress === 'number' && (
          <span
            aria-hidden="true"
            style={{ transform: `scaleX(${Math.min(100, Math.max(0, progress)) / 100})` }}
            className="absolute inset-x-7 -bottom-px h-px origin-left bg-red-500 transition-transform duration-500"
          />
        )}
      </nav>
    </header>
  )
}
