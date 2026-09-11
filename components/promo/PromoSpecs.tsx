"use client";

import { motion, type Variants } from "framer-motion";
import { Download, MessageCircle } from "lucide-react";
import PromoMediaSlot from "./PromoMediaSlot";
import { CATALOGO_PDF, whatsappUrl } from "./promo.config";

/**
 * Seção 09 — Ficha técnica da EP DS3.
 * Especificação: docs/promo/09-ficha-tecnica.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

interface SpecRow {
  label: string;
  value: string | null;
}

/**
 * `null` marca campo pendente do catálogo oficial EP. A linha aparece com o
 * marcador de pendência em vez de sumir, para o time saber o que falta preencher.
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

export default function PromoSpecs() {
  return (
    <section
      id="ficha-tecnica"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-12"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Especificação
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white lg:text-5xl">
            Ficha técnica da EP DS3
          </h2>
          <p className="mt-4 max-w-xl text-neutral-500">
            Para quem precisa validar corredor, altura e ciclo antes de aprovar a compra.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[55fr_45fr]">
          {/* Tabela */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
          >
            <table className="w-full text-left">
              <caption className="sr-only">
                Especificação técnica da empilhadeira patolada EP DS3
              </caption>
              <tbody>
                {SPECS.map((row, index) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/[0.06] last:border-0 ${
                      index % 2 === 1 ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    <th
                      scope="row"
                      className="p-4 text-sm font-medium text-neutral-400 sm:w-1/2"
                    >
                      {row.label}
                    </th>
                    <td className="p-4 text-right text-sm sm:text-left">
                      {row.value ? (
                        <span className="font-bold text-white">{row.value}</span>
                      ) : (
                        <span className="font-mono text-[11px] uppercase tracking-wider text-orange-400/70">
                          a preencher
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Desenho técnico e download */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="space-y-6 lg:sticky lg:top-28 lg:self-start"
          >
            <PromoMediaSlot
              media="desenhoTecnico"
              className="aspect-square w-full rounded-2xl"
              imageClassName="p-6"
              sizes="(max-width: 1024px) 100vw, 45vw"
              fit="contain"
            />

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white">Leve para o seu time</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                Ficha completa com desenho cotado, para enviar à sua engenharia.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                {CATALOGO_PDF && (
                  <a
                    href={CATALOGO_PDF}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 py-3.5 text-sm font-bold text-white transition-all hover:from-red-500 hover:to-orange-500"
                  >
                    <Download className="h-4 w-4" />
                    Baixar catálogo técnico em PDF
                  </a>
                )}
                <a
                  href={whatsappUrl("Olá! Tenho uma dúvida técnica sobre a EP DS3.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-emerald-400/40 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  Tirar dúvida técnica no WhatsApp
                </a>
              </div>

              {!CATALOGO_PDF && (
                <p className="mt-4 font-mono text-[10px] leading-relaxed text-neutral-600">
                  Slot de arquivo: /promo/ds3-catalogo.pdf
                  <br />O botão de download aparece quando o PDF for publicado.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
