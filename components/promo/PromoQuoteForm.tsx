"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CircleAlert,
  CircleCheckBig,
  Clock,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import {
  CONTATO,
  HORARIO_ATENDIMENTO,
  MODEL_OPTIONS,
  PONTOS_ATENDIMENTO,
  PROMO_PRODUCTS,
  WHATSAPP_CENTRAL,
  WHATSAPP_DISPLAY,
  whatsappUrl,
  type PromoProductId,
} from "./promo.config";
import { BTN_PRIMARY, EASE_OUT, Eyebrow, Reveal, TITLE } from "./ui";

/**
 * Seção 12 — Cotação expressa.
 *
 * Um envio faz as duas coisas ao mesmo tempo: abre o WhatsApp com a solicitação
 * pronta e manda o e-mail pela mesma rota do formulário do site principal.
 *
 * Especificação: docs/promo/12-cotacao.md
 */

const QUANTITIES = ["1 unidade", "2 a 4 unidades", "5 ou mais"] as const;
const DEADLINES = ["Imediato", "Em até 30 dias", "Levantando orçamento"] as const;

type Quantity = (typeof QUANTITIES)[number];
type Deadline = (typeof DEADLINES)[number];
type SendStatus = "sending" | "sent" | "failed";

const MODELS: { id: PromoProductId; name: string; detail: string }[] = [
  ...PROMO_PRODUCTS.map((product) => ({
    id: product.id,
    name: product.shortName,
    detail: product.capacity,
  })),
  { id: "outro", name: "Outro", detail: "Consultoria de frota" },
];

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder:text-neutral-600 transition-colors focus:border-red-500/70 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-red-500/15";

const LABEL_CLASS = "mb-2 block text-sm font-medium text-neutral-300";

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

