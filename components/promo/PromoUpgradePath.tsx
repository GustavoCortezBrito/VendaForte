"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Battery, CircleCheckBig, Fuel, CalendarClock, PackageOpen } from "lucide-react";
import { whatsappUrl } from "./promo.config";

/**
 * Seção 05 — O que você usa hoje.
 * Prioridade máxima da campanha: personaliza o ganho e qualifica o lead.
 * Especificação: docs/promo/05-o-que-voce-usa-hoje.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

interface UpgradeOption {
  id: string;
  label: string;
  icon: typeof Battery;
  gains: string[];
}

const OPTIONS: UpgradeOption[] = [
  {
    id: "manual",
    label: "Paleteira manual",
    icon: PackageOpen,
    gains: [
      "Elimina o esforço físico e o afastamento por lesão de esforço repetitivo.",
      "Verticaliza até 3,9 metros, o que a paleteira manual não faz.",
      "Multiplica a quantidade de pallets movimentados por hora.",
      "Libera o operador para tarefas de maior valor no armazém.",
    ],
  },
  {
    id: "chumbo",
    label: "Chumbo-ácido",
    icon: Battery,
    gains: [
      "Recarrega em 2 a 3 horas contra 8 a 10 horas, com recarga de oportunidade.",
      "Libera a sala de baterias e devolve essa área para a operação.",
      "Acaba a manutenção semanal de água e o risco de vazamento de ácido.",
      "Mais de 3.000 ciclos de vida útil contra cerca de 1.200.",
    ],
  },
  {
    id: "glp",
    label: "Combustão a GLP",
    icon: Fuel,
    gains: [
      "Troca o custo do GLP pela tarifa elétrica, que é estável e previsível.",
      "Zero emissão, o que libera a operação em ambiente fechado e em câmara fria.",
      "Fim das revisões de óleo, filtros, velas e correias.",
      "Operação silenciosa, com ganho direto em turno noturno e em varejo.",
    ],
  },
  {
    id: "locacao",
    label: "Locação mensal",
    icon: CalendarClock,
    gains: [
      "A parcela do BNDES no lugar do aluguel, com o ativo no seu balanço ao fim.",
      "Sem reajuste anual de contrato de locação.",
      "Garantia de fábrica de até 5 anos na bateria.",
      "Simulação comparando a sua mensalidade atual com a parcela em até 60x.",
    ],
  },
];

export default function PromoUpgradePath() {
  const [activeId, setActiveId] = useState(OPTIONS[0].id);
  const active = OPTIONS.find((option) => option.id === activeId) ?? OPTIONS[0];

  const url = whatsappUrl(
    `Olá! Hoje a minha operação usa ${active.label.toLowerCase()} e quero simular a troca para a EP DS3.`
  );

  return (
    <section
      id="trocar"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="absolute -left-32 top-1/4 h-[440px] w-[440px] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[440px] w-[440px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-10"
        >
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-400">
              Caminho de troca
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Nunca foi tão fácil trocar
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-400">
              Selecione o que a sua operação usa hoje e veja o que muda com a DS3.
            </p>
          </div>

          {/* Seletor */}
          <div
            role="group"
            aria-label="O que a sua operação usa hoje"
            className="-mx-8 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-8 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:pb-0"
          >
            {OPTIONS.map((option) => {
              const isActive = option.id === activeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveId(option.id)}
                  className={`flex w-[60%] shrink-0 cursor-pointer snap-center flex-col items-center gap-2 rounded-2xl border px-4 py-4 text-center transition-all sm:w-auto ${
                    isActive
                      ? "border-orange-500/60 bg-gradient-to-b from-red-600/25 to-orange-600/25 text-white shadow-lg shadow-red-900/30"
                      : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-xs font-semibold leading-tight">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Painel. Altura mínima reservada para o layout não pular. */}
          <div className="mt-8 min-h-[248px] sm:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {active.gains.map((gain) => (
                  <div
                    key={gain}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <p className="text-sm leading-relaxed text-neutral-300">{gain}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 py-4 text-sm font-black text-white shadow-xl shadow-red-600/25 transition-all hover:from-red-500 hover:to-orange-500"
          >
            Simular a troca para a minha operação
          </a>
        </motion.div>
      </div>
    </section>
  );
}
