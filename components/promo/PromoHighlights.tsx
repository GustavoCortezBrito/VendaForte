"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, BatteryCharging, Banknote, MoveVertical, Truck, Wrench } from "lucide-react";

/**
 * Seção 03 — Destaques rápidos.
 * Especificação: docs/promo/03-destaques.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

const HIGHLIGHTS = [
  {
    icon: BatteryCharging,
    title: "Lítio sem manutenção",
    desc: "Sem água desmineralizada, sem ácido, sem sala de baterias.",
    href: "#economia",
  },
  {
    icon: MoveVertical,
    title: "1.500 kg a 3,9 metros",
    desc: "Verticaliza o terceiro nível em corredor estreito.",
    href: "#ds3",
  },
  {
    icon: Truck,
    title: "Pronta entrega",
    desc: "Estoque com despacho e seguro de carga.",
    href: "#ofertas",
  },
  {
    icon: Banknote,
    title: "Até 60x no BNDES",
    desc: "Faturamento direto para CNPJ, com Finame e leasing.",
    href: "#cotacao",
  },
  {
    icon: Wrench,
    title: "Assistência especializada",
    desc: "Peças em estoque e equipe técnica própria.",
    href: "#por-que-nos",
  },
] as const;

export default function PromoHighlights() {
  return (
    <section
      id="destaques"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-10"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            O essencial
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white lg:text-4xl">
            Cinco motivos para trocar agora
          </h2>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5"
        >
          {HIGHLIGHTS.map((item) => (
            <motion.li
              key={item.title}
              variants={fadeUp}
              className="w-[80%] shrink-0 snap-center md:w-auto"
            >
              <a
                href={item.href}
                className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <item.icon className="relative h-5 w-5 text-orange-400" />
                <h3 className="relative mt-4 text-sm font-bold leading-snug text-white">
                  {item.title}
                </h3>
                <p className="relative mt-2 text-xs leading-relaxed text-neutral-500">
                  {item.desc}
                </p>
                <span className="relative mt-auto flex items-center gap-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 transition-colors group-hover:text-orange-400">
                  Ver detalhes
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
