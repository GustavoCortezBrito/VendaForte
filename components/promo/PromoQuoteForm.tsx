"use client";

import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { CircleCheckBig, FileText, MessageCircle, Send } from "lucide-react";
import {
  MODEL_OPTIONS,
  SALES_TEAM,
  whatsappUrl,
  type PromoProductId,
} from "./promo.config";

/* -------------------------------------------------------------------------- */
/* Animações                                                                  */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

/* -------------------------------------------------------------------------- */
/* Opções                                                                     */
/* -------------------------------------------------------------------------- */

const QUANTITIES = ["1 unidade", "2 a 4 unidades", "5 ou mais"] as const;
const DEADLINES = ["Imediato", "Em até 30 dias", "Levantando orçamento"] as const;

type Quantity = (typeof QUANTITIES)[number];
type Deadline = (typeof DEADLINES)[number];

const INPUT_CLASS =
  "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/40";

const LABEL_CLASS = "mb-1.5 block text-xs font-semibold text-neutral-300";

/** Aplica a máscara (11) 99999-9999 conforme o usuário digita. */
function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/* -------------------------------------------------------------------------- */
/* Chip selecionável                                                          */
/* -------------------------------------------------------------------------- */

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
        active
          ? "border-orange-500/60 bg-gradient-to-r from-red-600/25 to-orange-600/25 text-white shadow-lg shadow-red-900/30"
          : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Formulário                                                                 */
/* -------------------------------------------------------------------------- */

export default function PromoQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [model, setModel] = useState<PromoProductId>("ds3");
  const [quantity, setQuantity] = useState<Quantity>(QUANTITIES[0]);
  const [deadline, setDeadline] = useState<Deadline>(DEADLINES[0]);
  const [consultantId, setConsultantId] = useState(SALES_TEAM[0].id);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const consultant =
    SALES_TEAM.find((item) => item.id === consultantId) ?? SALES_TEAM[0];

  const modelLabel =
    MODEL_OPTIONS.find((option) => option.id === model)?.label ?? "Consultoria de frota";

  const isValid = name.trim().length > 2 && phone.replace(/\D/g, "").length >= 10;

  /** Mensagem de proposta formal montada em tempo real. */
  const message = useMemo(
    () =>
      [
        "*Solicitação de proposta — Campanha EP Equipment*",
        "",
        `*Nome:* ${name || "—"}`,
        `*Empresa / cidade:* ${company || "não informado"}`,
        `*WhatsApp:* ${phone || "—"}`,
        `*Modelo de interesse:* ${modelLabel}`,
        `*Quantidade:* ${quantity}`,
        `*Prazo de compra:* ${deadline}`,
        "",
        "Por favor, envie a proposta formal em PDF com preço de lote, prazo de entrega e simulação de financiamento BNDES/Finame.",
      ].join("\n"),
    [name, company, phone, modelLabel, quantity, deadline]
  );

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    // Abre dentro do gesto do usuário para não ser barrado por bloqueador de pop-up.
    const url = whatsappUrl(message, consultant.whatsappNumber);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  return (
    <section
      id="cotacao"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28 text-white"
    >
      {/* Iluminação volumétrica */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="absolute -left-32 top-1/4 h-[440px] w-[440px] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[440px] w-[440px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-2xl backdrop-blur-xl sm:p-12"
        >
          {/* Cabeçalho */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-400">
              Proposta expressa
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Receba uma cotação em minutos
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              Preencha os dados e enviamos a proposta em PDF com o valor de lote e a
              disponibilidade de pronta entrega.
            </p>
          </div>

          {sentUrl ? (
            /* Estado de sucesso ---------------------------------------- */
            <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
              <CircleCheckBig className="mx-auto h-12 w-12 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">
                Proposta enviada para {consultant.name}
              </h3>
              <p className="text-sm text-neutral-300">
                A conversa abriu no WhatsApp com a sua solicitação já preenchida. Se nada aconteceu,{" "}
                <a
                  href={sentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 underline"
                >
                  clique aqui para abrir
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setSentUrl(null)}
                className="cursor-pointer text-xs font-semibold text-neutral-400 underline transition-colors hover:text-white"
              >
                Editar os dados e enviar de novo
              </button>
            </div>
          ) : (
            /* Formulário ------------------------------------------------ */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="promo-name" className={LABEL_CLASS}>
                    Seu nome completo *
                  </label>
                  <input
                    id="promo-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ex.: Carlos Silva"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="promo-phone" className={LABEL_CLASS}>
                    WhatsApp com DDD *
                  </label>
                  <input
                    id="promo-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(event) => setPhone(maskPhone(event.target.value))}
                    placeholder="(49) 99999-9999"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="promo-company" className={LABEL_CLASS}>
                    Empresa ou cidade
                  </label>
                  <input
                    id="promo-company"
                    type="text"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="Ex.: Logística ABC, Chapecó"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="promo-model" className={LABEL_CLASS}>
                    Modelo de maior interesse *
                  </label>
                  <select
                    id="promo-model"
                    value={model}
                    onChange={(event) => setModel(event.target.value as PromoProductId)}
                    className={`${INPUT_CLASS} cursor-pointer`}
                  >
                    {MODEL_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id} className="bg-zinc-900 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantidade */}
              <div>
                <span className={LABEL_CLASS}>Quantidade estimada</span>
                <div className="flex flex-wrap gap-2">
                  {QUANTITIES.map((option) => (
                    <Chip
                      key={option}
                      active={quantity === option}
                      onClick={() => setQuantity(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Prazo */}
              <div>
                <span className={LABEL_CLASS}>Prazo de compra</span>
                <div className="flex flex-wrap gap-2">
                  {DEADLINES.map((option) => (
                    <Chip
                      key={option}
                      active={deadline === option}
                      onClick={() => setDeadline(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Consultor */}
              <div>
                <span className={LABEL_CLASS}>Consultor que vai atender</span>
                <div className="flex flex-wrap gap-2">
                  {SALES_TEAM.map((option) => (
                    <Chip
                      key={option.id}
                      active={consultantId === option.id}
                      onClick={() => setConsultantId(option.id)}
                    >
                      {option.name}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Prévia da mensagem */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  <FileText className="h-3.5 w-3.5 text-orange-400" />
                  Prévia da mensagem enviada
                </div>
                <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-neutral-400">
                  {message}
                </pre>
              </div>

              <motion.button
                type="submit"
                disabled={!isValid}
                whileTap={isValid ? { scale: 0.99 } : undefined}
                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-600 py-4 text-base font-black text-white shadow-xl shadow-red-600/25 transition-all hover:from-red-500 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <Send className="h-5 w-5" />
                Solicitar proposta formal em PDF
              </motion.button>

              <p className="flex items-center justify-center gap-2 text-center text-[11px] text-neutral-500">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                A conversa abre direto no WhatsApp de {consultant.name}. Sem cadastro e sem
                compromisso.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
