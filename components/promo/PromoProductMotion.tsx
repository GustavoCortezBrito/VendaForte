"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ScrollSequence from "./ScrollSequence";
import {
  COMPACT_QUERY,
  PRODUCT_MOTION,
  PRODUCTS,
  STAGE_MIN_HEIGHT,
  type MotionProductId,
} from "./promo.config";
import {
  FEATHER_STYLE,
  savesData,
  ScrollLetters,
  useMediaQuery,
  useMounted,
  VideoSources,
} from "./ui";

/**
 * Animação de apresentação de um produto, controlada pelo scroll.
 *
 * Palco fixo no celular e no desktop: o movimento avança quadro a quadro e, no
 * fim, a categoria e o nome entram letra a letra — no canto superior esquerdo
 * no desktop, no rodapé da tela no celular. Com movimento reduzido ou economia
 * de dados, o vídeo toca uma vez quando entra na tela.
 */

// Segura o primeiro quadro no começo e o último no fim do palco.
const TIMELINE_PROGRESS = [0, 0.06, 0.86, 1];

export default function PromoProductMotion({ productId }: { productId: MotionProductId }) {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();
  const tallEnough = useMediaQuery(STAGE_MIN_HEIGHT);

  // Só depois da montagem: no servidor sai o vídeo, que também é a saída de
  // quem pediu movimento reduzido, economiza dados ou está em tela muito baixa.
  const stageEnabled = mounted && tallEnough && !prefersReducedMotion && !savesData();

  // Cada variante tem o próprio ref e o próprio useScroll, para o scroll nunca
  // ficar medindo a seção desmontada na troca de variante.
  return stageEnabled ? <Stage productId={productId} /> : <PlayOnce productId={productId} />;
}

function Stage({ productId }: { productId: MotionProductId }) {
  const product = PRODUCTS[productId];
  const { sequence, label, line } = PRODUCT_MOTION[productId];
  const lastFrame = sequence.frames - 1;

  const wrapperRef = useRef<HTMLElement>(null);
  const compact = useMediaQuery(COMPACT_QUERY);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Derivar por função tira o valor da aceleração nativa do Motion (ViewTimeline),
  // que num palco fixo calcula outro intervalo: letras e canvas seguem o mesmo progresso.
  const progress = useTransform(scrollYProgress, (value) => value);
  const frame = useTransform(progress, TIMELINE_PROGRESS, [0, 0, lastFrame, lastFrame]);
  const lineOpacity = useTransform(progress, [0.74, 0.86], [0, 1]);
  const lineY = useTransform(progress, [0.74, 0.86], [12, 0]);

  // No celular a máquina sobe e encolhe quando o nome entra, para não se cruzarem
  const machineY = useTransform(progress, [0.34, 0.62], ["0%", compact ? "-11%" : "0%"]);
  const machineScale = useTransform(progress, [0.34, 0.62], [1, compact ? 0.86 : 1]);
  // O véu do celular entra junto com o texto, e não antes dele
  const scrimOpacity = useTransform(progress, [0.4, 0.6], [0, 1]);

  return (
    // `svh` no celular: a altura não muda quando a barra do navegador some
    <section
      ref={wrapperRef}
      className="relative h-[260svh] border-t border-white/[0.06] bg-ink lg:h-[300vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          // Ao encolher no celular, a borda do quadro entraria na tela: a máscara
          // dissolve o piso do estúdio no fundo da página.
          style={{ y: machineY, scale: machineScale, ...(compact ? FEATHER_STYLE : null) }}
          className="absolute inset-x-0 bottom-0 top-16 lg:top-20"
        >
          <ScrollSequence sequence={sequence} frame={frame} className="h-full w-full" label={label} />
        </motion.div>

        <motion.span
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink via-ink/90 to-transparent lg:hidden"
        />

        {/* Celular: rodapé da tela, sobre o véu. Desktop: canto superior esquerdo. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-28 lg:inset-x-auto lg:bottom-auto lg:left-[6vw] lg:top-[16vh] lg:px-0 lg:pb-0 xl:left-[7vw]">
          <p className="text-base font-semibold text-red-500 lg:text-lg">
            <ScrollLetters text={product.category} progress={progress} range={[0.46, 0.6]} />
          </p>
          <p className="mt-2 whitespace-nowrap text-[clamp(2.25rem,11vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white lg:text-[clamp(3rem,6vw,7rem)]">
            <ScrollLetters text={`EP ${product.shortName}`} progress={progress} range={[0.56, 0.8]} />
          </p>
          <motion.p
            style={{ opacity: lineOpacity, y: lineY }}
            className="mt-3 text-[13px] text-neutral-400 lg:mt-4 lg:text-lg"
          >
            {line}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/** Mobile: toca o vídeo uma única vez quando ele entra na tela e para no último quadro. */
function PlayOnce({ productId }: { productId: MotionProductId }) {
  const product = PRODUCTS[productId];
  const { sequence, video, label, line } = PRODUCT_MOTION[productId];
  const lastFrame = sequence.frames - 1;

  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView || prefersReducedMotion) return;
    element.muted = true;
    element.play().catch(() => {});
  }, [inView, prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-ink pb-4 pt-20">
      <video
        ref={ref}
        poster={sequence.webp(prefersReducedMotion ? lastFrame : 0)}
        muted
        playsInline
        preload="metadata"
        aria-label={label}
        className="aspect-video w-full object-cover"
        style={FEATHER_STYLE}
      >
        <VideoSources video={video} />
      </video>
      <div className="-mt-4 px-6 text-center">
        <p className="text-sm font-semibold text-red-500">{product.category}</p>
        <p className="mt-2 text-5xl font-bold tracking-[-0.045em] text-white">EP {product.shortName}</p>
        <p className="mt-3 text-neutral-400">{line}</p>
      </div>
    </section>
  );
}
