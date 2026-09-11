"use client";

import { useMemo, useState } from "react";
import { CircleCheckBig, FileText, MessageCircle, Send } from "lucide-react";
import {
  MODEL_OPTIONS,
  SALES_TEAM,
  whatsappUrl,
  type PromoProductId,
} from "./promo.config";
import { BTN_PRIMARY, Eyebrow, Reveal, Shot, TITLE } from "./ui";

/**
 * Seção 12 — Cotação expressa.
 * Especificação: docs/promo/12-cotacao.md
 */

const QUANTITIES = ["1 unidade", "2 a 4 unidades", "5 ou mais"] as const;
const DEADLINES = ["Imediato", "Em até 30 dias", "Levantando orçamento"] as const;

type Quantity = (typeof QUANTITIES)[number];
type Deadline = (typeof DEADLINES)[number];

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25";

const LABEL_CLASS = "mb-2 block text-xs font-semibold text-neutral-300";

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
      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ${
        active
          ? "border-white bg-white text-ink"
          : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function PromoQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [model, setModel] = useState<PromoProductId>("ds3");
  const [quantity, setQuantity] = useState<Quantity>(QUANTITIES[0]);
  const [deadline, setDeadline] = useState<Deadline>(DEADLINES[0]);
  const [consultantId, setConsultantId] = useState(SALES_TEAM[0].id);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const consultant = SALES_TEAM.find((item) => item.id === consultantId) ?? SALES_TEAM[0];

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
    <section id="cotacao" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <Eyebrow>Proposta expressa</Eyebrow>
              <h2 className={`mt-4 ${TITLE} text-white`}>Receba uma cotação em minutos</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-400">
                Preencha os dados e enviamos a proposta em PDF com o valor de lote e a
                disponibilidade de pronta entrega.
              </p>
            </Reveal>
            <Shot
              shot="frente"
              className="mt-4 hidden aspect-square w-full max-w-md lg:block"
              sizes="36vw"
              parallax={30}
            />
          </div>
        </div>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <div className="rounded-[32px] border border-white/10 bg-ink-raised p-6 sm:p-10">
            {sentUrl ? (
              <div className="py-6 text-center">
                <CircleCheckBig className="mx-auto h-12 w-12 text-green-500" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                  Proposta enviada para {consultant.name}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
                  A conversa abriu no WhatsApp com a sua solicitação já preenchida. Se nada
                  aconteceu,{" "}
                  <a
                    href={sentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline underline-offset-4"
                  >
                    clique aqui para abrir
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSentUrl(null)}
                  className="mt-6 cursor-pointer text-sm font-semibold text-neutral-400 underline underline-offset-4 transition-colors hover:text-white"
                >
                  Editar os dados e enviar de novo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="promo-name" className={LABEL_CLASS}>
                      Seu nome completo *
                    </label>
                    <input
                      id="promo-name"
                      type="text"
                      required
                      autoComplete="name"
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
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(event) => setPhone(maskPhone(event.target.value))}
                      placeholder="(49) 99999-9999"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="promo-company" className={LABEL_CLASS}>
                      Empresa ou cidade
                    </label>
                    <input
                      id="promo-company"
                      type="text"
                      autoComplete="organization"
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
                        <option key={option.id} value={option.id} className="bg-ink-raised text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <fieldset>
                  <legend className={LABEL_CLASS}>Quantidade estimada</legend>
                  <div className="flex flex-wrap gap-2">
                    {QUANTITIES.map((option) => (
                      <Chip key={option} active={quantity === option} onClick={() => setQuantity(option)}>
                        {option}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className={LABEL_CLASS}>Prazo de compra</legend>
                  <div className="flex flex-wrap gap-2">
                    {DEADLINES.map((option) => (
                      <Chip key={option} active={deadline === option} onClick={() => setDeadline(option)}>
                        {option}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className={LABEL_CLASS}>Consultor que vai atender</legend>
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
                </fieldset>

                <div className="rounded-2xl border border-white/10 bg-ink p-5">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-neutral-500">
                    <FileText className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
                    Prévia da mensagem enviada
                  </p>
                  <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-neutral-400">
                    {message}
                  </pre>
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className={`${BTN_PRIMARY} w-full cursor-pointer py-4 text-base disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                  Solicitar proposta formal em PDF
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-xs text-neutral-500">
                  <MessageCircle className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                  A conversa abre direto no WhatsApp de {consultant.name}. Sem cadastro e sem
                  compromisso.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
