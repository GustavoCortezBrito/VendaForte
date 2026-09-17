"use client";

import Image from "next/image";
import { useCallback, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { MotionConfig, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import {
  DS3_SHOTS,
  whatsappUrl,
  type DS3ShotKey,
  type ProductSpec,
  type PromoProduct,
  type PromoVideo,
} from "./promo.config";

/** Curva de saída longa: o movimento chega devagar, sem freada seca. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Respeita `prefers-reduced-motion` em todas as animações da campanha. */
export function PromoMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** `false` no servidor e na primeira renderização, para não divergir na hidratação. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Nunca muda: `useMounted` só precisa da diferença entre servidor e cliente. */
const noSubscription = () => () => {};

/** `true` a partir da montagem. Serve para ligar o que depende do navegador. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  );
}

/** `true` quando o navegador está em modo de economia de dados. */
export function savesData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/* -------------------------------------------------------------------------- */
/* Texto                                                                      */
/* -------------------------------------------------------------------------- */

export const TITLE =
  "text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold text-red-500">{children}</p>;
}

/* -------------------------------------------------------------------------- */
/* Botões                                                                     */
/* -------------------------------------------------------------------------- */

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export const BTN_PRIMARY = `${BTN} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-500`;
export const BTN_GHOST = `${BTN} border border-white/15 text-white hover:bg-white/10 focus-visible:outline-white`;

/** Verde é exclusivo do WhatsApp, como no site principal. */
export function WhatsAppLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BTN} bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-500 ${className}`}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* Entrada ao rolar                                                           */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Cada letra ganha a sua fatia do intervalo: entram uma a uma, conforme o scroll. */
export function ScrollLetters({
  text,
  progress,
  range: [start, end],
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const chars = [...text];
  const step = (end - start) / chars.length;
  return (
    <span className="inline-block">
      <span className="sr-only">{text}</span>
      {chars.map((char, index) => (
        <ScrollLetter
          key={index}
          char={char}
          progress={progress}
          from={start + step * index}
          to={start + step * (index + 1.6)}
        />
      ))}
    </span>
  );
}

function ScrollLetter({
  char,
  progress,
  from,
  to,
}: {
  char: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], ["0.45em", "0em"]);
  return (
    <motion.span aria-hidden="true" style={{ opacity, y }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/* Fotos da DS3                                                               */
/* -------------------------------------------------------------------------- */

// Dissolve as bordas do estúdio no fundo da página, que tem a mesma cor.
const FEATHER =
  "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 3%, #000 90%, transparent)";

export const FEATHER_STYLE: CSSProperties = {
  maskImage: FEATHER,
  WebkitMaskImage: FEATHER,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

/** Fontes de um vídeo da campanha: AV1 primeiro, H.264 para quem não decodifica AV1. */
export function VideoSources({ video }: { video: PromoVideo }) {
  return (
    <>
      {video.av1 && <source src={video.av1} type='video/mp4; codecs="av01.0.08M.08"' />}
      <source src={video.h264} type="video/mp4" />
    </>
  );
}

/** Quadro do giro em fundo `ink`, com deslocamento opcional ao rolar. */
export function Shot({
  shot,
  className = "",
  sizes = "(max-width: 1024px) 90vw, 45vw",
  parallax = 0,
}: {
  shot: DS3ShotKey;
  className?: string;
  sizes?: string;
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);
  const { src, alt } = DS3_SHOTS[shot];

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={FEATHER_STYLE}>
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ficha técnica e preço                                                      */
/* -------------------------------------------------------------------------- */

export function SpecTable({ specs, caption }: { specs: ProductSpec[]; caption: string }) {
  return (
    <table className="w-full border-y border-white/10 text-left">
      <caption className="sr-only">{caption}</caption>
      <tbody className="divide-y divide-white/10">
        {specs.map((row) => (
          <tr key={row.label}>
            <th scope="row" className="py-4 pr-6 font-normal text-neutral-400">
              {row.label}
            </th>
            <td className="py-4 text-right text-lg font-semibold tracking-tight text-white">
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PriceCard({ product, className = "" }: { product: PromoProduct; className?: string }) {
  const setup = product.priceNote ? ` (${product.priceNote})` : "";
  const quoteUrl = whatsappUrl(
    `Olá! Quero cotar a ${product.name} de ${product.capacity}${setup} da campanha promocional.`
  );

  return (
    <div className={`rounded-[28px] border border-white/10 bg-ink-raised p-8 ${className}`}>
      {product.price ? (
        <>
          {product.listPrice ? (
            <p className="text-sm text-neutral-400">
              De{" "}
              <s className="text-base font-semibold text-neutral-500 decoration-red-500 decoration-2">
                {product.listPrice}
              </s>{" "}
              por
            </p>
          ) : (
            <p className="text-sm text-neutral-400">A partir de</p>
          )}
          <p className="mt-1 text-5xl font-bold tracking-[-0.045em] text-white">{product.price}</p>
          {product.priceNote && (
            <p className="mt-2 text-sm font-medium text-neutral-300">{product.priceNote}</p>
          )}
        </>
      ) : (
        <p className="text-3xl font-bold tracking-[-0.03em] text-white">Condição especial de lote</p>
      )}
      <p className="mt-2 text-sm text-neutral-500">{product.installment}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <WhatsAppLink href={quoteUrl}>Cotar a {product.shortName}</WhatsAppLink>
        <a href="#cotacao" className={BTN_GHOST}>
          Proposta formal da {product.shortName}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
