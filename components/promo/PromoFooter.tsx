import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUp, ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  CONTATO,
  HERO_ID,
  MAIN_SITE_URL,
  PONTOS_ATENDIMENTO,
  PROMO_NAV,
  WHATSAPP_CENTRAL,
  WHATSAPP_DISPLAY,
  WHATSAPP_GENERAL_MESSAGE,
  whatsappUrl,
} from "./promo.config";
import { WhatsAppLink } from "./ui";

/**
 * Seção 14 — Rodapé: chamada final, links da campanha, contatos, redes e
 * pontos de atendimento.
 *
 * Especificação: docs/promo/14-rodape.md
 */

const FOOTER_NAV = [...PROMO_NAV, { href: "#faq", label: "Perguntas frequentes" }];

const LINK_CLASS = "transition-colors hover:text-white";

/** Mesmos perfis e ícones do rodapé do site principal. */
const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vendaforte/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@grupovendaforte7665",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/grupo-venda-forte/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/grupovendaforte",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
] as const;

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
    <footer className="border-t border-white/[0.06] bg-ink pb-28 md:pb-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ---------------- Chamada final ---------------- */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div>
            <p className="text-sm font-semibold text-red-500">Campanha EP Equipment</p>
            <p className="mt-3 max-w-xl text-balance text-3xl font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-4xl">
              Pronta entrega no Sul do Brasil, com faturamento direto.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink href={whatsappUrl(WHATSAPP_GENERAL_MESSAGE)}>Falar no WhatsApp</WhatsAppLink>
            <a
              href="#cotacao"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Pedir cotação
            </a>
          </div>
        </div>

        {/* ---------------- Colunas ---------------- */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/promo" className="inline-flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-xl">
                <Image src="/logo.png" alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="leading-none">
                <span className="block text-lg font-semibold tracking-tight text-white">Venda Forte</span>
                <span className="mt-1 block text-xs font-medium text-neutral-500">Grupo · Dealer EP Equipment</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-neutral-400">
              Representante oficial EP Equipment. Importação, distribuição, peças e assistência
              técnica no Sul do Brasil, com faturamento direto e nota fiscal.
            </p>

            <ul className="mt-6 flex gap-2">
              {SOCIAL.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Grupo Venda Forte no ${social.label}`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-red-400"
            >
              grupovendaforte.com
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
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

        {/* ---------------- Linha final ---------------- */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Dealer oficial EP Equipment no Sul do Brasil</p>
          <a
            href={`#${HERO_ID}`}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap font-medium ${LINK_CLASS}`}
          >
            Voltar ao topo
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
