"use client";

import { CircleCheckBig, X } from "lucide-react";
import { whatsappUrl } from "./promo.config";
import { Eyebrow, Reveal, StudioPhoto, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 04 — Prova de economia, lítio contra o convencional. Seção clara.
 * Especificação: docs/promo/04-prova-de-economia.md
 */

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
    <section id="economia" className="scroll-mt-24 bg-paper py-24 text-ink lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="light">Custo total de operação</Eyebrow>
          <h2 className={`mt-4 ${TITLE}`}>O custo que não aparece na proposta</h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-stone-600">
            A conta de uma empilhadeira não termina no preço de compra. Ela continua todo mês, na
            energia, na manutenção e nas horas em que a máquina fica parada.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <StudioPhoto
              photo="direita"
              className="aspect-[4/5] w-full rounded-[28px] lg:aspect-auto lg:h-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>

          <div className="grid gap-4 lg:col-span-7">
            {STATS.map((stat, index) => (
              <Reveal
                key={stat.value}
                delay={index * 0.08}
                className="rounded-[28px] bg-paper-card p-8 lg:p-10"
              >
                <p className="text-5xl font-bold tracking-[-0.045em] lg:text-6xl">{stat.value}</p>
                <p className="mt-3 text-lg font-medium">{stat.label}</p>
                <p className="mt-1 text-sm text-stone-500">{stat.versus}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-4 overflow-hidden rounded-[28px] bg-paper-card">
          <div className="border-b border-ink/[0.08] p-6 lg:px-8">
            <h3 className="text-xl font-semibold tracking-tight">Lítio EP contra o convencional</h3>
            <p className="mt-1 text-sm text-stone-500">Comparativo para uma operação de dois turnos.</p>
          </div>

          {/* Desktop: tabela */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-ink/[0.08] text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                  <th scope="col" className="p-5 lg:pl-8">
                    Critério
                  </th>
                  <th scope="col" className="bg-red-50 p-5 text-red-700">
                    EP DS3 · lítio
                  </th>
                  <th scope="col" className="p-5">
                    Chumbo-ácido
                  </th>
                  <th scope="col" className="p-5 lg:pr-8">
                    Combustão GLP
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-ink/[0.06] last:border-0">
                    <th scope="row" className="p-5 text-sm font-semibold lg:pl-8">
                      {row.label}
                    </th>
                    <td className="bg-red-50 p-5 text-sm font-medium">
                      <span className="flex items-start gap-2">
                        <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                        {row.lithium}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-stone-500">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
                        {row.lead}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-stone-500 lg:pr-8">
                      <span className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
                        {row.combustion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: blocos empilhados, sem rolagem lateral */}
          <ul className="divide-y divide-ink/[0.06] md:hidden">
            {ROI_ROWS.map((row) => (
              <li key={row.label} className="p-6">
                <h4 className="text-sm font-semibold">{row.label}</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 font-medium">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-red-700">EP DS3 · lítio.</strong>{" "}
                      {row.lithium}
                    </span>
                  </p>
                  <p className="flex items-start gap-2 px-3 text-stone-500">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">Chumbo-ácido.</strong> {row.lead}
                    </span>
                  </p>
                  <p className="flex items-start gap-2 px-3 text-stone-500">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">Combustão GLP.</strong> {row.combustion}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-ink/[0.08] p-6 sm:flex-row sm:items-center lg:px-8">
            <p className="text-sm text-stone-600">
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
