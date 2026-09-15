"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { HERO_ID, PROMO_NAV, WHATSAPP_GENERAL_MESSAGE, whatsappUrl } from "./promo.config";
import { EASE_OUT } from "./ui";

/**
 * Seção 00 — Header da campanha.
 *
 * Uma cápsula flutuante. Sobre o hero fica transparente, em cima do giro da
 * DS3; quando o giro termina, ganha fundo de vidro, o atalho de cotação e uma
 * linha de progresso da página. No mobile, o menu abre dentro da cápsula.
 *
 * Especificação: docs/promo/00-header.md
 */

export default function PromoHeader() {
  const [overHero, setOverHero] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const url = whatsappUrl(WHATSAPP_GENERAL_MESSAGE);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const update = () => {
      // Seção do menu que cruza o meio da tela; fora delas, nenhuma fica marcada
      const middle = window.innerHeight / 2;
      const current = PROMO_NAV.find(({ href }) => {
        const rect = document.getElementById(href.slice(1))?.getBoundingClientRect();
        return rect ? rect.top <= middle && rect.bottom >= middle : false;
      });
      setActive(current?.href ?? null);

      const hero = document.getElementById(HERO_ID);
      if (!hero) {
        setOverHero(false);
        return;
      }
      const limit =
        hero.dataset.hero === "stage" ? window.innerHeight + 1 : window.innerHeight * 0.35;
      setOverHero(hero.getBoundingClientRect().bottom > limit);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    // O hero troca de variante depois da montagem e muda a altura da página
    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const solid = !overHero;
  const glass = solid || menuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={`relative mx-auto max-w-6xl rounded-[28px] border transition-[background-color,border-color,box-shadow] duration-500 ${
            glass
              ? "border-white/10 bg-ink/75 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <div className="flex h-14 items-center justify-between gap-3 px-2">
            <Link
              href="/promo"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-2xl py-1 pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image src="/logo.png" alt="Logo do Grupo Venda Forte" fill sizes="40px" loading="eager" className="object-cover" />
              </span>
              <span className="leading-none">
                <span className="block text-[15px] font-semibold tracking-tight text-white">
                  Venda Forte
                </span>
                <span className="mt-1 block text-[11px] font-medium text-white/50">
                  Dealer EP Equipment
                </span>
              </span>
            </Link>

            <nav aria-label="Seções da campanha" className="hidden items-center lg:flex">
              {PROMO_NAV.map((item) => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:px-4 ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="promo-nav-ativo"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#cotacao"
                className="hidden h-10 items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 xl:inline-flex"
              >
                Pedir cotação
              </a>
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
                aria-controls="promo-menu"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
              >
                {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.nav
                id="promo-menu"
                aria-label="Seções da campanha"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="overflow-hidden lg:hidden"
              >
                <ul className="border-t border-white/10 px-2 pb-2 pt-2">
                  {PROMO_NAV.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors hover:bg-white/[0.06] ${
                          active === item.href ? "text-white" : "text-white/70"
                        }`}
                      >
                        {item.label}
                        {active === item.href && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="px-2 pb-3">
                  <a
                    href="#cotacao"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    Pedir cotação
                  </a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Progresso da página, só depois do hero */}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className={`absolute inset-x-7 -bottom-px h-px origin-left bg-gradient-to-r from-red-600/0 via-red-500 to-red-600 transition-opacity duration-500 ${
              solid && !menuOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </header>

      {/* Barra fixa de conversão, exclusiva do mobile, depois do hero */}
      <div
        inert={!solid}
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/90 px-3 pb-3 pt-2.5 backdrop-blur-xl transition-transform duration-500 md:hidden ${
          solid ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <p className="mb-2 text-center text-[11px] font-medium text-white/60">
          Pronta entrega · Faturamento BNDES e Finame
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3.5 text-sm font-semibold text-white active:scale-[0.99]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Cotar agora no WhatsApp
        </a>
      </div>
    </>
  );
}
