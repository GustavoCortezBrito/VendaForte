"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import PromoHero from "./PromoHero";
import PromoCloseUp, { CLOSE_UP_POINTS } from "./PromoCloseUp";
import ScrollSequence, { SEQUENCE_FPS, SEQUENCE_FRAMES } from "./ScrollSequence";

/**
 * Palco de produto compartilhado pelas seções 01 (hero) e 02 (veja de perto).
 *
 * O vídeo de giro da DS3 é o palco inteiro. O scroll controla o tempo do vídeo:
 * fica de frente durante o hero, gira na transição e, na fase B, para em cada
 * peça no momento em que a legenda dela entra.
 *
 * Especificação: docs/promo/sequencia-scroll-produto.md
 */

/** Cor do fundo do estúdio no vídeo. O palco usa a mesma, para não haver emenda. */
const STUDIO = "#0D0D0D";

// Progresso do palco → segundo do vídeo (giro de 360° do Seedance, 6 s). Cada
// fatia da fase B cai no trecho em que a peça da legenda correspondente está à
// vista, na ordem de CLOSE_UP_POINTS.
const TIMELINE_PROGRESS = [0, 0.24, 0.42, 0.52, 0.62, 0.72, 0.82, 0.92, 1];
const TIMELINE_SECONDS = [0, 1.2, 1.55, 1.95, 2.85, 3.45, 4.9, 5.9, 6];
const TIMELINE_FRAMES = TIMELINE_SECONDS.map((seconds) =>
  Math.min(seconds * SEQUENCE_FPS, SEQUENCE_FRAMES - 1)
);

export default function PromoProductStage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [stageEnabled, setStageEnabled] = useState(false);

  // O palco fixo só liga no desktop, depois da montagem. O servidor e a primeira
  // renderização do cliente são sempre a versão empilhada, o que evita divergência
  // de hidratação e garante que o mobile nunca baixe a sequência de quadros.
  useEffect(() => {
    if (prefersReducedMotion) {
      setStageEnabled(false);
      return;
    }

    const query = window.matchMedia("(min-width: 1024px)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    const update = () => setStageEnabled(query.matches && !connection?.saveData);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const frame = useTransform(scrollYProgress, TIMELINE_PROGRESS, TIMELINE_FRAMES);

  // Fase A, hero: sai entre 0.22 e 0.34
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22, 0.34], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0.22, 0.34], [0, -40]);

  // Fase B, legendas: entram a partir de 0.36
  const panelOpacity = useTransform(scrollYProgress, [0.36, 0.44, 0.92, 0.99], [0, 1, 1, 0]);

  // Saída: o vídeo se dissolve no fundo antes de o palco soltar
  const videoOpacity = useTransform(scrollYProgress, [0.93, 1], [1, 0]);

  if (!stageEnabled) {
    // Versão empilhada: mobile, tablet estreito, dados economizados e movimento
    // reduzido. Duas seções normais, sem palco fixo e sem sequência.
    return (
      <div ref={wrapperRef}>
        <PromoHero variant="section" />
        <PromoCloseUp variant="section" />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-[360vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: STUDIO }}>
        {/* Vídeo: deslocado para a direita do texto, borda esquerda dissolvida no estúdio */}
        <motion.div
          style={{ opacity: videoOpacity }}
          className="absolute inset-y-0 right-0 w-[76%]"
        >
          <ScrollSequence
            frame={frame}
            className="h-full w-full"
            label="Empilhadeira EP DS3 girando 360 graus: bateria, mastro, patolas, rodas e timão"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-2/5"
            style={{ background: `linear-gradient(to right, ${STUDIO}, transparent)` }}
          />
        </motion.div>

        {/* Emenda com a seção seguinte, que usa o fundo da página */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05070B] to-transparent" />

        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-2 items-center gap-14 px-8">
          <div className="relative">
            <motion.div style={{ opacity: heroOpacity, y: heroY }}>
              <PromoHero variant="stage" />
            </motion.div>

            <motion.div
              style={{ opacity: panelOpacity }}
              className="pointer-events-none absolute inset-0 flex items-center"
            >
              <PromoCloseUp variant="stage" progress={scrollYProgress} />
            </motion.div>
          </div>
        </div>

        <motion.div
          style={{ opacity: panelOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        >
          <StageProgress progress={scrollYProgress} />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Indicador de progresso                                                     */
/* -------------------------------------------------------------------------- */

function StageProgress({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const unsubscribe = progress.on("change", (value) => {
      const span = (0.92 - 0.42) / CLOSE_UP_POINTS.length;
      const index = Math.floor((value - 0.42) / span);
      setActive(Math.min(Math.max(index, 0), CLOSE_UP_POINTS.length - 1));
    });
    return () => unsubscribe();
  }, [progress]);

  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {CLOSE_UP_POINTS.map((point, index) => (
        <span
          key={point.title}
          className={`h-1 rounded-full transition-all duration-300 ${
            index === active ? "w-8 bg-orange-500" : "w-4 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}
