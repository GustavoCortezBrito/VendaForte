"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, BatteryCharging, Banknote, MoveVertical, Truck, Wrench } from "lucide-react";
import PromoMediaSlot, { hasMedia } from "./PromoMediaSlot";
import { PRODUCTS } from "./promo.config";
import { Eyebrow, PriceCard, Reveal, Shot, SpecTable, TITLE } from "./ui";

/**
 * Seção 03 — O essencial, a ficha técnica e o preço da EP DS3, numa seção só.
 * Primeiro os cinco motivos em grade; logo abaixo, os números e a condição.
 *
 * Especificação: docs/promo/03-destaques.md e docs/promo/09-ficha-tecnica.md
 */

const DS3 = PRODUCTS.ds3;

/**
 * "O essencial" fica fora da página por enquanto. Não basta esconder com
 * `hidden`: buscadores leem o HTML e contariam os links e textos ocultos.
 */
const SHOW_ESSENTIALS: boolean = false;

/** Anotações sobre a foto de perfil, em % do quadro. */
const CALLOUTS = [
  { label: "Mastro · elevação até 3,9 m", left: "40%", top: "12%" },
  { label: "Bateria 24V de íon-lítio", left: "6%", top: "46%" },
  { label: "Capacidade de 1.500 kg", left: "48%", top: "76%" },
] as const;

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
        {/* ---------------- O essencial ----------------
            Oculto por enquanto, a pedido do cliente. Para voltar, mude
            SHOW_ESSENTIALS para true e devolva à ficha técnica abaixo o
            espaçamento e a borda do topo. */}
        {SHOW_ESSENTIALS && (
        <div>
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
          <Tile href="#cotacao" className="lg:col-span-3">
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
        )}

        {/* ---------------- Ficha técnica e preço ----------------
            Com "O essencial" visível, esta div volta a ter
            "mt-24 border-t border-white/10 pt-16 lg:mt-32 lg:pt-24". */}
        <div id="ficha-tecnica" className="scroll-mt-24">
          <Reveal className="max-w-3xl">
            <Eyebrow>Especificação e condição</Eyebrow>
            <h2 className={`mt-4 ${TITLE} text-white`}>Ficha técnica da EP DS3</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">
              Para quem precisa validar corredor, altura e ciclo antes de aprovar a compra.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-6">
              <div className="relative">
                <Shot shot="perfil" className="aspect-square w-full" sizes="(max-width: 1024px) 100vw, 48vw" />
                <div aria-hidden="true">
                  {CALLOUTS.map((callout) => (
                    <span
                      key={callout.label}
                      className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
                      style={{ left: callout.left, top: callout.top }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {callout.label}
                    </span>
                  ))}
                </div>
              </div>

              {hasMedia("desenhoTecnico") && (
                <PromoMediaSlot
                  media="desenhoTecnico"
                  className="mt-6 aspect-square w-full rounded-[28px]"
                  imageClassName="p-6"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  fit="contain"
                />
              )}
            </Reveal>

            <Reveal className="lg:col-span-6" delay={0.08}>
              <SpecTable specs={DS3.specs} caption={`Ficha técnica da ${DS3.name}`} />
              <PriceCard product={DS3} className="mt-10" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
