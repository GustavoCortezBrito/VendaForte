"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ScrollSequence from "./ScrollSequence";
import { PRODUCT_MOTION, PRODUCTS, type MotionProductId } from "./promo.config";
import { FEATHER_STYLE, ScrollLetters, VideoSources } from "./ui";

/**
 * Animação de apresentação de um produto, controlada pelo scroll.
 *
 * Desktop: palco fixo de 300vh; o vídeo avança quadro a quadro e, no fim do
 * movimento, a categoria e o nome entram letra a letra. Mobile, movimento
 * reduzido ou economia de dados: o vídeo toca uma vez quando entra na tela.
 */

// Segura o primeiro quadro no começo e o último no fim do palco.
const TIMELINE_PROGRESS = [0, 0.06, 0.86, 1];

export default function PromoProductMotion({ productId }: { productId: MotionProductId }) {
  const prefersReducedMotion = useReducedMotion();
  const [stageEnabled, setStageEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    const update = () =>
      setStageEnabled(!prefersReducedMotion && query.matches && !connection?.saveData);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  // Cada variante tem o próprio ref e o próprio useScroll, para o scroll nunca
  // ficar medindo a seção desmontada na troca de variante.
  return stageEnabled ? <Stage productId={productId} /> : <PlayOnce productId={productId} />;
}

function Stage({ productId }: { productId: MotionProductId }) {
  const product = PRODUCTS[productId];
  const { sequence, label, line } = PRODUCT_MOTION[productId];
  const lastFrame = sequence.frames - 1;

  const wrapperRef = useRef<HTMLElement>(null);
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

  return (
    <section ref={wrapperRef} className="relative h-[300vh] border-t border-white/[0.06] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-20">
          <ScrollSequence sequence={sequence} frame={frame} className="h-full w-full" label={label} />
        </div>

        <div className="pointer-events-none absolute left-[6vw] top-[16vh] z-10 xl:left-[7vw]">
          <p className="text-lg font-semibold text-red-500">
            <ScrollLetters text={product.category} progress={progress} range={[0.46, 0.6]} />
          </p>
          <p className="mt-2 whitespace-nowrap text-[clamp(3rem,6vw,7rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white">
            <ScrollLetters text={`EP ${product.shortName}`} progress={progress} range={[0.56, 0.8]} />
          </p>
          <motion.p style={{ opacity: lineOpacity, y: lineY }} className="mt-4 text-lg text-neutral-400">
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
