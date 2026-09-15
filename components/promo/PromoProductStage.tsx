"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import ScrollSequence from "./ScrollSequence";
import { DS3_SEQUENCE, DS3_VIDEO, HERO_ID, PRODUCTS, whatsappUrl } from "./promo.config";
import { ScrollLetters, VideoSources, WhatsAppLink } from "./ui";

/**
 * Hero da campanha: o giro da DS3.
 *
 * No desktop o scroll controla o vídeo quadro a quadro, num palco fixo de 400vh.
 * Em repouso a tela é só a máquina; conforme a volta avança, o nome e o preço
 * entram letra a letra à esquerda. No mobile, com movimento reduzido ou economia
 * de dados, o giro roda em loop com o preço fixo embaixo.
 */

const DS3 = PRODUCTS.ds3;
const PRICE = DS3.price ?? "Condição de lote";

// Segura a frente no começo e o último quadro no fim, para o giro não começar
// nem terminar no meio de um gesto de scroll.
const TIMELINE_PROGRESS = [0, 0.04, 0.96, 1];
const TIMELINE_FRAMES = [0, 0, DS3_SEQUENCE.frames - 1, DS3_SEQUENCE.frames - 1];

const LABEL = "Empilhadeira elétrica EP DS3 girando 360 graus";

// O título da página existe para leitor de tela e busca; o visível entra com o scroll.
const HEADLINE = DS3.listPrice
  ? `Empilhadeira elétrica EP DS3 de lítio, ${DS3.capacity}, de ${DS3.listPrice} por ${PRICE}`
  : `Empilhadeira elétrica EP DS3 de lítio, ${DS3.capacity}, a partir de ${PRICE}`;

// Dissolve o piso do estúdio no fundo da página.
const FLOOR_FADE = "linear-gradient(to bottom, #000 80%, transparent)";

const QUOTE_URL = whatsappUrl(
  `Olá! Quero cotar a ${DS3.name} de ${DS3.capacity} da campanha promocional.`
);

export default function PromoProductStage() {
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

  // Cada variante tem o próprio ref e o próprio useScroll. Com um ref só, o
  // scroll continuaria medindo a seção desmontada na troca de variante.
  return stageEnabled ? <Stage /> : <Loop />;
}

