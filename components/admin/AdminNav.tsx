'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, FileText, LogOut, PenLine, Share2, Truck, Users } from 'lucide-react'
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

const TAB = 'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors'
const TAB_ON = `${TAB} bg-red-600 text-white shadow-md shadow-red-600/20`
const TAB_OFF = `${TAB} text-gray-600 hover:bg-gray-100 hover:text-gray-900`

/**
 * Barra do painel, igual em todas as telas. As abas que o perfil não pode usar não aparecem:
 * o revisor vê só Rascunhos e Redes sociais; Usuários é só do admin.
 */
export default function AdminNav({ active, children }: { active: AdminSection; children?: ReactNode }) {
  const router = useRouter()
  const me = useMe()

  const tabs: { id: AdminSection; href: string; label: string; icon: typeof Truck; show: boolean }[] = [
    { id: 'empilhadeiras', href: '/admin/empilhadeiras', label: 'Empilhadeiras', icon: Truck, show: !me || canEdit(me) },
    { id: 'blog', href: '/admin/blog', label: 'Blog & Notícias', icon: FileText, show: !me || canEdit(me) },
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
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white shadow-md shadow-red-600/20">
              VF
            </div>
            <div className="hidden sm:block">
              <span className="block text-base font-bold leading-none text-gray-900">Venda Forte</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">Painel Admin</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto border-l border-gray-200 pl-3 sm:gap-2 sm:pl-5">
            {tabs
              .filter((tab) => tab.show)
              .map(({ id, href, label, icon: Icon }) => (
                <Link key={id} href={href} aria-current={id === active ? 'page' : undefined} className={id === active ? TAB_ON : TAB_OFF}>
                  <Icon size={14} />
                  <span className="hidden whitespace-nowrap lg:inline">{label}</span>
                </Link>
              ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {children}
          {(!me || canEdit(me)) && (
            <Link
              href="/blog"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 sm:flex"
            >
              <Eye size={14} />
              <span>Ver Blog</span>
            </Link>
          )}
          {me && (
            <span className="hidden text-right leading-tight xl:block">
              <span className="block text-xs font-semibold text-gray-800">{me.name}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">{ROLE_LABEL[me.role]}</span>
            </span>
          )}
          <button
            onClick={logout}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Sair do Painel"
            aria-label="Sair do painel"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