export default function PromoQuoteForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [model, setModel] = useState<PromoProductId>("ds3");
  const [quantity, setQuantity] = useState<Quantity>(QUANTITIES[0]);
  const [deadline, setDeadline] = useState<Deadline>(DEADLINES[0]);
  const [notes, setNotes] = useState("");
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<SendStatus>("sending");

  const modelLabel =
    MODEL_OPTIONS.find((option) => option.id === model)?.label ?? "Consultoria de frota";

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) return;

    const place = [company.trim(), city.trim()].filter(Boolean).join(", ") || "não informado";
    const message = notes.trim();

    const whatsappMessage = [
      "*Solicitação de proposta — Campanha EP Equipment*",
      "",
      `*Nome:* ${name.trim()}`,
      `*E-mail:* ${email.trim()}`,
      `*WhatsApp:* ${phone}`,
      `*Empresa / cidade:* ${place}`,
      `*Modelo de interesse:* ${modelLabel}`,
      `*Quantidade:* ${quantity}`,
      `*Prazo de compra:* ${deadline}`,
      ...(message ? ["", `*Mensagem:* ${message}`] : []),
      "",
      "Por favor, envie a proposta formal com preço de lote, prazo de entrega e as formas de pagamento.",
    ].join("\n");

    // Abre antes de qualquer espera, ainda dentro do clique, para o navegador
    // não barrar como pop-up. O e-mail segue em paralelo.
    const url = whatsappUrl(whatsappMessage, WHATSAPP_CENTRAL);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
    setEmailStatus("sending");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name.trim(),
          email: email.trim(),
          telefone: phone,
          empresa: company.trim(),
          cidade: city.trim(),
          equipamento: modelLabel,
          mensagem: [
            "Solicitação de proposta pela campanha promocional.",
            "",
            `Quantidade: ${quantity}`,
            `Prazo de compra: ${deadline}`,
            "",
            message || "Sem mensagem adicional.",
          ].join("\n"),
          origem: "Campanha EP Equipment",
        }),
      });
      setEmailStatus(response.ok ? "sent" : "failed");
    } catch {
      setEmailStatus("failed");
    }
  };

  return (
    <section id="cotacao" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Proposta expressa</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>Receba uma cotação em minutos</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400">
            Preencha os dados e enviamos a proposta com o valor de lote, o prazo de entrega e as
            formas de pagamento.
          </p>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mt-14 grid overflow-hidden rounded-[32px] border border-white/10 bg-ink-raised lg:grid-cols-12"
        >
          <ContactPanel />

          <div className="p-6 sm:p-10 lg:col-span-8 lg:p-12">
            {sentUrl ? (
              <SentState
                name={name}
                url={sentUrl}
                emailStatus={emailStatus}
                onBack={() => setSentUrl(null)}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="promo-name" label="Nome completo" required className="sm:col-span-2">
                    <input
                      id="promo-name"
                      type="text"
                      required
                      minLength={3}
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ex.: Carlos Silva"
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <Field id="promo-email" label="E-mail" required>
                    <input
                      id="promo-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@empresa.com.br"
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <Field id="promo-phone" label="WhatsApp com DDD" required>
                    <input
                      id="promo-phone"
                      type="tel"
                      inputMode="numeric"
                      required
                      pattern="\(\d{2}\) \d{4,5}-\d{4}"
                      title="Informe o WhatsApp com DDD, por exemplo (49) 99999-9999"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(event) => setPhone(maskPhone(event.target.value))}
                      placeholder="(49) 99999-9999"
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <Field id="promo-company" label="Empresa">
                    <input
                      id="promo-company"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      placeholder="Nome da empresa"
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <Field id="promo-city" label="Cidade">
                    <input
                      id="promo-city"
                      type="text"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="Ex.: Chapecó"
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>

                <fieldset>
                  <legend className={LABEL_CLASS}>Modelo de interesse</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {MODELS.map((option) => {
                      const checked = model === option.id;
                      return (
                        <label
                          key={option.id}
                          className={`relative cursor-pointer rounded-2xl border px-4 py-3.5 transition-colors focus-within:ring-2 focus-within:ring-red-500/50 ${
                            checked
                              ? "border-red-500/70 bg-red-500/[0.08]"
                              : "border-white/10 hover:border-white/25"
                          }`}
                        >
                          <input
                            type="radio"
                            name="promo-model"
                            value={option.id}
                            checked={checked}
                            onChange={() => setModel(option.id)}
                            className="sr-only"
                          />
                          <span className="block pr-5 text-sm font-semibold text-white">
                            {option.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-neutral-500">{option.detail}</span>
                          {checked && (
                            <CircleCheckBig
                              className="absolute right-3 top-3 h-4 w-4 text-red-500"
                              aria-hidden="true"
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-8 sm:grid-cols-2">
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
                </div>

                <Field id="promo-notes" label="Mensagem" hint="opcional">
                  <textarea
                    id="promo-notes"
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Conte sobre a operação: largura de corredor, altura, turnos de trabalho…"
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </Field>

                <div className="flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-500 sm:max-w-sm">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
                    A solicitação vai por e-mail para a equipe comercial e abre o WhatsApp com a
                    mensagem pronta.
                  </p>
                  <button
                    type="submit"
                    className={`${BTN_PRIMARY} shrink-0 cursor-pointer px-8 py-4 text-base`}
                  >
                    <Send className="h-5 w-5" aria-hidden="true" />
                    Enviar solicitação
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ContactPanel() {
  return (
    // No mobile vem depois do formulário; no desktop fica à esquerda
    <div className="relative order-last overflow-hidden border-t border-white/10 bg-ink p-8 sm:p-10 lg:order-first lg:col-span-4 lg:border-r lg:border-t-0">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-600/15 blur-3xl"
      />
      <div className="relative flex h-full flex-col">
        <h3 className="text-2xl font-semibold tracking-tight text-white">Fale com a Venda Forte</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          Atendimento comercial direto, com faturamento para CNPJ e nota fiscal.
        </p>

        <ul className="mt-10 space-y-7">
          {/* Os textos dos links diferem dos do rodapé, que lista os mesmos contatos */}
          <ContactItem icon={Phone} title="Telefones">
            <span className="block">
              Matriz em Chapecó:{" "}
              <a href="tel:+554933239050" className="transition-colors hover:text-white">
                {CONTATO.chapeco}
              </a>
            </span>
            <span className="block">
              Joinville:{" "}
              <a href="tel:+554738423333" className="transition-colors hover:text-white">
                {CONTATO.joinville}
              </a>
            </span>
          </ContactItem>
          <ContactItem icon={MessageCircle} title="WhatsApp">
            <span className="block">{WHATSAPP_DISPLAY}</span>
            <a
              href={`https://wa.me/${WHATSAPP_CENTRAL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline-offset-4 transition-colors hover:underline"
            >
              Iniciar conversa
            </a>
          </ContactItem>
          <ContactItem icon={Mail} title="E-mail">
            <span className="block break-all">{CONTATO.email}</span>
            <a
              href={`mailto:${CONTATO.email}`}
              className="font-medium text-white underline-offset-4 transition-colors hover:underline"
            >
              Enviar e-mail
            </a>
          </ContactItem>
          <ContactItem icon={MapPin} title="Cobertura">
            Todo o Sul do Brasil
            <span className="block text-neutral-500">{PONTOS_ATENDIMENTO.join(" · ")}</span>
          </ContactItem>
          <ContactItem icon={Clock} title="Horário">
            {HORARIO_ATENDIMENTO.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </ContactItem>
        </ul>

        <div className="mt-10 lg:mt-auto lg:pt-10">
          <p className="flex items-center gap-2.5 border-t border-white/10 pt-6 text-sm font-medium text-neutral-300">
            <CircleCheckBig className="h-4 w-4 text-green-500" aria-hidden="true" />
            Resposta garantida em até 24h
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-500">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 text-sm leading-relaxed text-neutral-400">
        <p className="font-semibold text-white">{title}</p>
        {children}
      </div>
    </li>
  );
}

function Field({
  id,
  label,
  required = false,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && <span className="font-normal text-neutral-600"> ({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ${
        active
          ? "border-white bg-white text-ink"
          : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function SentState({
  name,
  url,
  emailStatus,
  onBack,
}: {
  name: string;
  url: string;
  emailStatus: SendStatus;
  onBack: () => void;
}) {
  const firstName = name.trim().split(/\s+/)[0];
  const emailText = {
    sending: "Enviando para a equipe comercial…",
    sent: "Recebido pela equipe comercial.",
    failed: "Não foi possível enviar agora. O WhatsApp já garante o seu atendimento.",
  }[emailStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="flex min-h-[420px] flex-col justify-center"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-green-500/10">
        <CircleCheckBig className="h-7 w-7 text-green-500" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-3xl font-bold tracking-[-0.03em] text-white">
        Solicitação enviada{firstName ? `, ${firstName}` : ""}
      </h3>
      <p className="mt-3 max-w-md leading-relaxed text-neutral-400">
        Nossa equipe responde em até 24h com a proposta formal.
      </p>

      <ul aria-live="polite" className="mt-8 max-w-xl divide-y divide-white/10 rounded-2xl border border-white/10">
        <StatusRow status="sent" title="WhatsApp" text="A conversa abriu com a sua solicitação pronta.">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-semibold text-white underline underline-offset-4"
          >
            Abrir de novo
          </a>
        </StatusRow>
        <StatusRow status={emailStatus} title="E-mail" text={emailText} />
      </ul>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 cursor-pointer self-start text-sm font-semibold text-neutral-400 underline underline-offset-4 transition-colors hover:text-white"
      >
        Editar os dados e enviar de novo
      </button>
    </motion.div>
  );
}

function StatusRow({
  status,
  title,
  text,
  children,
}: {
  status: SendStatus;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  const { icon: Icon, className } = {
    sending: { icon: LoaderCircle, className: "animate-spin text-neutral-400" },
    sent: { icon: CircleCheckBig, className: "text-green-500" },
    failed: { icon: CircleAlert, className: "text-amber-400" },
  }[status];

  return (
    <li className="flex items-start gap-4 p-5">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-sm text-neutral-400">{text}</p>
      </div>
      {children}
    </li>
  );
}
