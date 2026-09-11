"use client";

import { motion, type Variants } from "framer-motion";
import { CircleCheckBig, MessageCircle, TrendingDown, X } from "lucide-react";
import { whatsappUrl } from "./promo.config";

/**
 * Seção 04 — Prova de economia, lítio contra o convencional.
 * Especificação: docs/promo/04-prova-de-economia.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

interface RoiRow {
  label: string;
  lithium: string;
  lead: string;
  combustion: string;
}

const ROI_ROWS: RoiRow[] = [
  {
    label: "Tempo de recarga",
    lithium: "2 a 3 h, com recarga de oportunidade",
    lead: "8 a 10 h mais o resfriamento",
    combustion: "Troca de botijão a cada turno",
  },
  {
    label: "Manutenção da fonte",
    lithium: "Nenhuma. Sem água e sem ácido",
    lead: "Complemento de água semanal",
    combustion: "Óleo, filtros, velas e correias",
  },
  {
    label: "Infraestrutura exigida",
    lithium: "Tomada comum no próprio setor",
    lead: "Sala dedicada e ventilada",
    combustion: "Depósito de botijões pressurizados",
  },
  {
    label: "Vida útil da fonte",
    lithium: "Mais de 3.000 ciclos",
    lead: "Cerca de 1.200 ciclos",
    combustion: "Atrelada às revisões do motor",
  },
  {
    label: "Custo por turno",
    lithium: "Somente tarifa elétrica",
    lead: "Tarifa elétrica e troca de banco",
    combustion: "Preço do GLP mais consumíveis",
  },
  {
    label: "Emissões e ruído",
    lithium: "Zero emissão, operação silenciosa",
    lead: "Libera hidrogênio na recarga",
    combustion: "Gases de escape e ruído alto",
  },
];

/**
 * Premissas do cálculo de custo mensal. Enquanto forem nulas, o bloco de barras
 * não é renderizado: a especificação proíbe publicar economia sem memória de
 * cálculo. A tabela sozinha continua sustentando o argumento.
 */
const PREMISSAS: { turnos: number; horas: number; kwh: number; glp: number } | null = null;

export default function PromoDS3Highlight() {
  const whatsappROI = whatsappUrl(
    "Olá! Quero o comparativo de ROI da EP DS3 com lítio para a minha operação."
  );

  return (
    <section
      id="economia"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="absolute left-1/2 top-1/3 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
            Custo total de operação
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white lg:text-5xl">
            O custo que não aparece na proposta
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-neutral-400">
            A conta de uma empilhadeira não termina no preço de compra. Ela continua todo
            mês, na energia, na manutenção e nas horas em que a máquina fica parada.
          </p>
        </motion.div>

        {/* Barras comparativas, só com premissa fechada */}
        {PREMISSAS && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mb-10 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white">Custo mensal de operação</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Cálculo considera {PREMISSAS.turnos} turnos de {PREMISSAS.horas} horas, tarifa
              de energia de R$ {PREMISSAS.kwh} por kWh e GLP a R$ {PREMISSAS.glp} por kg.
              Valores de referência, sujeitos a variação por região e por perfil de operação.
            </p>
          </motion.div>
        )}

        {/* Tabela comparativa */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 border-b border-white/10 p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <TrendingDown className="h-5 w-5 text-emerald-400" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Lítio EP contra o convencional
              </h3>
              <p className="text-xs text-neutral-500">
                Comparativo para uma operação de dois turnos.
              </p>
            </div>
          </div>

          {/* Desktop: tabela real */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.14em]">
                  <th scope="col" className="p-5 font-semibold text-neutral-500">
                    Critério
                  </th>
                  <th scope="col" className="bg-emerald-500/[0.07] p-5 font-bold text-emerald-300">
                    EP DS3 · lítio
                  </th>
                  <th scope="col" className="p-5 font-semibold text-neutral-500">
                    Chumbo-ácido
                  </th>
                  <th scope="col" className="p-5 font-semibold text-neutral-500">
                    Combustão GLP
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <th scope="row" className="p-5 text-sm font-semibold text-white">
                      {row.label}
                    </th>
                    <td className="bg-emerald-500/[0.05] p-5 text-sm text-emerald-200/90">
                      <span className="flex items-start gap-2">
                        <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {row.lithium}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-neutral-500">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500/70" />
                        {row.lead}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-neutral-500">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500/70" />
                        {row.combustion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: blocos empilhados, sem rolagem lateral */}
          <ul className="divide-y divide-white/[0.06] md:hidden">
            {ROI_ROWS.map((row) => (
              <li key={row.label} className="p-5">
                <h4 className="text-sm font-bold text-white">{row.label}</h4>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-500/[0.07] p-3 text-emerald-200/90">
                    <CircleCheckBig className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>
                      <strong className="font-semibold text-emerald-300">EP DS3 · lítio.</strong>{" "}
                      {row.lithium}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 px-3 text-neutral-500">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500/70" />
                    <span>
                      <strong className="font-semibold">Chumbo-ácido.</strong> {row.lead}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 px-3 text-neutral-500">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500/70" />
                    <span>
                      <strong className="font-semibold">Combustão GLP.</strong> {row.combustion}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center">
            <p className="text-sm text-neutral-400">
              Quer o cálculo com os números da sua operação? Enviamos a memória de cálculo do
              payback em PDF.
            </p>
            <a
              href={whatsappROI}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
            >
              <MessageCircle className="h-4 w-4" />
              Receber a memória de cálculo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
