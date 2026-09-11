"use client";

import { BadgeCheck, Banknote, FileText, MapPin, Package, Truck, Wrench } from "lucide-react";
import { PONTOS_ATENDIMENTO, whatsappUrl } from "./promo.config";
import { Eyebrow, Reveal, StudioPhoto, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 08 — Por que fechar com o Grupo Venda Forte. Seção clara.
 * Especificação: docs/promo/08-por-que-venda-forte.md
 */

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Representante oficial EP",
    desc: "Garantia de fábrica, não de importação paralela.",
  },
  {
    icon: FileText,
    title: "Faturamento direto para CNPJ",
    desc: "Nota fiscal, crédito de impostos e contrato formal.",
  },
  {
    icon: Banknote,
    title: "BNDES, Finame e leasing",
    desc: "Até 60 vezes, com apoio do nosso consultor na documentação.",
  },
  {
    icon: Truck,
    title: "Pronta entrega com seguro",
    desc: "Despacho por transportadora especializada em maquinário.",
  },
  {
    icon: Package,
    title: "Peças multimarcas em estoque",
    desc: "Reposição sem espera de importação.",
  },
  {
    icon: Wrench,
    title: "Assistência técnica própria",
    desc: "Equipe especializada, preventiva e corretiva.",
  },
] as const;

export default function PromoWhyUs() {
  return (
    <section id="por-que-nos" className="scroll-mt-24 bg-paper py-24 text-ink lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="light">O fornecedor</Eyebrow>
          <h2 className={`mt-4 ${TITLE}`}>Por que fechar com o Grupo Venda Forte</h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-stone-600">
            Importação, distribuição, peças e assistência técnica na mesma empresa. Matriz em
            Chapecó e seis pontos de atendimento no Sul do Brasil.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <li key={reason.title}>
              <Reveal delay={(index % 3) * 0.06} className="h-full rounded-[28px] bg-paper-card p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                  <reason.icon className="h-5 w-5 text-red-600" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{reason.desc}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Demonstração na operação do cliente */}
        <Reveal className="mt-4 grid overflow-hidden rounded-[28px] bg-paper-card lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 lg:p-14">
            <h3 className="text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
              Demonstração na sua operação
            </h3>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-stone-600">
              Validamos corredor, altura e ciclo antes de você fechar o pedido.
            </p>
            <WhatsAppLink
              href={whatsappUrl("Olá! Quero agendar uma demonstração da EP DS3 na minha operação.")}
              className="mt-8 self-start"
            >
              Agendar demonstração
            </WhatsAppLink>
          </div>
          <StudioPhoto
            photo="frente"
            className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[440px]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        <Reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <p className="flex shrink-0 items-center gap-2 text-sm font-semibold text-stone-500">
            <MapPin className="h-4 w-4 text-red-600" aria-hidden="true" />
            Pontos de atendimento
          </p>
          <ul className="flex flex-wrap gap-2">
            {PONTOS_ATENDIMENTO.map((cidade) => (
              <li
                key={cidade}
                className="rounded-full border border-ink/10 bg-paper-card px-4 py-1.5 text-sm font-medium"
              >
                {cidade}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
