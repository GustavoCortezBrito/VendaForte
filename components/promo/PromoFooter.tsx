import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  CONTATO,
  PONTOS_ATENDIMENTO,
  PROMO_NAV,
  WHATSAPP_CENTRAL,
  WHATSAPP_DISPLAY,
  WHATSAPP_GENERAL_MESSAGE,
  whatsappUrl,
} from "./promo.config";

/**
 * Seção 14 — Rodapé. Fecha a página com a chamada final, os links da campanha,
 * os contatos e os pontos de atendimento.
 * Especificação: docs/promo/14-rodape.md
 */

const FOOTER_NAV = [
  ...PROMO_NAV,
  { href: "#cotacao", label: "Cotação" },
  { href: "#faq", label: "Perguntas frequentes" },
];

const LINK_CLASS = "transition-colors hover:text-white";

function Column({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-neutral-400">{children}</ul>
    </div>
  );
}

export default function PromoFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink pb-24 pt-20 md:pb-0 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Fechamento */}
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-red-500">Lote em campanha</p>
            <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
              A DS3 que você viu girando está pronta para despacho.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(WHATSAPP_GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Falar no WhatsApp
            </a>
            <a
              href="#cotacao"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Pedir proposta formal
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Colunas */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:pb-24">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/promo" className="inline-flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-full">
                <Image src="/logo.png" alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">Grupo Venda Forte</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">
              Representante oficial EP Equipment. Importação, distribuição, peças e assistência
              técnica no Sul do Brasil, com faturamento direto e nota fiscal.
            </p>
          </div>

          <Column title="Campanha" className="lg:col-span-2">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={LINK_CLASS}>
                  {item.label}
                </a>
              </li>
            ))}
          </Column>

          <Column title="Contato" className="lg:col-span-3">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_CENTRAL}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 ${LINK_CLASS}`}
              >
                <MessageCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href="tel:+554933239050" className={`flex items-center gap-2.5 ${LINK_CLASS}`}>
                <Phone className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                Chapecó {CONTATO.chapeco}
              </a>
            </li>
            <li>
              <a href="tel:+554738423333" className={`flex items-center gap-2.5 ${LINK_CLASS}`}>
                <Phone className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                Joinville {CONTATO.joinville}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTATO.email}`} className={`flex items-center gap-2.5 break-all ${LINK_CLASS}`}>
                <Mail className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                {CONTATO.email}
              </a>
            </li>
          </Column>

          <Column title="Pontos de atendimento" className="lg:col-span-3">
            <li className="grid grid-cols-2 gap-x-4 gap-y-3">
              {PONTOS_ATENDIMENTO.map((cidade) => (
                <span key={cidade} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
                  {cidade}
                </span>
              ))}
            </li>
          </Column>
        </div>
      </div>
    </footer>
  );
}
