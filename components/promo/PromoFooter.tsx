import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { CONTATO, WHATSAPP_CENTRAL, WHATSAPP_DISPLAY } from "./promo.config";

/**
 * Seção 14 — Rodapé e notas.
 * Sustenta juridicamente as afirmações comerciais da página.
 * Especificação: docs/promo/14-rodape.md
 */

const NOTAS = [
  "Condições válidas para o lote da campanha, enquanto durar o estoque.",
  "Preços sujeitos a alteração sem aviso prévio e não incluem frete nem impostos quando aplicável.",
  "Financiamento BNDES e Finame sujeito a análise de crédito da instituição financeira.",
  "Garantia de 5 anos aplicável à bateria conforme os termos da EP Equipment. Verifique a cobertura por componente.",
  "Imagens meramente ilustrativas. O equipamento entregue segue a configuração da proposta comercial.",
] as const;

export default function PromoFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#05070B] pb-24 pt-12 md:pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Faixa 1: assinatura e contatos */}
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="relative h-9 w-32">
              <Image
                src="/logo.png"
                alt="Grupo Venda Forte"
                fill
                sizes="128px"
                className="object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-xs text-neutral-600 sm:border-l sm:border-white/10 sm:pl-3">
              Representante oficial EP Equipment
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 text-xs text-neutral-400 sm:flex-row sm:gap-5">
            <a
              href={`https://wa.me/${WHATSAPP_CENTRAL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-emerald-400"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
              {WHATSAPP_DISPLAY}
            </a>
            <a href="tel:+554933239050" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-neutral-500" />
              Chapecó {CONTATO.chapeco}
            </a>
            <a href="tel:+554738423333" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-neutral-500" />
              Joinville {CONTATO.joinville}
            </a>
            <a
              href={`mailto:${CONTATO.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="h-3.5 w-3.5 text-neutral-500" />
              {CONTATO.email}
            </a>
          </div>
        </div>

        {/* Faixa 2: notas obrigatórias */}
        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Faturamento direto com nota fiscal
          </div>
          <ul className="grid gap-2 text-[11px] leading-relaxed text-neutral-500 md:grid-cols-2">
            {NOTAS.map((nota) => (
              <li key={nota}>{nota}</li>
            ))}
          </ul>
        </div>

        {/* Faixa 3: direitos e links */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-6 text-xs text-neutral-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Grupo Venda Forte. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/termos" className="transition-colors hover:text-neutral-400">
              Termos
            </Link>
            <Link href="/privacidade" className="transition-colors hover:text-neutral-400">
              Privacidade
            </Link>
            <Link href="/" className="transition-colors hover:text-red-400">
              Site principal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
