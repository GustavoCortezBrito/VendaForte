"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Battery, CalendarClock, CircleCheckBig, Fuel, PackageOpen } from "lucide-react";
import { whatsappUrl } from "./promo.config";
import { EASE_OUT, Eyebrow, Reveal, StudioPhoto, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 05 — O que você usa hoje. Seção clara.
 * Prioridade máxima da campanha: personaliza o ganho e qualifica o lead.
 * Especificação: docs/promo/05-o-que-voce-usa-hoje.md
 */

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
      className="scroll-mt-24 border-t border-ink/[0.08] bg-paper py-24 text-ink lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow tone="light">Caminho de troca</Eyebrow>
            <h2 className={`mt-4 ${TITLE}`}>Nunca foi tão fácil trocar</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              Selecione o que a sua operação usa hoje e veja o que muda com a DS3.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              role="group"
              aria-label="O que a sua operação usa hoje"
              className="mt-10 grid grid-cols-2 gap-1 rounded-[22px] bg-ink/[0.05] p-1 sm:grid-cols-4"
            >
              {OPTIONS.map((option) => {
                const isActive = option.id === activeId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveId(option.id)}
                    className={`relative flex cursor-pointer flex-col items-center gap-1.5 rounded-[18px] px-3 py-3.5 text-center text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/50 ${
                      isActive ? "text-ink" : "text-stone-500 hover:text-ink"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="troca-ativa"
                        className="absolute inset-0 rounded-[18px] bg-paper-card shadow-sm"
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                      />
                    )}
                    <option.icon className="relative h-5 w-5" aria-hidden="true" />
                    <span className="relative leading-tight">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Altura mínima reservada para o layout não pular ao trocar de opção */}
          <div className="mt-6 min-h-[340px] sm:min-h-[232px]">
            <AnimatePresence mode="wait">
              <motion.ul
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="grid gap-3 sm:grid-cols-2"
              >
                {active.gains.map((gain) => (
                  <li key={gain} className="flex items-start gap-3 rounded-2xl bg-paper-card p-5">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-stone-700">{gain}</span>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <WhatsAppLink href={url} className="mt-6">
            Simular a troca para a minha operação
          </WhatsAppLink>
        </div>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <div className="lg:sticky lg:top-28">
            <StudioPhoto
              photo="esquerda"
              className="aspect-[4/5] w-full rounded-[28px]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
