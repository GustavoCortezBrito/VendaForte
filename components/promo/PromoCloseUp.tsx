"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Rotate3d } from "lucide-react";
import ScrollSequence, { type FrameSequence } from "./ScrollSequence";
import { DS3_SEQUENCE, DS3_SHOTS, whatsappUrl, type DS3ShotKey } from "./promo.config";
import { EASE_OUT, Eyebrow, FEATHER_STYLE, Reveal, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 02 — A DS3 por dentro, num visualizador 360°.
 *
 * Arrastar gira a máquina pelos quadros do giro. Pontos numerados acompanham
 * cada componente; ao escolher um, a máquina gira até o melhor ângulo, a câmera
 * aproxima e o componente ganha descrição e foto de perto.
 *
 * Especificação: docs/promo/02-veja-de-perto.md
 */

/** Posição de uma peça no giro, em px do quadro de 1920 × 1080. */
interface Orbit {
  /** Distância horizontal até o eixo de rotação. Zero para peças sobre o eixo. */
  radius: number;
  /** Ângulo da peça no quadro 0, em graus. Em 90° ela fica de frente para a câmera. */
  phase: number;
  y: number;
  /** Deslocamento vertical quando a peça vem para a frente, pela perspectiva do piso. */
  depthY?: number;
}

export interface CloseUpPoint {
  title: string;
  description: string;
  /** Foto de perto, com o ponto e a ampliação do recorte. */
  shot: DS3ShotKey;
  focus: string;
  zoom: number;
  /** Quadro do giro (um por grau) em que a peça fica mais à vista. */
  view: number;
  orbit: Orbit;
}

// Posições medidas nos quadros 0, 45, 90… 315 do giro e ajustadas a uma rotação
// em torno do eixo vertical, conferidas a cada 22,5°.
export const CLOSE_UP_POINTS: CloseUpPoint[] = [
  {
    title: "Timão de comando",
    description:
      "Aceleração progressiva e botões de elevação ao alcance do polegar. Reduz fadiga em jornada longa.",
    shot: "frente",
    focus: "37% 40%",
    zoom: 2.1,
    view: 20,
    orbit: { radius: 246, phase: 127, y: 438 },
  },
  {
    title: "Bateria de lítio 24V",
    description:
      "Removível, com conector rápido. Aceita carga parcial em qualquer intervalo, sem efeito memória.",
    shot: "tresQuartos",
    focus: "38% 72%",
    zoom: 1.7,
    view: 40,
    orbit: { radius: 171, phase: 51, y: 720 },
  },
  {
    title: "Mastro",
    description:
      "Elevação de 3 a 3,9 metros conforme a configuração, com visibilidade frontal preservada para o posicionamento do pallet.",
    shot: "mastro",
    focus: "50% 22%",
    zoom: 1.6,
    view: 90,
    orbit: { radius: 0, phase: 0, y: 300 },
  },
  {
    title: "Patolas",
    description:
      "Estabilidade para carga elevada sem exigir contrapeso, o que mantém a máquina compacta.",
    shot: "traseira",
    focus: "50% 88%",
    zoom: 1.7,
    view: 150,
    orbit: { radius: 331, phase: 273.5, y: 930, depthY: 40 },
  },
  {
    title: "Rodas e chassi",
    description: "Construção para piso industrial e giro em corredor estreito.",
    shot: "lateral",
    focus: "62% 90%",
    zoom: 1.8,
    view: 70,
    orbit: { radius: 150, phase: 51, y: 900, depthY: 30 },
  },
];

const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
/** Eixo de rotação da máquina no quadro. */
const AXIS_X = 950;
/** Ampliação da câmera com um componente escolhido. */
const CAMERA_ZOOM = 1.45;
/** Graus por segundo do giro automático, até a primeira interação. */
const IDLE_SPEED = 12;

// O quadro 360 repete o 0: no visualizador a volta fecha em 360 quadros, um por grau
const VIEWER_SEQUENCE: FrameSequence = { ...DS3_SEQUENCE, frames: 360 };

const DEMO_URL = whatsappUrl("Olá! Quero agendar uma demonstração da EP DS3 na minha operação.");
const COUNT = CLOSE_UP_POINTS.length;

function locate({ radius, phase, y, depthY = 0 }: Orbit, angle: number) {
  const radians = ((angle + phase) * Math.PI) / 180;
  // 1 de frente para a câmera, -1 do lado oposto
  const depth = Math.sin(radians);
  return {
    x: AXIS_X + radius * Math.cos(radians),
    y: y + depthY * depth,
    // Some ao passar para trás da máquina
    visibility: radius === 0 ? 1 : Math.min(1, Math.max(0, (depth + 0.35) / 0.3)),
  };
}

/** Menor caminho entre dois ângulos, em graus, entre -180 e 180. */
const shortestTurn = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;

export default function PromoCloseUp() {
  const prefersReducedMotion = useReducedMotion();
  const viewerRef = useRef<HTMLDivElement>(null);
  // Só baixa os quadros perto da seção
  const near = useInView(viewerRef, { once: true, margin: "600px 0px" });
  const inView = useInView(viewerRef, { amount: 0.3 });

  const [active, setActive] = useState(-1);
  const [touched, setTouched] = useState(false);
  const frame = useMotionValue(0);
  const zoom = useMotionValue(0);
  const spin = useRef<AnimationPlaybackControls | null>(null);
  const camera = useRef<AnimationPlaybackControls | null>(null);
  // A câmera continua mirando o último componente enquanto se afasta
  const focusRef = useRef(0);

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 1.2, ease: EASE_OUT };

  useAnimationFrame((_, delta) => {
    if (touched || !inView || prefersReducedMotion) return;
    frame.set(frame.get() + (IDLE_SPEED * delta) / 1000);
  });

  const moveCamera = (to: number) => {
    camera.current?.stop();
    camera.current = animate(zoom, to, transition);
  };

  const select = (index: number) => {
    setTouched(true);
    const next = index === active ? -1 : index;
    setActive(next);
    if (next < 0) {
      moveCamera(0);
      return;
    }
    focusRef.current = next;
    moveCamera(1);
    const current = frame.get();
    spin.current?.stop();
    spin.current = animate(
      frame,
      current + shortestTurn(current, CLOSE_UP_POINTS[next].view),
      transition
    );
  };

  /** Giro livre, por arraste ou teclado: solta o componente escolhido. */
  const rotate = (degrees: number) => {
    spin.current?.stop();
    if (!touched) setTouched(true);
    if (active >= 0) {
      setActive(-1);
      moveCamera(0);
    }
    frame.set(frame.get() + degrees);
  };

  const previous = () => select(active <= 0 ? COUNT - 1 : active - 1);
  const next = () => select((active + 1) % COUNT);

  return (
    <section id="ds3" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Detalhe construtivo</Eyebrow>
            <h2 className={`mt-4 ${TITLE} text-white`}>Conheça a DS3 por dentro</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-neutral-400">
              Arraste para girar a máquina e toque nos pontos para ver cada componente.
            </p>
          </Reveal>

          <ol className="mt-10 hidden border-l border-white/10 lg:block">
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
                    onClick={() => select(index)}
                    aria-pressed={isActive}
                    className="group w-full cursor-pointer rounded-r-lg py-3 pl-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
                  >
                    <span className="flex items-center gap-3">
                      <Marker number={index + 1} active={isActive} />
                      <span
                        className={`text-xl font-semibold tracking-tight transition-colors duration-500 ${
                          isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                        }`}
                      >
                        {point.title}
                      </span>
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      className="block overflow-hidden"
                    >
                      <PointDetail point={point} className="pt-4" />
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ol>

          <WhatsAppLink href={DEMO_URL} className="mt-10 hidden lg:inline-flex">
            Agendar demonstração na minha operação
          </WhatsAppLink>
        </div>

        <div className="lg:col-span-7">
          <Viewer
            viewerRef={viewerRef}
            enabled={near}
            frame={frame}
            zoom={zoom}
            focusRef={focusRef}
            active={active}
            touched={touched}
            onSelect={select}
            onRotate={rotate}
          />

          {/* Barra de componentes, como nos visualizadores de anatomia */}
          <div className="mx-auto mt-4 flex max-w-xl items-center gap-2 rounded-full border border-white/10 bg-ink-raised p-1.5">
            <button
              type="button"
              onClick={previous}
              aria-label="Componente anterior"
              className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <p aria-live="polite" className="min-w-0 flex-1 truncate text-center text-sm">
              {active < 0 ? (
                <span className="text-neutral-500">Selecione um componente</span>
              ) : (
                <>
                  <span className="font-mono tabular-nums text-red-500">
                    {active + 1}/{COUNT}
                  </span>
                  <span className="ml-2 font-medium text-white">{CLOSE_UP_POINTS[active].title}</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo componente"
              className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile: a descrição fica logo abaixo da máquina */}
          <div className="lg:hidden">
            {active >= 0 && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="mt-6"
              >
                <PointDetail point={CLOSE_UP_POINTS[active]} />
              </motion.div>
            )}
            <WhatsAppLink href={DEMO_URL} className="mt-10 w-full">
              Agendar demonstração pelo WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Visualizador                                                               */
/* -------------------------------------------------------------------------- */

function Viewer({
  viewerRef,
  enabled,
  frame,
  zoom,
  focusRef,
  active,
  touched,
  onSelect,
  onRotate,
}: {
  viewerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  frame: MotionValue<number>;
  zoom: MotionValue<number>;
  focusRef: React.RefObject<number>;
  active: number;
  touched: boolean;
  onSelect: (index: number) => void;
  onRotate: (degrees: number) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const size = useRef({ width: 0, height: 0 });
  // Posição que o canvas de fato desenhou: os pontos seguem a imagem, não o alvo
  const painted = useRef<number | null>(null);
  const drag = useRef<{ id: number; x: number } | null>(null);

  const layout = () => {
    const { width, height } = size.current;
    const layer = layerRef.current;
    if (!width || !layer) return;

    // O quadro é encaixado pela altura e centralizado, como no canvas
    const scale = height / FRAME_HEIGHT;
    const offsetX = (width - FRAME_WIDTH * scale) / 2;

    // Câmera: amplia em torno do componente e o puxa até metade do caminho para o
    // centro, sem nunca descobrir a borda da imagem
    const progress = zoom.get();
    const z = 1 + (CAMERA_ZOOM - 1) * progress;
    const target = CLOSE_UP_POINTS[focusRef.current];
    const focus = locate(target.orbit, target.view);
    const pan = (point: number, extent: number) =>
      Math.min(0, Math.max(extent * (1 - z), point * (1 - z) + (extent / 2 - point) * 0.5 * progress));
    const tx = pan(offsetX + focus.x * scale, width);
    const ty = pan(focus.y * scale, height);
    layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${z})`;

    const angle = painted.current;
    CLOSE_UP_POINTS.forEach((point, index) => {
      const hotspot = hotspotRefs.current[index];
      if (!hotspot) return;
      if (angle === null) {
        hotspot.style.opacity = "0";
        return;
      }
      const spot = locate(point.orbit, angle);
      const x = tx + (offsetX + spot.x * scale) * z;
      const y = ty + spot.y * scale * z;
      hotspot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      hotspot.style.opacity = String(spot.visibility);
      hotspot.style.pointerEvents = spot.visibility > 0.5 ? "auto" : "none";
    });
  };

  // Guardado em ref: o observador e o canvas chamam sempre a versão atual
  const layoutRef = useRef(layout);
  useEffect(() => {
    layoutRef.current = layout;
  });

  useMotionValueEvent(zoom, "change", () => layoutRef.current());

  useEffect(() => {
    const element = viewerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      size.current = { width: entry.contentRect.width, height: entry.contentRect.height };
      layoutRef.current();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [viewerRef]);

  const onPaint = (position: number) => {
    painted.current = position;
    layoutRef.current();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("button")) return;
    drag.current = { id: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    current.x = event.clientX;
    // A largura toda do visualizador vale cerca de 300°
    if (dx) onRotate((-dx * 300) / Math.max(size.current.width, 1));
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft") onRotate(-15);
    else if (event.key === "ArrowRight") onRotate(15);
    else if (event.key === "Escape" && active >= 0) onSelect(active);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={viewerRef}
      role="group"
      aria-label="EP DS3 em 360°. Use as setas para girar."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className="relative mx-auto aspect-square w-full max-w-[min(100%,82vh)] cursor-grab touch-pan-y select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 active:cursor-grabbing sm:aspect-[5/4] lg:max-w-none"
      style={FEATHER_STYLE}
    >
      <div ref={layerRef} className="absolute inset-0 origin-top-left will-change-transform">
        {enabled && (
          <ScrollSequence
            sequence={VIEWER_SEQUENCE}
            frame={frame}
            loop
            density={CAMERA_ZOOM}
            onPaint={onPaint}
            className="h-full w-full"
            label="Empilhadeira EP DS3 girando conforme o arraste"
          />
        )}
      </div>

      {CLOSE_UP_POINTS.map((point, index) => {
        const isActive = index === active;
        return (
          <button
            key={point.title}
            ref={(element) => {
              hotspotRefs.current[index] = element;
            }}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={isActive}
            aria-label={`${index + 1}. ${point.title}`}
            className="group absolute left-0 top-0 cursor-pointer rounded-full opacity-0 focus-visible:outline-none"
          >
            {!isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-duration:2.4s]"
              />
            )}
            <Marker number={index + 1} active={isActive} large />
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-ink/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:block"
              >
                {point.title}
              </span>
            )}
          </button>
        );
      })}

      <motion.p
        aria-hidden="true"
        initial={false}
        animate={{ opacity: touched ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute left-1/2 top-6 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-ink/70 px-4 py-2 text-xs font-medium text-neutral-200 backdrop-blur-md"
      >
        <Rotate3d className="h-4 w-4 text-red-500" />
        Arraste para girar
      </motion.p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Marker({ number, active, large = false }: { number: number; active: boolean; large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid shrink-0 place-items-center rounded-full font-semibold tabular-nums shadow-[0_0_0_4px_rgba(13,13,13,0.45)] transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-red-500 ${
        large ? "h-8 w-8 text-sm" : "h-6 w-6 text-xs"
      } ${active ? "bg-red-600 text-white" : "bg-white text-ink group-hover:bg-red-100"}`}
    >
      {number}
    </span>
  );
}

function PointDetail({ point, className = "" }: { point: CloseUpPoint; className?: string }) {
  return (
    <span className={`flex items-start gap-4 ${className}`}>
      <span className="relative block aspect-square w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-ink-raised">
        <span
          className="absolute inset-0 block"
          style={{ transform: `scale(${point.zoom})`, transformOrigin: point.focus }}
        >
          <Image
            src={DS3_SHOTS[point.shot].src}
            alt={`${point.title} da empilhadeira EP DS3 em detalhe`}
            fill
            sizes={`${Math.round(96 * point.zoom)}px`}
            className="object-cover"
          />
        </span>
      </span>
      <span className="block max-w-sm text-[15px] leading-relaxed text-neutral-400">
        {point.description}
      </span>
    </span>
  );
}
