"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import PromoHero from "./PromoHero";
import PromoCloseUp, { CLOSE_UP_POINTS } from "./PromoCloseUp";
import PromoMediaSlot, { hasMedia } from "./PromoMediaSlot";

// three.js só existe no navegador e pesa; carrega à parte, apenas no palco desktop.
const ProductModel3D = dynamic(() => import("./ProductModel3D"), { ssr: false });

/**
 * Palco de produto compartilhado pelas seções 01 (hero) e 02 (veja de perto).
 *
 * A DS3 entra uma única vez e permanece na tela durante as duas seções. O scroll
 * gira o modelo 3D (`public/promo/ds3.glb`) uma volta completa ao longo do palco.
 *
 * Especificação: docs/promo/sequencia-scroll-produto.md
 */

export default function PromoProductStage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [stageEnabled, setStageEnabled] = useState(false);

  // O palco fixo só liga no desktop, depois da montagem. O servidor e a primeira
  // renderização do cliente são sempre a versão empilhada, o que evita divergência
  // de hidratação e garante que o mobile nunca carregue a sequência pesada.
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

  /* ---------------------------------------------------------------------- */
  /* Coreografia. As faixas seguem a tabela da especificação.                */
  /* ---------------------------------------------------------------------- */

  // Fase A, hero: sai entre 0.24 e 0.34
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22, 0.34], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0.22, 0.34], [0, -40]);

  // Produto: cresce na transição e migra na fase B. O giro fica com o modelo 3D.
  const productScale = useTransform(scrollYProgress, [0.24, 0.42, 0.92, 1], [1, 1.18, 1.18, 1]);
  const productX = useTransform(scrollYProgress, [0.34, 0.46], ["0%", "-22%"]);
  const productY = useTransform(scrollYProgress, [0.42, 0.92], [0, -28]);
  const productOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

  // Fase B, painel de legendas: entra a partir de 0.38
  const panelOpacity = useTransform(scrollYProgress, [0.36, 0.44, 0.92, 0.99], [0, 1, 1, 0]);

  /* ---------------------------------------------------------------------- */

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
    <div ref={wrapperRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#05070B]">
        {/* ---------------- Camada 1, fundo estático ----------------
            Só entra quando a arte existir. Um slot marcado em tela cheia
            atrapalharia a leitura do palco inteiro. */}
        {hasMedia("heroFundo") && (
          <PromoMediaSlot
            media="heroFundo"
            className="absolute inset-0 h-full w-full rounded-none border-0"
            imageClassName="opacity-40"
            sizes="100vw"
            preload
          />
        )}

        {/* ---------------- Camada 3, iluminação volumétrica ---------------- */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-[520px] w-[520px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute -right-20 bottom-0 h-[560px] w-[560px] rounded-full bg-red-600/20 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[120px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 72%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/70" />
        </div>

        {/* ---------------- Conteúdo ---------------- */}
        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-2 items-center gap-14 px-8">
          {/* Coluna esquerda: hero na fase A, legendas na fase B */}
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

          {/* Coluna direita: produto */}
          <motion.div
            style={{
              scale: productScale,
              x: productX,
              y: productY,
              opacity: productOpacity,
            }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute h-[460px] w-[460px] rounded-full bg-red-600/25 blur-[120px]" />
            <div className="absolute h-[260px] w-[260px] translate-y-24 rounded-full bg-orange-500/20 blur-[100px]" />
            <ProductStage3D progress={scrollYProgress} />
          </motion.div>
        </div>

        {/* Indicador de progresso da fase B */}
        <motion.div
          style={{ opacity: panelOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <StageProgress progress={scrollYProgress} />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Produto: modelo 3D da DS3                                                  */
/* -------------------------------------------------------------------------- */

/** Se o WebGL ou o GLB falharem, o palco cai para o render estático. */
class ModelErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function ProductStage3D({ progress }: { progress: MotionValue<number> }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-[min(76vh,720px)] w-full">
      {!failed && (
        <ModelErrorBoundary onError={() => setFailed(true)}>
          <ProductModel3D
            progress={progress}
            onLoaded={() => setLoaded(true)}
            className={`!absolute inset-0 transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </ModelErrorBoundary>
      )}

      {failed && (
        <PromoMediaSlot
          media="ds3Render"
          className="absolute inset-0 h-full w-full rounded-none border-0"
          sizes="600px"
          fit="contain"
        />
      )}
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
