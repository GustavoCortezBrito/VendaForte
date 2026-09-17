"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import ScrollSequence from "./ScrollSequence";
import {
  COMPACT_QUERY,
  DS3_SEQUENCE,
  DS3_VIDEO,
  HERO_ID,
  PRODUCTS,
  STAGE_MIN_HEIGHT,
  whatsappUrl,
} from "./promo.config";
import {
  FEATHER_STYLE,
  savesData,
  ScrollLetters,
  useMediaQuery,
  useMounted,
  VideoSources,
  WhatsAppLink,
} from "./ui";

/**
 * Hero da campanha: o giro da DS3.
 *
 * O scroll controla o giro quadro a quadro, num palco fixo, tanto no desktop
 * quanto no celular. Em repouso a tela é só a máquina; conforme a volta avança,
 * o nome e o preço entram letra a letra — à esquerda no desktop, no rodapé da
 * tela no celular, onde a máquina sobe e encolhe para abrir espaço. Com
 * movimento reduzido ou economia de dados, o giro roda em loop no vídeo.
 */

const DS3 = PRODUCTS.ds3;
const PRICE = DS3.price ?? "Condição de lote";

// Segura a frente no começo e o último quadro no fim, para o giro não começar
// nem terminar no meio de um gesto de scroll.
const TIMELINE_PROGRESS = [0, 0.04, 0.96, 1];
const TIMELINE_FRAMES = [0, 0, DS3_SEQUENCE.frames - 1, DS3_SEQUENCE.frames - 1];

const LABEL = "Empilhadeira elétrica EP DS3 girando 360 graus";

// O título da página existe para leitor de tela e busca; o visível entra com o scroll.
// Cobre as três máquinas da página, com as palavras do título
const DS3_OFFER = DS3.listPrice ? `de ${DS3.listPrice} por ${PRICE}` : `a partir de ${PRICE}`;
const HEADLINE = `Promoção Venda Forte: empilhadeira elétrica EP DS3 ${DS3_OFFER}, EFL302 B3 e paleteira F4`;

// Dissolve o piso do estúdio no fundo da página.
const FLOOR_FADE = "linear-gradient(to bottom, #000 80%, transparent)";

const QUOTE_URL = whatsappUrl(
  `Olá! Quero cotar a ${DS3.name} de ${DS3.capacity} da campanha promocional.`
);

export default function PromoProductStage() {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();
  const tallEnough = useMediaQuery(STAGE_MIN_HEIGHT);

  // O palco liga depois da montagem. O servidor e a primeira renderização do
  // cliente são sempre o loop em vídeo, que também atende quem pediu movimento
  // reduzido, economiza dados ou está numa tela muito baixa.
  const stageEnabled = mounted && tallEnough && !prefersReducedMotion && !savesData();

  // Cada variante tem o próprio ref e o próprio useScroll. Com um ref só, o
  // scroll continuaria medindo a seção desmontada na troca de variante.
  return stageEnabled ? <Stage /> : <Loop />;
}

