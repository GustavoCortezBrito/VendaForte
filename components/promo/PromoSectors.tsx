"use client";

import { motion, type Variants } from "framer-motion";
import PromoMediaSlot from "./PromoMediaSlot";
import { MEDIA } from "./promo.config";

/**
 * Seção 06 — Aplicações por setor.
 * Setores escolhidos a partir dos segmentos que a empresa já atende.
 * Especificação: docs/promo/06-aplicacoes.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

interface Sector {
  title: string;
  desc: string;
  mediaKey: keyof typeof MEDIA;
  wide: boolean;
}

const SECTORS: Sector[] = [
  {
    title: "Armazém e centro de distribuição",
    desc: "Verticaliza o terceiro nível do porta-pallets em corredor estreito, sem obra civil.",
    mediaKey: "setorArmazem",
    wide: true,
  },
  {
    title: "Frigorífico e câmara fria",
    desc: "A bateria de lítio mantém desempenho no frio, onde o chumbo-ácido perde capacidade.",
    mediaKey: "setorFrigorifico",
    wide: false,
  },
  {
    title: "Indústria alimentícia",
    desc: "Abastece a linha sem gás de escape dentro do galpão.",
    mediaKey: "setorIndustria",
    wide: false,
  },
  {
    title: "Agronegócio e cooperativa",
    desc: "Movimentação pesada em armazém de grãos e insumos.",
    mediaKey: "setorAgro",
    wide: false,
  },
  {
    title: "Varejo e atacado",
    desc: "Operação silenciosa permite reposição com a loja aberta.",
    mediaKey: "setorVarejo",
    wide: false,
  },
];

export default function PromoSectors() {
  return (
    <section
      id="aplicacoes"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28"
    >
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-orange-500/[0.08] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-12"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Onde a DS3 trabalha
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white lg:text-5xl">
            Feita para a sua operação
          </h2>
          <p className="mt-4 max-w-xl text-neutral-500">
            Os setores que a gente atende todo dia no Sul do Brasil.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {SECTORS.map((sector) => (
            <motion.article
              key={sector.title}
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 ${
                sector.wide ? "md:col-span-2" : ""
              }`}
            >
              <PromoMediaSlot
                media={sector.mediaKey}
                className={`w-full rounded-none border-0 ${
                  sector.wide ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
                imageClassName="transition-transform duration-700 group-hover:scale-105"
                sizes={sector.wide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              />

              {/* Gradiente obrigatório: garante contraste do texto sobre a foto */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/45 to-transparent transition-opacity duration-500 group-hover:from-[#05070B]" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-lg font-bold text-white">{sector.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-neutral-300">
                  {sector.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <p className="mt-6 text-xs text-neutral-600">
          Imagens ilustrativas até a entrega das fotos de operação real.
        </p>
      </div>
    </section>
  );
}
