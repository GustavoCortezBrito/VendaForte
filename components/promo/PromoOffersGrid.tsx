"use client";

import {
  ArrowUpRight,
  BatteryCharging,
  CircleCheckBig,
  Clock,
  MoveVertical,
  PackageCheck,
  ShieldCheck,
  Truck,
  Weight,
} from "lucide-react";
import { PROMO_PRODUCTS, whatsappUrl } from "./promo.config";
import { BTN_GHOST, Eyebrow, Reveal, Shot, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 07 — A oferta da campanha: só a EP DS3.
 * Especificação: docs/promo/07-vitrine.md
 */

const TRUST = [
  { icon: Truck, title: "Pronta entrega", desc: "Despacho com seguro de carga" },
  { icon: ShieldCheck, title: "Garantia de fábrica", desc: "Assistência técnica especializada" },
  { icon: PackageCheck, title: "Faturamento CNPJ", desc: "BNDES, Finame e leasing" },
] as const;

export default function PromoOffersGrid() {
  const product = PROMO_PRODUCTS[0];
  const specs = [
    { icon: Weight, label: "Carga", value: product.capacity },
    { icon: MoveVertical, label: "Elevação", value: product.lifting },
    { icon: BatteryCharging, label: "Bateria", value: product.battery },
  ];
  const quoteUrl = whatsappUrl(
    `Olá! Quero cotar a ${product.name} de ${product.capacity} da campanha promocional.`
  );

  return (
    <section id="ofertas" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Oferta da campanha</Eyebrow>
            <h2 className={`mt-4 ${TITLE} text-white`}>A DS3 com condição de lote</h2>
          </div>
          <p className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="h-4 w-4 text-red-500" aria-hidden="true" />
            Condições válidas enquanto durar o estoque do lote.
          </p>
        </Reveal>

        <Reveal>
          <article className="grid overflow-hidden rounded-[32px] border border-white/10 bg-ink lg:grid-cols-2">
            <Shot
              shot="tresQuartosDir"
              className="aspect-square w-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
              parallax={30}
            />

            <div className="flex flex-col p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${product.badgeClass}`}
                >
                  {product.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
                  Pronta entrega
                </span>
              </div>

              <h3 className="mt-6 text-3xl font-bold tracking-[-0.03em] text-white lg:text-4xl">
                {product.name}
              </h3>
              <p className="mt-2 text-neutral-400">{product.tagline}</p>

              <dl className="mt-6 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10">
                {specs.map((item) => (
                  <div key={item.label} className="flex flex-col-reverse justify-end gap-1 px-4 py-4 first:pl-0">
                    <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                      <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.label}
                    </dt>
                    <dd className="font-semibold text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 space-y-2.5">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <p className="text-4xl font-bold tracking-[-0.035em] text-white">{product.price}</p>
                <p className="mt-1 text-sm text-neutral-500">{product.installment}</p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <WhatsAppLink href={quoteUrl}>Cotar {product.shortName} no WhatsApp</WhatsAppLink>
                  <a href="#cotacao" className={BTN_GHOST}>
                    Pedir proposta formal
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        <ul className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
          {TRUST.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-neutral-500">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
