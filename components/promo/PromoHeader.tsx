"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { HERO_ID, PROMO_NAV, WHATSAPP_GENERAL_MESSAGE, whatsappUrl } from "./promo.config";
import { EASE_OUT } from "./ui";

/**
 * Seção 00 — Header da campanha.
 *
 * Uma cápsula flutuante. Sobre o hero fica transparente, em cima do giro da
 * DS3; quando o giro termina, ganha fundo de vidro e o aviso de pronta entrega.
 * O link da seção que está no meio da tela fica marcado.
 *
 * Especificação: docs/promo/00-header.md
 */

export default function PromoHeader() {
  const [overHero, setOverHero] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const url = whatsappUrl(WHATSAPP_GENERAL_MESSAGE);

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

  const solid = !overHero;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border px-2 transition-[background-color,border-color,box-shadow] duration-500 ${
            solid
              ? "border-white/10 bg-ink/70 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link
            href="/promo"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image src="/logo.png" alt="" fill sizes="36px" loading="eager" className="object-cover" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Venda Forte</span>
          </Link>

          <nav aria-label="Seções da campanha" className="hidden items-center md:flex">
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

          <div className="flex items-center gap-3">
            <span
              className={`hidden items-center gap-2 whitespace-nowrap text-xs font-medium text-white/70 transition-opacity duration-500 xl:flex ${
                solid ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Pronta entrega · BNDES e Finame
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com um consultor no WhatsApp"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
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
