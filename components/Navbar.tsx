'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, MessageCircle, Settings, X } from 'lucide-react'
import { whatsappUrl } from '@/components/promo/promo.config'
import { EASE_OUT } from '@/components/promo/ui'

/**
 * Cabeçalho do site: a mesma cápsula flutuante da campanha /promo.
 *
 * Na home fica transparente sobre o palco da DS3 e ganha vidro quando o palco termina;
 * nas outras páginas já nasce com vidro. A aba ativa vem do endereço (Produtos, Sobre,
 * Blog) ou, na home, da seção que cruza o meio da tela.
 */

const NAV = [
  { href: '/produtos', label: 'Produtos' },
  { href: '/#services', label: 'Serviços' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/blog', label: 'Blog' },
  { href: '/#testimonials', label: 'Avaliações' },
  { href: '/#faq', label: 'FAQ' },
] as const

const HERO_ID = 'home'
const MESSAGE = 'Olá! Vim pelo site do Grupo Venda Forte e quero falar com um consultor.'

export default function Navbar() {
  const pathname = usePathname()
  const [overHero, setOverHero] = useState(true)
  const [section, setSection] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const url = whatsappUrl(MESSAGE)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const update = () => {
      // Na home, a âncora cuja seção cruza o meio da tela
      const middle = window.innerHeight / 2
      const current = NAV.find(({ href }) => {
        if (!href.startsWith('/#')) return false
        const rect = document.getElementById(href.slice(2))?.getBoundingClientRect()
        return rect ? rect.top <= middle && rect.bottom >= middle : false
      })
      setSection(current?.href ?? null)

      const hero = document.getElementById(HERO_ID)
      if (!hero) {
        setOverHero(false)
        return
      }
      const limit = hero.dataset.hero === 'stage' ? window.innerHeight + 1 : window.innerHeight * 0.35
      setOverHero(hero.getBoundingClientRect().bottom > limit)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    // O palco troca de variante depois da montagem e muda a altura da página
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    return () => {
      window.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  const isActive = (href: string) =>
    href.startsWith('/#') ? pathname === '/' && section === href : pathname === href || pathname.startsWith(`${href}/`)

  const solid = !overHero
  const glass = solid || menuOpen

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={`relative mx-auto max-w-6xl rounded-[28px] border transition-[background-color,border-color,box-shadow] duration-500 ${
            glass
              ? 'border-white/10 bg-ink/75 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          <div className="flex h-14 items-center justify-between gap-3 px-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              aria-label="Página inicial do Grupo Venda Forte"
              className="flex items-center gap-3 rounded-2xl py-1 pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image src="/logo.png" alt="Logo do Grupo Venda Forte" fill sizes="40px" loading="eager" className="object-cover" />
              </span>
              <span className="leading-none">
                <span className="block text-[15px] font-semibold tracking-tight text-white">Venda Forte</span>
                <span className="mt-1 block text-[11px] font-medium text-white/50">Dealer EP Equipment</span>
              </span>
            </Link>

            <nav aria-label="Menu principal" className="hidden items-center lg:flex">
              {NAV.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:px-4 ${
                      active ? 'text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="site-nav-ativo"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                rel="nofollow"
                aria-label="Acessar Painel Administrativo"
                title="Painel Administrativo"
                className="hidden h-10 w-10 place-items-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:grid"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#contact"
                className="hidden h-10 items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 xl:inline-flex"
              >
                Pedir cotação
              </Link>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar com um consultor no WhatsApp"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-green-600 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 sm:px-4"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
              >
                {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.nav
                id="site-menu"
                aria-label="Menu principal"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="overflow-hidden lg:hidden"
              >
                <ul className="border-t border-white/10 px-2 pb-2 pt-2">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors hover:bg-white/[0.06] ${
                          isActive(item.href) ? 'text-white' : 'text-white/70'
                        }`}
                      >
                        {item.label}
                        {isActive(item.href) && <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="space-y-1 px-2 pb-3">
                  <Link
                    href="/#contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    Pedir cotação
                  </Link>
                  <Link
                    href="/admin"
                    rel="nofollow"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-full text-sm text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Painel administrativo
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Progresso da página, só depois do palco */}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className={`absolute inset-x-7 -bottom-px h-px origin-left bg-gradient-to-r from-red-600/0 via-red-500 to-red-600 transition-opacity duration-500 ${
              solid && !menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </header>
    </>
  )
}
