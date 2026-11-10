"use client";

import { motion } from "framer-motion";
import { WHATSAPP_DISPLAY, WHATSAPP_GENERAL_MESSAGE, whatsappUrl } from "./promo.config";
import { EASE_OUT } from "./ui";

const WHATSAPP_HREF = whatsappUrl(WHATSAPP_GENERAL_MESSAGE);

/** Ícone oficial do WhatsApp em SVG vetorial. */
function WhatsAppSvg({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * Botão flutuante do WhatsApp fixo no canto inferior direito, disponível o
 * tempo todo (inclusive durante os palcos de scroll). É um link `<a>` direto
 * para `wa.me`, então `AnalyticsEvents` dispara `click_whatsapp` no 1º clique.
 */
export default function PromoWhatsAppFloat() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
      className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar com um consultor no WhatsApp ${WHATSAPP_DISPLAY}`}
        className="group relative flex items-center gap-3 rounded-full bg-green-600 p-4 text-white shadow-[0_14px_34px_-6px_rgba(22,163,74,0.65)] ring-1 ring-white/15 transition-all duration-300 hover:scale-105 hover:bg-green-500 hover:shadow-[0_18px_42px_-6px_rgba(34,197,94,0.8)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400 sm:py-3.5 sm:pl-5 sm:pr-5"
      >
        {/* Anel pulsante discreto para chamar atenção sem poluir a tela */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-green-500/35 motion-safe:animate-ping [animation-duration:2.8s]"
        />

        {/* Ponto indicador de atendimento online */}
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink ring-2 ring-ink"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>

        <WhatsAppSvg className="relative h-7 w-7 shrink-0 sm:h-6 sm:w-6" />

        <span className="relative hidden text-sm font-semibold tracking-tight sm:inline">
          Cotar no WhatsApp
        </span>
      </a>
    </motion.div>
  );
}

