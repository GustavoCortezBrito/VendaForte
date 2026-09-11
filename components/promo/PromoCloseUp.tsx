"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { DS3_SHOTS, whatsappUrl, type DS3ShotKey } from "./promo.config";
import { EASE_OUT, Eyebrow, FEATHER_STYLE, Reveal, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 02 — A DS3 por dentro.
 *
 * Desktop: palco fixo. O scroll abre com a máquina inteira e depois percorre os
 * cinco pontos, com a câmera aproximando da peça de cada um.
 * Mobile: cartões empilhados com o mesmo enquadramento.
 *
 * Especificação: docs/promo/02-veja-de-perto.md
 */

export interface CloseUpPoint {
  title: string;
  description: string;
  shot: DS3ShotKey;
  /** Ponto da foto para onde a câmera aproxima, em % do quadro. */
  focus: string;
  zoom: number;
}

export const CLOSE_UP_POINTS: CloseUpPoint[] = [
  {
    title: "Timão de comando",
    description:
      "Aceleração progressiva e botões de elevação ao alcance do polegar. Reduz fadiga em jornada longa.",
    shot: "frente",
    focus: "37% 40%",
    zoom: 2.1,
  },
  {
    title: "Bateria de lítio 24V",
    description:
      "Removível, com conector rápido. Aceita carga parcial em qualquer intervalo, sem efeito memória.",
    shot: "tresQuartos",
    focus: "38% 72%",
    zoom: 1.7,
  },
  {
    title: "Mastro",
    description:
      "Elevação até 3,9 metros com visibilidade frontal preservada para o posicionamento do pallet.",
    shot: "mastro",
    focus: "50% 22%",
    zoom: 1.6,
  },
  {
    title: "Patolas",
    description:
      "Estabilidade para carga elevada sem exigir contrapeso, o que mantém a máquina compacta.",
    shot: "traseira",
    focus: "50% 88%",
    zoom: 1.7,
  },
  {
    title: "Rodas e chassi",
    description: "Construção para piso industrial e giro em corredor estreito.",
    shot: "lateral",
    focus: "62% 90%",
    zoom: 1.8,
  },
];

/** A abertura mostra a máquina inteira, na mesma foto de onde sai o primeiro zoom. */
const OVERVIEW: DS3ShotKey = "frente";
const SEGMENTS = CLOSE_UP_POINTS.length + 1;

const DEMO_URL = whatsappUrl("Olá! Quero agendar uma demonstração da EP DS3 na minha operação.");

export default function PromoCloseUp() {
  const trackRef = useRef<HTMLDivElement>(null);
  // -1 é a abertura, com a máquina inteira
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(Math.floor(value * SEGMENTS), SEGMENTS - 1) - 1);
  });

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const travel = track.offsetHeight - window.innerHeight;
    const top =
      track.getBoundingClientRect().top + window.scrollY + travel * ((index + 1.5) / SEGMENTS);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="ds3" className="relative scroll-mt-24 border-t border-white/[0.06] bg-ink">
      {/* ---------------- Desktop: palco fixo ---------------- */}
      <div ref={trackRef} className="relative hidden h-[480vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-8 px-8">
            <div className="col-span-5">
              <Eyebrow>Detalhe construtivo</Eyebrow>
              <h2 className={`mt-4 ${TITLE} text-white`}>Conheça a DS3 por dentro</h2>

              <ol className="mt-10 border-l border-white/10">
                {CLOSE_UP_POINTS.map((point, index) => {
                  const isActive = index === active;
                  return (
                    <li key={point.title} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-px top-0 h-full w-px transition-colors duration-500 ${
                          isActive ? "bg-red-500" : "bg-transparent"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-current={isActive ? "step" : undefined}
                        className="w-full cursor-pointer rounded-r-lg py-3 pl-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
                      >
                        <span
                          className={`block text-xl font-semibold tracking-tight transition-colors duration-500 ${
                            isActive ? "text-white" : "text-neutral-600 hover:text-neutral-400"
                          }`}
                        >
                          {point.title}
                        </span>
                        <motion.span
                          initial={false}
                          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: EASE_OUT }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-sm pt-2 text-[15px] leading-relaxed text-neutral-400">
                            {point.description}
                          </span>
                        </motion.span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <WhatsAppLink href={DEMO_URL} className="mt-10">
                Agendar demonstração na minha operação
              </WhatsAppLink>
            </div>

            <div className="col-span-7">
              <div
                className="relative mx-auto aspect-square w-full max-w-[min(100%,78vh)] overflow-hidden"
                style={FEATHER_STYLE}
              >
                <Frame shot={OVERVIEW} visible={active === -1} zoom={1} focus="50% 50%" />
                {CLOSE_UP_POINTS.map((point, index) => (
                  <Frame
                    key={point.title}
                    shot={point.shot}
                    visible={index === active}
                    zoom={point.zoom}
                    focus={point.focus}
                  />
                ))}
              </div>
              <p className="mt-4 text-center font-mono text-xs tabular-nums text-neutral-500">
                {active < 0
                  ? "EP DS3 · 1.500 kg"
                  : `${String(active + 1).padStart(2, "0")} / ${String(CLOSE_UP_POINTS.length).padStart(2, "0")}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile: cartões empilhados ---------------- */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:hidden">
        <Reveal>
          <Eyebrow>Detalhe construtivo</Eyebrow>
          <h2 className={`mt-4 ${TITLE} text-white`}>Conheça a DS3 por dentro</h2>
          <p className="mt-4 text-lg text-neutral-400">Cinco pontos que fazem diferença no turno.</p>
        </Reveal>

        <ul className="mt-12 space-y-14">
          {CLOSE_UP_POINTS.map((point) => (
            <li key={point.title}>
              <Reveal>
                <div className="relative aspect-square w-full overflow-hidden" style={FEATHER_STYLE}>
                  <div
                    className="absolute inset-0"
                    style={{ transform: `scale(${point.zoom})`, transformOrigin: point.focus }}
                  >
                    <Image
                      src={DS3_SHOTS[point.shot].src}
                      alt={DS3_SHOTS[point.shot].alt}
                      fill
                      sizes={`${Math.round(100 * point.zoom)}vw`}
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                  {point.title}
                </h3>
                <p className="mt-2 leading-relaxed text-neutral-400">{point.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <WhatsAppLink href={DEMO_URL} className="mt-14 w-full">
          Agendar demonstração na minha operação
        </WhatsAppLink>
      </div>
    </section>
  );
}

/** Um quadro do palco: entra com fade e a câmera aproxima até o foco da peça. */
function Frame({
  shot,
  visible,
  zoom,
  focus,
}: {
  shot: DS3ShotKey;
  visible: boolean;
  zoom: number;
  focus: string;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformOrigin: focus }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? zoom : 1 }}
      transition={{
        opacity: { duration: 0.6 },
        // Ao sair, só desaparece; volta para a escala 1 depois de invisível
        scale: visible ? { duration: 1.4, ease: EASE_OUT } : { duration: 0, delay: 0.6 },
      }}
    >
      <Image
        src={DS3_SHOTS[shot].src}
        alt={visible ? DS3_SHOTS[shot].alt : ""}
        fill
        // O zoom é CSS: pede a imagem já na largura ampliada, senão o navegador
        // baixa a versão do tamanho da moldura e estica
        sizes={`(max-width: 1280px) ${Math.round(58 * zoom)}vw, ${Math.round(760 * zoom)}px`}
        className="object-cover"
      />
    </motion.div>
  );
}
