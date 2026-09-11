"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Zap } from "lucide-react";
import PromoMediaSlot, { hasMedia } from "./PromoMediaSlot";
import { WHATSAPP_GENERAL_MESSAGE, whatsappUrl } from "./promo.config";

/**
 * Seção 01 — Hero, fase A da sequência de produto.
 *
 * `variant="stage"` renderiza apenas a coluna de texto, para o palco fixo montar.
 * `variant="section"` renderiza a seção inteira, com fundo e produto próprios.
 *
 * Especificação: docs/promo/01-hero.md
 */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const METRICS = [
  { value: 1500, suffix: " kg", label: "Capacidade da DS3" },
  { value: 5, suffix: " anos", label: "Garantia da bateria de lítio" },
  { value: 60, suffix: "x", label: "Financiamento BNDES e Finame" },
] as const;

const TRUST = [
  { icon: Truck, label: "Pronta entrega" },
  { icon: ShieldCheck, label: "Garantia de fábrica EP" },
  { icon: Zap, label: "Lítio sem manutenção" },
] as const;

/* -------------------------------------------------------------------------- */
/* Contador                                                                   */
/* -------------------------------------------------------------------------- */

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();
  const format = (input: number) => Math.round(input).toLocaleString("pt-BR");

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || prefersReducedMotion) return;

    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString("pt-BR");
      },
    });

    return () => controls.stop();
  }, [inView, value, prefersReducedMotion]);

  return <span ref={ref}>{format(value)}</span>;
}

/* -------------------------------------------------------------------------- */
/* Copy                                                                       */
/* -------------------------------------------------------------------------- */

function HeroCopy() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp}>
        <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
            Representante oficial EP Equipment
          </span>
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-5xl font-black leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]"
      >
        Empilhadeira elétrica de{" "}
        <span className="bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
          lítio
        </span>
        , 1.500 kg, com pronta entrega.
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
      >
        Empilhadeiras e paleteiras elétricas EP com bateria de lítio, garantia de fábrica de
        até 5 anos e faturamento direto para CNPJ via BNDES e Finame. Estoque pronto para
        despacho.
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row">
        <a
          href="#ofertas"
          className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-8 py-4 font-bold text-white shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.02] hover:shadow-red-500/40 active:scale-[0.98]"
        >
          Ver modelos em oferta
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href={whatsappUrl(WHATSAPP_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:border-emerald-400/40 hover:bg-white/[0.1]"
        >
          <MessageCircle className="h-5 w-5 text-emerald-400" />
          Falar com um consultor
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:gap-6"
      >
        {METRICS.map((metric) => (
          <div key={metric.label}>
            <div className="text-2xl font-black tabular-nums tracking-tight text-white sm:text-4xl">
              <CountUp value={metric.value} />
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {metric.suffix}
              </span>
            </div>
            <div className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500 sm:text-xs">
              {metric.label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.ul
        variants={fadeUp}
        className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-neutral-500"
      >
        {TRUST.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <item.icon className="h-4 w-4 text-orange-500" />
            {item.label}
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Vídeo da versão empilhada                                                  */
/* -------------------------------------------------------------------------- */

// Dissolve as quatro bordas do estúdio do vídeo no fundo da página.
const FEATHER =
  "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 78%, transparent)";

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }
    video.muted = true;
    video.play().catch(() => {});
  }, [prefersReducedMotion]);

  return (
    <video
      ref={ref}
      src="/promo/ds3-rotacao-360.mp4"
      poster="/promo/sequencia/ds3-000.webp"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label="Empilhadeira EP DS3 girando 360 graus"
      className="aspect-video w-full object-cover"
      style={{
        maskImage: FEATHER,
        WebkitMaskImage: FEATHER,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */

export default function PromoHero({ variant = "section" }: { variant?: "stage" | "section" }) {
  if (variant === "stage") return <HeroCopy />;

  return (
    <section
      id="inicio"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#05070B]"
    >
      {hasMedia("heroFundo") && (
        <PromoMediaSlot
          media="heroFundo"
          className="absolute inset-0 h-full w-full rounded-none border-0"
          imageClassName="opacity-40"
          sizes="100vw"
          preload
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <HeroCopy />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="-mx-6 lg:mx-0"
          >
            <HeroVideo />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#05070B]" />
    </section>
  );
}
