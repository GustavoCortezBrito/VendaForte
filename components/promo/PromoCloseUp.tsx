"use client";

import { useEffect, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { CalendarClock } from "lucide-react";
import PromoMediaSlot from "./PromoMediaSlot";
import { MEDIA, whatsappUrl } from "./promo.config";

/**
 * Seção 02 — Veja a DS3 de perto, fase B da sequência.
 *
 * `variant="stage"`: painel de legendas que se sucedem no palco fixo.
 * `variant="section"`: carrossel com deslize, usado no mobile e com movimento reduzido.
 *
 * Especificação: docs/promo/02-veja-de-perto.md
 */

export interface CloseUpPoint {
  title: string;
  description: string;
  mediaKey: keyof typeof MEDIA;
}

// A ordem segue o giro do vídeo do palco: cada legenda entra quando a peça está à vista.
export const CLOSE_UP_POINTS: CloseUpPoint[] = [
  {
    title: "Bateria de lítio 24V",
    description:
      "Removível, com conector rápido. Aceita carga parcial em qualquer intervalo, sem efeito memória.",
    mediaKey: "detalheBateria",
  },
  {
    title: "Mastro",
    description:
      "Elevação até 3,9 metros com visibilidade frontal preservada para o posicionamento do pallet.",
    mediaKey: "detalheMastro",
  },
  {
    title: "Patolas",
    description:
      "Estabilidade para carga elevada sem exigir contrapeso, o que mantém a máquina compacta.",
    mediaKey: "detalhePatolas",
  },
  {
    title: "Rodas e chassi",
    description: "Construção para piso industrial e giro em corredor estreito.",
    mediaKey: "detalheRodas",
  },
  {
    title: "Timão de comando",
    description:
      "Aceleração progressiva e botões de elevação ao alcance do polegar. Reduz fadiga em jornada longa.",
    mediaKey: "detalheTimao",
  },
];

const DEMO_URL = whatsappUrl(
  "Olá! Quero agendar uma demonstração da EP DS3 na minha operação."
);

/* -------------------------------------------------------------------------- */
/* Painel do palco                                                            */
/* -------------------------------------------------------------------------- */

function StagePanel({ progress }: { progress: MotionValue<number> }) {
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
    <div className="pointer-events-auto w-full">
      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
        Detalhe construtivo
      </span>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-white">
        Conheça a DS3 por dentro
      </h2>
      <p className="mt-3 text-neutral-500">Cinco pontos que fazem diferença no turno.</p>

      {/* Altura reservada pelo texto mais longo, para o layout não deslocar */}
      <div className="relative mt-8 min-h-[220px]">
        {CLOSE_UP_POINTS.map((point, index) => (
          <motion.div
            key={point.title}
            animate={{
              opacity: index === active ? 1 : 0,
              x: index === active ? 0 : -16,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
            aria-hidden={index !== active}
          >
            <div className="flex items-start gap-4">
              <span className="mt-1 font-mono text-sm text-orange-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">{point.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-neutral-400">
                  {point.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <a
        href={DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 hover:bg-emerald-500"
      >
        <CalendarClock className="h-4 w-4" />
        Agendar demonstração na minha operação
      </a>

      {/* Lista completa para leitor de tela, sempre presente no DOM */}
      <ul className="sr-only">
        {CLOSE_UP_POINTS.map((point) => (
          <li key={point.title}>
            {point.title}. {point.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Seção completa, com carrossel                                              */
/* -------------------------------------------------------------------------- */

function CloseUpSection() {
  return (
    <section
      id="ds3"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[600px] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Detalhe construtivo
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white lg:text-5xl">
            Conheça a DS3 por dentro
          </h2>
          <p className="mt-4 max-w-xl text-neutral-500">
            Cinco pontos que fazem diferença no turno. Deslize para o lado.
          </p>
        </div>

        {/* Carrossel com deslize nativo */}
        <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0">
          {CLOSE_UP_POINTS.map((point, index) => (
            <li
              key={point.title}
              tabIndex={0}
              className="w-[78%] shrink-0 snap-center rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl focus:outline-none focus-visible:border-orange-500/50 sm:w-[46%] lg:w-auto"
            >
              <PromoMediaSlot
                media={point.mediaKey}
                className="mb-4 aspect-[4/3] w-full rounded-xl"
                sizes="(max-width: 1024px) 78vw, 220px"
              />
              <span className="font-mono text-xs text-orange-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-base font-bold text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {point.description}
              </p>
            </li>
          ))}
        </ul>

        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 lg:w-auto lg:self-start"
        >
          <CalendarClock className="h-4 w-4" />
          Agendar demonstração na minha operação
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

interface PromoCloseUpProps {
  variant?: "stage" | "section";
  progress?: MotionValue<number>;
}

export default function PromoCloseUp({ variant = "section", progress }: PromoCloseUpProps) {
  if (variant === "stage" && progress) return <StagePanel progress={progress} />;
  return <CloseUpSection />;
}
