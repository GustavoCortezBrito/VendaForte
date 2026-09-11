"use client";

import { motion, type Variants } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  CalendarClock,
  FileText,
  Package,
  Truck,
  Wrench,
} from "lucide-react";
import { PONTOS_ATENDIMENTO, whatsappUrl } from "./promo.config";

/**
 * Seção 08 — Por que fechar com o Grupo Venda Forte.
 * Especificação: docs/promo/08-por-que-venda-forte.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Representante oficial EP",
    desc: "Garantia de fábrica, não de importação paralela.",
    wide: false,
  },
  {
    icon: FileText,
    title: "Faturamento direto para CNPJ",
    desc: "Nota fiscal, crédito de impostos e contrato formal.",
    wide: false,
  },
  {
    icon: Banknote,
    title: "BNDES, Finame e leasing",
    desc: "Até 60 vezes, com apoio do nosso consultor na documentação.",
    wide: false,
  },
  {
    icon: Truck,
    title: "Pronta entrega com seguro",
    desc: "Despacho por transportadora especializada em maquinário.",
    wide: false,
  },
  {
    icon: Package,
    title: "Peças multimarcas em estoque",
    desc: "Reposição sem espera de importação.",
    wide: false,
  },
  {
    icon: Wrench,
    title: "Assistência técnica própria",
    desc: "Equipe especializada, preventiva e corretiva.",
    wide: false,
  },
  {
    icon: CalendarClock,
    title: "Demonstração na sua operação",
    desc: "Validamos corredor, altura e ciclo antes de você fechar o pedido.",
    wide: true,
  },
] as const;

export default function PromoWhyUs() {
  return (
    <section
      id="por-que-nos"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-orange-500/[0.08] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cabeçalho */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
              O fornecedor
            </span>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white lg:text-4xl">
              Por que fechar com o Grupo Venda Forte
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Importação, distribuição, peças e assistência técnica na mesma empresa. Matriz
              em Chapecó e seis pontos de atendimento no Sul do Brasil.
            </p>

            <a
              href={whatsappUrl(
                "Olá! Quero agendar uma demonstração da EP DS3 na minha operação."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 hover:bg-emerald-500"
            >
              <CalendarClock className="h-4 w-4" />
              Agendar demonstração
            </a>
          </motion.div>

          {/* Itens */}
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2"
          >
            {REASONS.map((reason) => (
              <motion.li
                key={reason.title}
                variants={fadeUp}
                className={`flex gap-4 rounded-2xl border border-white/10 p-5 backdrop-blur-xl transition-colors duration-300 hover:border-orange-500/30 ${
                  reason.wide ? "bg-white/[0.05] sm:col-span-2" : "bg-white/[0.02]"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                  <reason.icon className="h-5 w-5 text-orange-400" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{reason.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500">{reason.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Pontos de atendimento */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 flex flex-col gap-3 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:gap-6"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-600">
            Pontos de atendimento
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {PONTOS_ATENDIMENTO.map((cidade) => (
              <span key={cidade} className="text-sm font-medium text-neutral-300">
                {cidade}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
