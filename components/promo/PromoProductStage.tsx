"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ScrollSequence, { SEQUENCE_FRAMES } from "./ScrollSequence";
import { HERO_ID } from "./promo.config";

/**
 * Hero da campanha: só o giro da DS3, sem texto.
 *
 * No desktop o scroll controla o vídeo quadro a quadro, num palco fixo de 300vh.
 * No mobile, com movimento reduzido ou economia de dados, o mesmo giro roda em
 * loop numa seção de uma tela. O header só aparece depois deste bloco.
 */

// Segura a frente no começo e o último quadro no fim, para o giro não começar
// nem terminar no meio de um gesto de scroll.
const TIMELINE_PROGRESS = [0, 0.04, 0.96, 1];
const TIMELINE_FRAMES = [0, 0, SEQUENCE_FRAMES - 1, SEQUENCE_FRAMES - 1];

const LABEL = "Empilhadeira elétrica EP DS3 girando 360 graus";

// O hero não tem texto visível; o título da página existe para leitor de tela e busca.
const HEADLINE = "Empilhadeira elétrica EP DS3 de lítio, 1.500 kg, com pronta entrega";

// Dissolve o piso do estúdio no fundo da página.
const FLOOR_FADE = "linear-gradient(to bottom, #000 80%, transparent)";

export default function PromoProductStage() {
  const wrapperRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [stageEnabled, setStageEnabled] = useState(false);

  // O palco fixo só liga no desktop, depois da montagem. O servidor e a primeira
  // renderização do cliente são sempre o loop, o que evita divergência de
  // hidratação e garante que o mobile nunca baixe a sequência de quadros.
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

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const frame = useTransform(scrollYProgress, TIMELINE_PROGRESS, TIMELINE_FRAMES);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0]);

  if (!stageEnabled) {
    return (
      <section
        ref={wrapperRef}
        id={HERO_ID}
        data-hero="loop"
        className="relative flex h-[100svh] min-h-[520px] items-center overflow-hidden bg-ink"
      >
        <h1 className="sr-only">{HEADLINE}</h1>
        <LoopVideo />
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <ScrollCue />
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} id={HERO_ID} data-hero="stage" className="relative h-[300vh] bg-ink">
      <h1 className="sr-only">{HEADLINE}</h1>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Começa abaixo da cápsula do header, para o mastro não passar sob o menu */}
        <div className="absolute inset-x-0 bottom-0 top-20">
          <ScrollSequence frame={frame} className="h-full w-full" label={LABEL} />
        </div>
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
        >
          <ScrollCue />
        </motion.div>
      </div>
    </section>
  );
}

function LoopVideo() {
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
      aria-label={LABEL}
      className="aspect-square w-full object-cover sm:aspect-video"
      style={{ maskImage: FLOOR_FADE, WebkitMaskImage: FLOOR_FADE }}
    />
  );
}

/** Indicação de rolagem sem texto: um trilho com um ponto descendo. */
function ScrollCue() {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-7 justify-center rounded-full border border-white/25 pt-2"
    >
      <motion.span
        className="h-2.5 w-[3px] rounded-full bg-white/70"
        animate={{ y: [0, 14, 0], opacity: [1, 0.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}
