"use client";

import { Download } from "lucide-react";
import PromoMediaSlot, { hasMedia } from "./PromoMediaSlot";
import { CATALOGO_PDF, whatsappUrl } from "./promo.config";
import { BTN_PRIMARY, Eyebrow, Reveal, Shot, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 09 — Ficha técnica da EP DS3.
 * Especificação: docs/promo/09-ficha-tecnica.md
 */

interface SpecRow {
  label: string;
  value: string | null;
}

/**
 * `null` marca campo pendente do catálogo oficial EP. Pendentes aparecem como
 * lista do que vem na ficha completa; ao preencher, sobem para a tabela.
 */
const SPECS: SpecRow[] = [
  { label: "Capacidade nominal", value: "1.500 kg" },
  { label: "Altura de elevação", value: "3,9 metros" },
  { label: "Bateria", value: "24V de íon-lítio" },
  { label: "Garantia da bateria", value: "Até 5 anos de fábrica" },
  { label: "Altura livre", value: null },
  { label: "Centro de carga", value: null },
  { label: "Comprimento dos garfos", value: null },
  { label: "Largura dos garfos", value: null },
  { label: "Largura do corredor de trabalho", value: null },
  { label: "Raio de giro", value: null },
  { label: "Capacidade da bateria", value: null },
  { label: "Tipo de carregador", value: null },
  { label: "Velocidade de deslocamento", value: null },
  { label: "Velocidade de elevação", value: null },
  { label: "Rampa máxima", value: null },
  { label: "Peso do equipamento", value: null },
  { label: "Tipo de rodas", value: null },
  { label: "Grau de proteção", value: null },
];

/** Anotações sobre a foto de perfil, em % do quadro. */
const CALLOUTS = [
  { label: "Mastro · elevação até 3,9 m", left: "40%", top: "12%" },
  { label: "Bateria 24V de íon-lítio", left: "6%", top: "46%" },
  { label: "Capacidade de 1.500 kg", left: "48%", top: "76%" },
] as const;

export default function PromoSpecs() {
  const filled = SPECS.filter((row): row is { label: string; value: string } => row.value !== null);
  const pending = SPECS.filter((row) => row.value === null).map((row) => row.label);

  return (
    <section
      id="ficha-tecnica"
      className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Especificação</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>Ficha técnica da EP DS3</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400">
            Para quem precisa validar corredor, altura e ciclo antes de aprovar a compra.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <div className="relative">
              <Shot shot="perfil" className="aspect-square w-full" sizes="(max-width: 1024px) 100vw, 48vw" />
              <div aria-hidden="true">
                {CALLOUTS.map((callout) => (
                  <span
                    key={callout.label}
                    className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
                    style={{ left: callout.left, top: callout.top }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {callout.label}
                  </span>
                ))}
              </div>
            </div>

            {hasMedia("desenhoTecnico") && (
              <PromoMediaSlot
                media="desenhoTecnico"
                className="mt-6 aspect-square w-full rounded-[28px]"
                imageClassName="p-6"
                sizes="(max-width: 1024px) 100vw, 48vw"
                fit="contain"
              />
            )}
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.08}>
            <table className="w-full border-y border-white/10 text-left">
              <caption className="sr-only">
                Especificação técnica da empilhadeira patolada EP DS3
              </caption>
              <tbody className="divide-y divide-white/10">
                {filled.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="py-5 pr-6 font-normal text-neutral-400">
                      {row.label}
                    </th>
                    <td className="py-5 text-right text-xl font-semibold tracking-tight text-white">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-10 rounded-[28px] border border-white/10 bg-ink-raised p-8">
              <h3 className="text-lg font-semibold text-white">Leve a ficha completa para o seu time</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Com desenho cotado, para enviar à sua engenharia.
              </p>

              {pending.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {pending.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {CATALOGO_PDF && (
                  <a href={CATALOGO_PDF} className={BTN_PRIMARY}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Baixar catálogo técnico em PDF
                  </a>
                )}
                <WhatsAppLink href={whatsappUrl("Olá! Quero a ficha técnica completa da EP DS3.")}>
                  Pedir a ficha completa
                </WhatsAppLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
