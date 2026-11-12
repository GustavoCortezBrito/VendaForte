'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Truck, FileText, ArrowUpRight, PenLine, Share2, Users, Loader2 } from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'
import { canEdit, isAdmin } from '@/lib/permissions'
import { CARD_LINK, EYEBROW, ICON_BADGE, LEAD } from '@/components/site/styles'

export default function AdminHubPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/admin/login')
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data) {
          setUser(data.user)
          setLoading(false)
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p role="status" className="flex items-center gap-3 text-sm font-medium text-neutral-400">
          <Loader2 size={18} className="animate-spin text-red-500" aria-hidden="true" />
          Carregando o painel…
        </p>
      </div>
    )
  }

  const ALL_SECTIONS = [
    {
      id: 'empilhadeiras',
      show: canEdit(user),
      title: 'Catálogo de empilhadeiras',
      description: 'Cadastre e edite os modelos, as fichas técnicas e as fotos que aparecem no site.',
      icon: Truck,
      href: '/admin/empilhadeiras',
      buttonText: 'Gerenciar o catálogo',
    },
    {
      id: 'blog',
      show: canEdit(user),
      title: 'Blog e notícias',
      description: 'Crie e edite os artigos do blog: fichas técnicas, guias de compra e novidades da linha EP.',
      icon: FileText,
      href: '/admin/blog',
      buttonText: 'Gerenciar o blog',
    },
    {
      id: 'rascunhos',
      show: true,
      title: 'Rascunhos do blog',
      description: 'Veja como cada texto vai ficar no site, confira os avisos automáticos e publique quando estiver pronto.',
      icon: PenLine,
      href: '/admin/rascunhos',
      buttonText: 'Ver os rascunhos',
    },
    {
      id: 'redes',
      show: true,
      title: 'Redes sociais',
      description: 'Legendas de Instagram, LinkedIn, Facebook, WhatsApp e Perfil Google, com data, conversa e aprovação.',
      icon: Share2,
      href: '/admin/redes',
      buttonText: 'Abrir as redes sociais',
    },
    {
      id: 'usuarios',
      show: isAdmin(user),
      title: 'Usuários',
      description: 'Crie o login de cada pessoa, defina se ela edita ou só revisa e troque senhas.',
      icon: Users,
      href: '/admin/usuarios',
      buttonText: 'Gerenciar usuários',
    },
  ]
  const SECTIONS = ALL_SECTIONS.filter((section) => section.show)

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <AdminNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-14 lg:px-8 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
          <p className={EYEBROW}>Painel administrativo</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white lg:text-5xl">O que você quer gerenciar?</h1>
          <p className={`mt-5 max-w-2xl ${LEAD}`}>Escolha uma área. O que você muda aqui aparece no site.</p>
        </motion.div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((sec, idx) => (
            <motion.li
              key={sec.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.06 * idx }}
            >
              <Link href={sec.href} className={`${CARD_LINK} p-7`}>
                <span className={ICON_BADGE}>
                  <sec.icon size={20} aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-xl font-semibold tracking-tight text-white">{sec.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{sec.description}</p>
                <span className="mt-auto pt-8 text-sm font-semibold text-white">{sec.buttonText}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-6 top-6 h-5 w-5 text-neutral-600 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-ink-muted">
        Venda Forte, painel administrativo &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
