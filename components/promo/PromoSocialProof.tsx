"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { CLIENTES, NUMEROS } from "./promo.config";

/**
 * Seção 10 — Prova social.
 * Credencia o Grupo Venda Forte, não a EP.
 *
 * Regra da especificação: nenhum número sem lastro. Os quatro exibidos já são
 * publicados pela empresa no site principal. O depoimento fica fora do ar até
 * existir citação real com autorização por escrito.
 *
 * Especificação: docs/promo/10-prova-social.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

/** Depoimento pendente de coleta e autorização. Ver docs/promo/10-prova-social.md */
const DEPOIMENTO: { quote: string; name: string; role: string; company: string } | null = null;

export default function PromoSocialProof() {
  return (
    <section
      id="clientes"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-red-600/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-12 text-center"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Quem confia
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white lg:text-4xl">
            Empresas que operam com a gente
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500">
            Indústria alimentícia, cooperativa, frigorífico, varejo e transporte no Sul do
            Brasil.
          </p>
        </motion.div>

        {/* Números */}
        <motion.dl
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-14 grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {NUMEROS.map((item) => (
            <motion.div key={item.label} variants={fadeUp} className="text-center">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block text-4xl font-black tabular-nums tracking-tight text-white lg:text-5xl">
                  {item.value}
                </span>
                <span className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  {item.label}
                </span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Logos */}
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-3 items-center gap-x-8 gap-y-10 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl sm:grid-cols-4 lg:grid-cols-8"
        >
          {CLIENTES.map((cliente) => (
            <motion.li
              key={cliente.name}
              variants={fadeUp}
              className="relative h-10 w-full opacity-70 brightness-0 invert transition-all duration-300 hover:opacity-100 md:opacity-60 md:hover:brightness-100 md:hover:invert-0"
            >
              <Image
                src={cliente.file}
                alt={cliente.name}
                fill
                sizes="120px"
                className="object-contain"
              />
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-4 text-center text-xs text-neutral-600">
          Uso dos logos sujeito a autorização de cada cliente para peça publicitária.
        </p>

        {/* Depoimento, publicado apenas quando houver citação real autorizada */}
        {DEPOIMENTO && (
          <motion.figure
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mx-auto mt-14 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl"
          >
            <blockquote className="text-xl font-medium leading-relaxed text-white">
              {DEPOIMENTO.quote}
            </blockquote>
            <figcaption className="mt-5 text-sm text-neutral-400">
              <cite className="not-italic font-semibold text-white">{DEPOIMENTO.name}</cite>
              {", "}
              {DEPOIMENTO.role} na {DEPOIMENTO.company}
            </figcaption>
          </motion.figure>
        )}
      </div>
    </section>
  );
}
