"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, BatteryCharging, Banknote, MoveVertical, Truck, Wrench } from "lucide-react";
import { Eyebrow, Reveal, Shot, TITLE } from "./ui";

/**
 * Seção 03 — Destaques rápidos, em grade de tamanhos variados.
 * Especificação: docs/promo/03-destaques.md
 */

function Tile({ href, className = "", children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Reveal className={className}>
      <a
        href={href}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink transition-colors duration-500 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
      >
        {children}
        <ArrowUpRight
          aria-hidden="true"
          className="absolute right-6 top-6 h-5 w-5 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      </a>
    </Reveal>
  );
}

export default function PromoHighlights() {
  return (
    <section
      id="destaques"
      className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow>O essencial</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>Cinco motivos para trocar agora</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Altura de elevação, com o mastro em pé */}
          <Tile href="#ficha-tecnica" className="lg:col-span-6 lg:row-span-2">
            <div className="relative z-10 p-8 lg:p-10">
              <MoveVertical className="h-6 w-6 text-red-500" aria-hidden="true" />
              <p className="mt-8 text-6xl font-bold tracking-[-0.045em] text-white lg:text-7xl">
                3,9 m
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">1.500 kg a 3,9 metros</h3>
              <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-neutral-400">
                Verticaliza o terceiro nível em corredor estreito.
              </p>
            </div>
            <Shot
              shot="mastro"
              className="relative aspect-square w-full lg:absolute lg:-right-8 lg:bottom-0 lg:h-[80%] lg:w-auto"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </Tile>

          {/* Lítio */}
          <Tile href="#economia" className="lg:col-span-6">
            <div className="relative z-10 p-8 lg:max-w-[58%] lg:p-10">
              <BatteryCharging className="h-6 w-6 text-red-500" aria-hidden="true" />
              <p className="mt-8 text-5xl font-bold tracking-[-0.045em] text-white">Zero</p>
              <h3 className="mt-3 text-lg font-semibold text-white">Lítio sem manutenção</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                Sem água desmineralizada, sem ácido, sem sala de baterias.
              </p>
            </div>
            <Shot
              shot="lateral"
              className="relative aspect-square w-2/3 self-end lg:absolute lg:bottom-0 lg:right-0 lg:h-full lg:w-auto"
              sizes="(max-width: 1024px) 60vw, 20vw"
            />
          </Tile>

          {/* Financiamento */}
          <Tile href="#cotacao" className="lg:col-span-3">
            <div className="p-8">
              <Banknote className="h-6 w-6 text-red-500" aria-hidden="true" />
              <p className="mt-8 text-5xl font-bold tracking-[-0.045em] text-white">60x</p>
              <h3 className="mt-3 text-lg font-semibold text-white">Até 60x no BNDES</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                Faturamento direto para CNPJ, com Finame e leasing.
              </p>
            </div>
          </Tile>

          {/* Pronta entrega */}
          <Tile href="#ofertas" className="lg:col-span-3">
            <div className="flex h-full flex-col p-8">
              <Truck className="h-6 w-6 text-red-500" aria-hidden="true" />
              <h3 className="mt-auto pt-8 text-3xl font-bold tracking-[-0.035em] text-white">
                Pronta entrega
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Estoque com despacho e seguro de carga.
              </p>
            </div>
          </Tile>

          {/* Assistência */}
          <Tile href="#por-que-nos" className="lg:col-span-12">
            <div className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:gap-6 lg:px-10">
              <Wrench className="h-6 w-6 shrink-0 text-red-500" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-white">Assistência especializada</h3>
              <p className="text-sm text-neutral-400 sm:pr-12">
                Peças em estoque e equipe técnica própria.
              </p>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
