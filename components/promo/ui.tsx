"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { DS3_SHOTS, DS3_STUDIO, type DS3ShotKey } from "./promo.config";

/** Curva de saída longa: o movimento chega devagar, sem freada seca. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Respeita `prefers-reduced-motion` em todas as animações da campanha. */
export function PromoMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* -------------------------------------------------------------------------- */
/* Texto                                                                      */
/* -------------------------------------------------------------------------- */

export const TITLE =
  "text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl";

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`text-sm font-semibold ${tone === "dark" ? "text-red-500" : "text-red-600"}`}>
      {children}
    </p>
  );
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

/** Foto de estúdio em fundo branco, para as seções claras. */
export function StudioPhoto({
  photo,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 40vw",
}: {
  photo: keyof typeof DS3_STUDIO;
  className?: string;
  sizes?: string;
}) {
  const { src, alt } = DS3_STUDIO[photo];
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
