"use client";

import { CircleCheckBig, X } from "lucide-react";
import { whatsappUrl } from "./promo.config";
import { Eyebrow, Reveal, Shot, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 04 — Prova de economia, lítio contra o chumbo-ácido.
 * Especificação: docs/promo/04-prova-de-economia.md
 */

interface RoiRow {
  label: string;
  lithium: string;
  lead: string;
}

const ROI_ROWS: RoiRow[] = [
  {
    label: "Tempo de recarga",
    lithium: "2 a 3 h, com recarga de oportunidade",
    lead: "8 a 10 h mais o resfriamento",
  },
  {
    label: "Manutenção da fonte",
    lithium: "Nenhuma. Sem água e sem ácido",
    lead: "Complemento de água semanal",
  },
  {
    label: "Infraestrutura exigida",
    lithium: "Tomada comum no próprio setor",
    lead: "Sala dedicada e ventilada",
  },
  {
    label: "Vida útil da fonte",
    lithium: "Mais de 3.000 ciclos",
    lead: "Cerca de 1.200 ciclos",
  },
];

/** Os três números vêm da tabela acima, nada além dela. */
const STATS = [
  {
    value: "2 a 3 h",
    label: "de recarga, com recarga de oportunidade",
    versus: "Chumbo-ácido: 8 a 10 h mais o resfriamento",
  },
  {
    value: "3.000+",
    label: "ciclos de vida útil da bateria",
    versus: "Chumbo-ácido: cerca de 1.200",
  },
  {
    value: "Zero",
    label: "manutenção de água e ácido",
    versus: "Carrega em tomada comum, sem sala de baterias",
  },
] as const;

export default function PromoDS3Highlight() {
  const whatsappROI = whatsappUrl(
    "Olá! Quero o comparativo de ROI da EP DS3 com lítio para a minha operação."
  );

  return (
    <section id="economia" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Custo total de operação</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>O custo que não aparece na proposta</h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-400">
            A conta de uma empilhadeira não termina no preço de compra. Ela continua todo mês, na
            energia, na manutenção e nas horas em que a máquina fica parada.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Shot
              shot="tresQuartosLogo"
              className="aspect-square w-full lg:aspect-auto lg:h-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
              parallax={30}
            />
          </Reveal>

          <div className="grid gap-4 lg:col-span-7">
            {STATS.map((stat, index) => (
              <Reveal
                key={stat.value}
                delay={index * 0.08}
                className="rounded-[28px] border border-white/10 bg-ink-raised p-8 lg:p-10"
              >
                <p className="text-5xl font-bold tracking-[-0.045em] text-white lg:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-lg font-medium text-white">{stat.label}</p>
                <p className="mt-1 text-sm text-neutral-500">{stat.versus}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-ink-raised">
          <div className="border-b border-white/10 p-6 lg:px-8">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Lítio EP contra o chumbo-ácido
            </h3>
            <p className="mt-1 text-sm text-neutral-500">Comparativo para uma operação de dois turnos.</p>
          </div>

          {/* Desktop: tabela */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  <th scope="col" className="p-5 lg:pl-8">
                    Critério
                  </th>
                  <th scope="col" className="bg-red-500/[0.08] p-5 text-red-400">
                    EP DS3 · lítio
                  </th>
                  <th scope="col" className="p-5 lg:pr-8">
                    Chumbo-ácido
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.06] last:border-0">
                    <th scope="row" className="p-5 text-sm font-semibold text-white lg:pl-8">
                      {row.label}
                    </th>
                    <td className="bg-red-500/[0.08] p-5 text-sm font-medium text-white">
                      <span className="flex items-start gap-2">
                        <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                        {row.lithium}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-neutral-500 lg:pr-8">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" aria-hidden="true" />
                        {row.lead}
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
              <li key={row.label} className="p-6">
                <h4 className="text-sm font-semibold text-white">{row.label}</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex items-start gap-2 rounded-xl bg-red-500/[0.08] p-3 font-medium text-white">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-red-400">EP DS3 · lítio.</strong>{" "}
                      {row.lithium}
                    </span>
                  </p>
                  <p className="flex items-start gap-2 px-3 text-neutral-500">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-neutral-400">Chumbo-ácido.</strong> {row.lead}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 p-6 sm:flex-row sm:items-center lg:px-8">
            <p className="text-sm text-neutral-400">
              Quer o cálculo com os números da sua operação? Enviamos a memória de cálculo do
              payback em PDF.
            </p>
            <WhatsAppLink href={whatsappROI} className="shrink-0">
              Receber a memória de cálculo
            </WhatsAppLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
