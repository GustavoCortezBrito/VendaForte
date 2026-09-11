"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  BatteryCharging,
  CircleCheckBig,
  Clock,
  MessageCircle,
  MoveVertical,
  PackageCheck,
  ShieldCheck,
  Truck,
  Weight,
} from "lucide-react";
import PromoMediaSlot from "./PromoMediaSlot";
import { PROMO_PRODUCTS, whatsappUrl, type PromoProduct } from "./promo.config";

/**
 * Seção 07 — Linha completa em campanha.
 * Especificação: docs/promo/07-vitrine.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

const TRUST = [
  { icon: Truck, title: "Pronta entrega", desc: "Despacho com seguro de carga" },
  { icon: ShieldCheck, title: "Garantia de fábrica", desc: "Assistência técnica especializada" },
  { icon: PackageCheck, title: "Faturamento CNPJ", desc: "BNDES, Finame e leasing" },
] as const;

function ProductCard({ product }: { product: PromoProduct }) {
  const url = whatsappUrl(
    `Olá! Quero cotar a ${product.name} de ${product.capacity} da campanha promocional.`
  );

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-xl ${
        product.featured
          ? "border-red-500/30 bg-gradient-to-b from-red-950/30 via-white/[0.03] to-white/[0.01]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-orange-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className={`pointer-events-none absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full blur-[90px] transition-opacity duration-500 ${
          product.featured ? "bg-red-600/25" : "bg-orange-500/10 opacity-60 group-hover:opacity-100"
        }`}
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${product.badgeClass}`}
          >
            {product.badge}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Pronta entrega
          </span>
        </div>

        <PromoMediaSlot
          media={product.mediaKey}
          className="mx-auto my-6 aspect-square w-48 rounded-none border-0"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="192px"
          fit="contain"
        />

        <div className="flex flex-1 flex-col px-6 pb-6">
          <h3 className="text-lg font-bold leading-snug text-white">{product.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-orange-400">
            {product.tagline}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
              <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
                <Weight className="h-3 w-3" />
                Carga
              </dt>
              <dd className="mt-1 font-bold text-white">{product.capacity}</dd>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
              <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
                <MoveVertical className="h-3 w-3" />
                Elevação
              </dt>
              <dd className="mt-1 font-bold text-white">{product.lifting}</dd>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
              <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
                <BatteryCharging className="h-3 w-3" />
                Bateria
              </dt>
              <dd className="mt-1 font-bold text-white">{product.battery}</dd>
            </div>
          </dl>

          <ul className="mt-5 space-y-2">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-xs text-neutral-400">
                <CircleCheckBig className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <div className="text-2xl font-black tracking-tight text-white">{product.price}</div>
              <p className="mt-1 text-[11px] text-neutral-500">{product.installment}</p>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] hover:bg-emerald-500 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Cotar {product.shortName} no WhatsApp
            </a>

            <a
              href="#cotacao"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
            >
              Pedir proposta formal
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function PromoOffersGrid() {
  return (
    <section
      id="ofertas"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="absolute left-1/4 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-[420px] w-[420px] rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-16 text-center"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Vitrine de campanha
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white lg:text-6xl">
            Modelos em oferta
          </h2>
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-neutral-500">
            <Clock className="h-4 w-4 text-red-500" />
            Condições válidas enquanto durar o estoque do lote.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {PROMO_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {TRUST.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-colors hover:border-orange-500/30"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                <item.icon className="h-5 w-5 text-orange-400" />
              </span>
              <div>
                <div className="text-sm font-bold text-white">{item.title}</div>
                <div className="text-xs text-neutral-500">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
