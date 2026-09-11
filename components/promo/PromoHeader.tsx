"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_GENERAL_MESSAGE, whatsappUrl } from "./promo.config";

/**
 * Seção 00 — Barra de urgência e header.
 * Especificação: docs/promo/00-header.md
 */

const NAV = [
  { href: "#ds3", label: "DS3 1.500 kg" },
  { href: "#economia", label: "Economia" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#cotacao", label: "Cotação" },
] as const;

export default function PromoHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const url = whatsappUrl(WHATSAPP_GENERAL_MESSAGE);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowBar(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        {/* Barra de urgência */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 py-1.5 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs">
          PRONTA ENTREGA · CONDIÇÃO ESPECIAL DE LOTE · FATURAMENTO BNDES E FINAME
        </div>

        <div
          className={`border-b transition-colors duration-300 ${
            scrolled
              ? "border-white/[0.08] bg-[#05070B]/90 backdrop-blur-xl"
              : "border-transparent bg-[#05070B]/60 backdrop-blur-md"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/promo" className="flex items-center gap-3">
              <div className="relative h-9 w-32">
                <Image
                  src="/logo.png"
                  alt="Grupo Venda Forte"
                  fill
                  sizes="128px"
                  className="object-contain"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-400 md:flex">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </a>
              ))}
              <a
                href="#vendedores"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Vendedores
              </a>
            </nav>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com um consultor no WhatsApp"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.03] hover:bg-emerald-500 sm:px-5"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Barra fixa de conversão, exclusiva do mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#05070B]/95 p-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 active:scale-[0.99]"
        >
          <MessageCircle className="h-4 w-4" />
          Cotar agora no WhatsApp
        </a>
      </div>
    </>
  );
}