function Stage() {
  const wrapperRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Derivar por função tira o valor da aceleração nativa do Motion (ViewTimeline),
  // que num palco fixo calcula outro intervalo: letras, botão e canvas passam a
  // seguir exatamente o mesmo progresso.
  const progress = useTransform(scrollYProgress, (value) => value);
  const frame = useTransform(progress, TIMELINE_PROGRESS, TIMELINE_FRAMES);
  const cueOpacity = useTransform(progress, [0, 0.03], [1, 0]);

  return (
    // 400vh: três telas de rolagem para a volta inteira, cerca de 1° a cada 7 px
    <section ref={wrapperRef} id={HERO_ID} data-hero="stage" className="relative h-[400vh] bg-ink">
      <h1 className="sr-only">{HEADLINE}</h1>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Começa abaixo da cápsula do header, para o mastro não passar sob o menu */}
        <div className="absolute inset-x-0 bottom-0 top-20">
          <ScrollSequence
            sequence={DS3_SEQUENCE}
            frame={frame}
            className="h-full w-full"
            label={LABEL}
          />
        </div>

        <PriceReveal progress={progress} />

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

function Loop() {
  return (
    <section
      id={HERO_ID}
      data-hero="loop"
      className="relative flex h-[100svh] min-h-[560px] flex-col items-center justify-center overflow-hidden bg-ink"
    >
      <h1 className="sr-only">{HEADLINE}</h1>
      <LoopVideo />
      <div className="relative -mt-6 px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          EP {DS3.shortName} · {DS3.capacity}
        </p>
        {DS3.listPrice ? (
          <p className="mt-3 text-lg text-neutral-400">
            De{" "}
            <s className="font-semibold text-neutral-500 decoration-red-500 decoration-2">
              {DS3.listPrice}
            </s>{" "}
            por
          </p>
        ) : (
          DS3.price && <p className="mt-3 text-sm text-neutral-400">A partir de</p>
        )}
        <p className="text-5xl font-bold tracking-[-0.045em] text-white">{PRICE}</p>
        <p className="mt-2 text-sm text-neutral-400">{DS3.installment}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Preço letra a letra                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Com preço anterior: entra "De R$ 29.900", uma linha vermelha risca o valor e
 * aparece "Por R$ 19.900" embaixo. Sem preço anterior: "A partir de" e o preço.
 */
function PriceReveal({ progress }: { progress: MotionValue<number> }) {
  const lineOpacity = useTransform(progress, [0.2, 0.28], [0, 1]);
  const lineY = useTransform(progress, [0.2, 0.28], [12, 0]);
  const strike = useTransform(progress, [0.58, 0.66], [0, 1]);
  const oldPriceOpacity = useTransform(progress, [0.58, 0.66], [1, 0.4]);
  const ctaOpacity = useTransform(progress, [0.86, 0.92], [0, 1]);
  const ctaY = useTransform(progress, [0.86, 0.92], [16, 0]);

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-[40vw] flex-col justify-center pl-[6vw] xl:pl-[7vw]">
      <p className="text-[clamp(3.25rem,6vw,7rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white">
        <ScrollLetters text={`EP ${DS3.shortName}`} progress={progress} range={[0.06, 0.18]} />
      </p>
      <motion.p style={{ opacity: lineOpacity, y: lineY }} className="mt-4 text-lg text-neutral-400">
        {DS3.category} · {DS3.capacity} · lítio 24 V
      </motion.p>

      {DS3.listPrice ? (
        <>
          <p className="mt-12 text-base font-medium text-neutral-400">
            <ScrollLetters text="De" progress={progress} range={[0.32, 0.38]} />
          </p>
          <motion.p
            style={{ opacity: oldPriceOpacity }}
            className="relative mt-1 self-start whitespace-nowrap text-[clamp(2.25rem,3.8vw,4.25rem)] font-bold leading-none tracking-[-0.045em] text-white"
          >
            <span className="sr-only">Preço anterior: </span>
            <ScrollLetters text={DS3.listPrice} progress={progress} range={[0.38, 0.56]} />
            <motion.span
              aria-hidden="true"
              style={{ scaleX: strike }}
              className="absolute -inset-x-[0.06em] top-[52%] h-[0.09em] origin-left rounded-full bg-red-500"
            />
          </motion.p>
          <p className="mt-6 text-base font-medium text-red-500">
            <ScrollLetters text="Por" progress={progress} range={[0.66, 0.7]} />
          </p>
        </>
      ) : (
        DS3.price && (
          <p className="mt-14 text-base font-medium text-red-500">
            <ScrollLetters text="A partir de" progress={progress} range={[0.44, 0.54]} />
          </p>
        )
      )}
      <p className="mt-1 whitespace-nowrap text-[clamp(3rem,5.6vw,6.5rem)] font-bold leading-none tracking-[-0.05em] text-white">
        <ScrollLetters
          text={PRICE}
          progress={progress}
          range={DS3.listPrice ? [0.7, 0.84] : [0.54, 0.78]}
        />
      </p>

      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="pointer-events-auto mt-6">
        <p className="text-neutral-400">{DS3.installment}</p>
        <WhatsAppLink href={QUOTE_URL} className="mt-6">
          Cotar a {DS3.shortName} no WhatsApp
        </WhatsAppLink>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

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
      poster={DS3_SEQUENCE.webp(0)}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={LABEL}
      className="aspect-square w-full object-cover sm:aspect-video"
      style={{ maskImage: FLOOR_FADE, WebkitMaskImage: FLOOR_FADE }}
    >
      <VideoSources video={DS3_VIDEO} />
    </video>
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