function Stage() {
  const wrapperRef = useRef<HTMLElement>(null);
  const compact = useMediaQuery(COMPACT_QUERY);
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

  // No celular a máquina sobe e encolhe, abrindo espaço para o preço embaixo
  const machineY = useTransform(progress, [0.08, 0.36], ["0%", compact ? "-13%" : "0%"]);
  const machineScale = useTransform(progress, [0.08, 0.36], [1, compact ? 0.84 : 1]);
  // O véu do celular entra junto com o texto: em repouso o hero é só a máquina
  const scrimOpacity = useTransform(progress, [0.04, 0.26], [0, 1]);

  return (
    // Telas de rolagem para a volta inteira. `svh` no celular: a altura não muda
    // quando a barra do navegador some, então o palco fixo não dá salto.
    <section
      ref={wrapperRef}
      id={HERO_ID}
      data-hero="stage"
      className="relative h-[320svh] bg-ink lg:h-[400vh]"
    >
      <h1 className="sr-only">{HEADLINE}</h1>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Começa abaixo da cápsula do header, para o mastro não passar sob o menu */}
        <motion.div
          // Ao encolher no celular, a borda do quadro entraria na tela: a máscara
          // dissolve o piso do estúdio no fundo da página.
          style={{ y: machineY, scale: machineScale, ...(compact ? FEATHER_STYLE : null) }}
          className="absolute inset-x-0 bottom-0 top-16 lg:top-20"
        >
          <ScrollSequence
            sequence={DS3_SEQUENCE}
            frame={frame}
            className="h-full w-full"
            label={LABEL}
          />
        </motion.div>

        <motion.span
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-ink via-ink/90 to-transparent lg:hidden"
        />

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
        {DS3.priceNote && (
          <p className="mt-2 text-sm font-medium text-neutral-300">{DS3.priceNote}</p>
        )}
        <p className="mt-1 text-sm text-neutral-400">{DS3.installment}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Preço letra a letra                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Com preço anterior: entra o "De", uma linha vermelha risca o valor e aparece
 * o "Por" com o preço da campanha embaixo. Sem preço anterior: "A partir de".
 */
function PriceReveal({ progress }: { progress: MotionValue<number> }) {
  const lineOpacity = useTransform(progress, [0.2, 0.28], [0, 1]);
  const lineY = useTransform(progress, [0.2, 0.28], [12, 0]);
  const strike = useTransform(progress, [0.58, 0.66], [0, 1]);
  const oldPriceOpacity = useTransform(progress, [0.58, 0.66], [1, 0.4]);
  const ctaOpacity = useTransform(progress, [0.86, 0.92], [0, 1]);
  const ctaY = useTransform(progress, [0.86, 0.92], [16, 0]);

  return (
    // Celular: rodapé da tela, sobre um véu que separa o texto da máquina.
    // Desktop: coluna à esquerda, centrada na altura.
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col px-6 pb-28 lg:inset-y-0 lg:right-auto lg:w-[40vw] lg:justify-center lg:px-0 lg:pb-0 lg:pl-[6vw] xl:pl-[7vw]">
      <p className="text-[clamp(2.75rem,13vw,4rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white lg:text-[clamp(3.25rem,6vw,7rem)]">
        <ScrollLetters text={`EP ${DS3.shortName}`} progress={progress} range={[0.06, 0.18]} />
      </p>
      <motion.p
        style={{ opacity: lineOpacity, y: lineY }}
        className="mt-3 text-[13px] text-neutral-400 lg:mt-4 lg:text-lg"
      >
        {DS3.category} · {DS3.capacity} · 3,0 a 3,9 m de elevação · lítio 24 V
      </motion.p>

      {DS3.listPrice ? (
        <>
          <p className="mt-6 text-sm font-medium text-neutral-400 lg:mt-12 lg:text-base">
            <ScrollLetters text="De" progress={progress} range={[0.32, 0.38]} />
          </p>
          <motion.p
            style={{ opacity: oldPriceOpacity }}
            className="relative mt-1 self-start whitespace-nowrap text-[clamp(1.75rem,8vw,2.5rem)] font-bold leading-none tracking-[-0.045em] text-white lg:text-[clamp(2.25rem,3.8vw,4.25rem)]"
          >
            <span className="sr-only">Preço anterior: </span>
            <ScrollLetters text={DS3.listPrice} progress={progress} range={[0.38, 0.56]} />
            <motion.span
              aria-hidden="true"
              style={{ scaleX: strike }}
              className="absolute -inset-x-[0.06em] top-[52%] h-[0.09em] origin-left rounded-full bg-red-500"
            />
          </motion.p>
          <p className="mt-4 text-sm font-medium text-red-500 lg:mt-6 lg:text-base">
            <ScrollLetters text="Por" progress={progress} range={[0.66, 0.7]} />
          </p>
        </>
      ) : (
        DS3.price && (
          <p className="mt-8 text-sm font-medium text-red-500 lg:mt-14 lg:text-base">
            <ScrollLetters text="A partir de" progress={progress} range={[0.44, 0.54]} />
          </p>
        )
      )}
      <p className="mt-1 whitespace-nowrap text-[clamp(2.5rem,12vw,3.5rem)] font-bold leading-none tracking-[-0.05em] text-white lg:text-[clamp(3rem,5.6vw,6.5rem)]">
        <ScrollLetters
          text={PRICE}
          progress={progress}
          range={DS3.listPrice ? [0.7, 0.84] : [0.54, 0.78]}
        />
      </p>

      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="pointer-events-auto mt-5 lg:mt-6">
        {DS3.priceNote && (
          <p className="text-sm font-medium text-neutral-300 lg:text-base">{DS3.priceNote}</p>
        )}
        <p className="mt-1 text-sm text-neutral-400 lg:text-base">{DS3.installment}</p>
        <WhatsAppLink href={QUOTE_URL} className="mt-5 w-full lg:mt-6 lg:w-auto">
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
