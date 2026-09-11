"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { MessageCircle, Phone, ShieldCheck, Timer } from "lucide-react";
import { hasMedia } from "./PromoMediaSlot";
import { MEDIA, SALES_TEAM, whatsappUrl, type SalesConsultant } from "./promo.config";

/**
 * Seção 11 — Time comercial.
 * Especificação: docs/promo/11-time-comercial.md
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

/* Classes completas por acento. O Tailwind não resolve nome montado em runtime. */
const ACCENT: Record<SalesConsultant["accent"], { ring: string; text: string; glow: string }> = {
  red: {
    ring: "border-red-500/25 bg-red-500/10",
    text: "text-red-400",
    glow: "group-hover:border-red-500/40",
  },
  orange: {
    ring: "border-orange-500/25 bg-orange-500/10",
    text: "text-orange-400",
    glow: "group-hover:border-orange-500/40",
  },
  emerald: {
    ring: "border-emerald-500/25 bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "group-hover:border-emerald-500/40",
  },
};

function ConsultantCard({ consultant }: { consultant: SalesConsultant }) {
  const accent = ACCENT[consultant.accent];
  const portrait = MEDIA[consultant.mediaKey];
  const url = whatsappUrl(
    `Olá, ${consultant.name}! Vim pela campanha promocional da EP Equipment e gostaria de atendimento sobre as máquinas em oferta.`,
    consultant.whatsappNumber
  );

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 backdrop-blur-xl transition-colors ${accent.glow}`}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-500/20 opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          {/* Retrato real quando existir, iniciais enquanto não houver */}
          {hasMedia(consultant.mediaKey) && portrait.src ? (
            <span className="relative h-14 w-14 overflow-hidden rounded-2xl">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
          ) : (
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-black ${accent.ring} ${accent.text}`}
              title={`Slot de retrato: ${portrait.file}`}
            >
              {consultant.initials}
            </span>
          )}

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Online agora
          </span>
        </div>

        <h3 className="text-xl font-bold text-white">{consultant.name}</h3>
        <p className={`mt-1 text-sm font-semibold ${accent.text}`}>{consultant.role}</p>
        <p className="mt-2 text-xs text-neutral-400">{consultant.region}</p>

        <div className="mt-5 space-y-2 border-t border-white/[0.08] pt-5 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {consultant.specialty}
          </div>
          <a
            href={`tel:+${consultant.whatsappNumber}`}
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone className="h-3.5 w-3.5 text-neutral-500" />
            {consultant.phoneDisplay}
          </a>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98]"
      >
        <MessageCircle className="h-4 w-4" />
        Conversar no WhatsApp
      </a>
    </motion.div>
  );
}

export default function PromoSalesTeam() {
  return (
    <section
      id="vendedores"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-28 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-orange-500/[0.08] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Canal direto com especialistas
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Fale direto com quem entende de empilhadeira
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Escolha o consultor da sua necessidade e receba uma proposta técnica no mesmo dia
            útil.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {SALES_TEAM.map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-neutral-300 backdrop-blur-xl sm:flex-row sm:text-left"
        >
          <Timer className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>
            Atendimento B2B com catálogo técnico e cotação formal em PDF enviados no mesmo dia
            útil.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
