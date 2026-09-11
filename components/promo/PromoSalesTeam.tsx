"use client";

import Image from "next/image";
import { Phone, ShieldCheck, Timer } from "lucide-react";
import { hasMedia } from "./PromoMediaSlot";
import { MEDIA, SALES_TEAM, whatsappUrl, type SalesConsultant } from "./promo.config";
import { Eyebrow, Reveal, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 11 — Time comercial.
 * Especificação: docs/promo/11-time-comercial.md
 */

function ConsultantCard({ consultant, index }: { consultant: SalesConsultant; index: number }) {
  const portrait = MEDIA[consultant.mediaKey];
  const url = whatsappUrl(
    `Olá, ${consultant.name}! Vim pela campanha promocional da EP Equipment e gostaria de atendimento sobre as máquinas em oferta.`,
    consultant.whatsappNumber
  );

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article className="flex h-full flex-col rounded-[28px] border border-white/10 bg-ink-raised p-8">
        {/* Retrato real quando existir, iniciais enquanto não houver */}
        {hasMedia(consultant.mediaKey) && portrait.src ? (
          <span className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image src={portrait.src} alt={portrait.alt} fill sizes="64px" className="object-cover" />
          </span>
        ) : (
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/15 text-base font-bold text-red-400"
            title={`Slot de retrato: ${portrait.file}`}
          >
            {consultant.initials}
          </span>
        )}

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{consultant.name}</h3>
        <p className="mt-1 text-sm font-medium text-red-400">{consultant.role}</p>
        <p className="mt-2 text-sm text-neutral-500">{consultant.region}</p>

        <div className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-sm text-neutral-400">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-neutral-500" aria-hidden="true" />
            {consultant.specialty}
          </p>
          <a
            href={`tel:+${consultant.whatsappNumber}`}
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4 text-neutral-500" aria-hidden="true" />
            {consultant.phoneDisplay}
          </a>
        </div>

        <div className="mt-auto pt-8">
          <WhatsAppLink href={url} className="w-full">
            Conversar no WhatsApp
          </WhatsAppLink>
        </div>
      </article>
    </Reveal>
  );
}

export default function PromoSalesTeam() {
  return (
    <section id="vendedores" className="scroll-mt-24 bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Canal direto com especialistas</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>Fale direto com quem entende de empilhadeira</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400">
            Escolha o consultor da sua necessidade e receba uma proposta técnica no mesmo dia útil.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {SALES_TEAM.map((consultant, index) => (
            <ConsultantCard key={consultant.id} consultant={consultant} index={index} />
          ))}
        </div>

        <Reveal className="mt-8 flex items-start gap-3 text-sm text-neutral-400 sm:items-center">
          <Timer className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
          Atendimento B2B com catálogo técnico e cotação formal em PDF enviados no mesmo dia útil.
        </Reveal>
      </div>
    </section>
  );
}
