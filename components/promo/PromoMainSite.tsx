"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MAIN_SITE_URL } from "./promo.config";
import { BTN_PRIMARY, Eyebrow, Reveal, TITLE } from "./ui";

/**
 * Fechamento da LP: leva o visitante ao site principal do Grupo Venda Forte,
 * com a página inicial real numa janela de navegador.
 */

const MAIN_SITE_HOST = new URL(MAIN_SITE_URL).host.replace(/^www\./, "");

export default function PromoMainSite() {
  return (
    <section
      id="grupo"
      className="scroll-mt-24 overflow-hidden border-t border-white/[0.06] bg-ink py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Grupo Venda Forte</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>Muito além da DS3</h2>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-neutral-400">
            Empilhadeiras, paleteiras, peças e assistência técnica. Conheça a linha completa e os
            serviços do grupo no nosso site.
          </p>
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_PRIMARY} group mt-8`}
          >
            Visitar {MAIN_SITE_HOST}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir o site ${MAIN_SITE_HOST}`}
            className="group block overflow-hidden rounded-[20px] border border-white/10 bg-ink-raised shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            {/* Barra do navegador */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </span>
              <span className="mx-auto rounded-full bg-white/[0.06] px-4 py-1 text-xs text-neutral-400">
                {MAIN_SITE_HOST}
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-white"
                aria-hidden="true"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/promo/site-principal-home.webp"
                alt="Página inicial do site do Grupo Venda Forte"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
