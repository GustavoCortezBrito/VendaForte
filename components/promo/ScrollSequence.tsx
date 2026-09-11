"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

export const SEQUENCE_FPS = 24;
export const SEQUENCE_FRAMES = 145;

export const sequenceFrameSrc = (index: number) =>
  `/promo/sequencia/ds3-${String(index).padStart(3, "0")}.webp`;

/**
 * Rigidez com que o quadro exibido persegue o scroll, por segundo. Quanto
 * menor, mais longa a desaceleração depois que o scroll para.
 */
const STIFFNESS = 5;
const CONCURRENCY = 6;
/** Fundo do estúdio no vídeo, o mesmo `ink` da página. */
const STUDIO_RGB = "13, 13, 13";

interface ScrollSequenceProps {
  /** Índice de quadro, fracionário, já derivado do scroll. */
  frame: MotionValue<number>;
  className?: string;
  label: string;
}

/**
 * Desenha a sequência de quadros num canvas, encaixada pela altura.
 *
 * O quadro exibido persegue o alvo com amortecimento e, entre dois quadros
 * vizinhos, desenha a mistura dos dois na proporção da fração. Assim o giro não
 * anda em degraus nem para seco quando o scroll termina. Quadros ainda não
 * baixados são substituídos pelo vizinho carregado mais próximo.
 */
export default function ScrollSequence({ frame, className, label }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const lastIndex = SEQUENCE_FRAMES - 1;
    const images: (HTMLImageElement | null)[] = new Array(SEQUENCE_FRAMES).fill(null);
    let current = Math.min(Math.max(frame.get(), 0), lastIndex);
    let painted = Number.NaN;
    let paintedFrom = -1;
    let raf = 0;
    let previousTime = 0;
    let disposed = false;

    const nearestLoaded = (index: number) => {
      for (let offset = 0; offset < SEQUENCE_FRAMES; offset++) {
        if (images[index - offset]) return index - offset;
        if (images[index + offset]) return index + offset;
      }
      return -1;
    };

    const paint = (force = false) => {
      if (!force && Math.abs(current - painted) < 0.001) return;

      const base = Math.floor(current);
      const from = nearestLoaded(base);
      if (from < 0) return;
      // Só mistura com o vizinho exato; um quadro distante borraria o giro
      const to = from === base && base < lastIndex && images[base + 1] ? base + 1 : -1;
      const mix = current - base;

      const { width, height } = canvas;
      const image = images[from]!;
      // Encaixa pela altura para o mastro nunca ser cortado. Em tela mais larga
      // que o quadro, as laterais recebem a cor do estúdio e a borda se dissolve.
      const drawWidth = image.naturalWidth * (height / image.naturalHeight);
      const x = (width - drawWidth) / 2;

      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${STUDIO_RGB})`;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, x, 0, drawWidth, height);

      if (to >= 0 && mix > 0.01) {
        ctx.globalAlpha = mix;
        ctx.drawImage(images[to]!, x, 0, drawWidth, height);
        ctx.globalAlpha = 1;
      }

      if (x > 0) {
        const fade = drawWidth * 0.1;
        for (const [start, end] of [
          [x, x + fade],
          [x + drawWidth, x + drawWidth - fade],
        ]) {
          const gradient = ctx.createLinearGradient(start, 0, end, 0);
          gradient.addColorStop(0, `rgba(${STUDIO_RGB}, 1)`);
          gradient.addColorStop(1, `rgba(${STUDIO_RGB}, 0)`);
          ctx.fillStyle = gradient;
          ctx.fillRect(Math.min(start, end), 0, fade, height);
        }
      }

      painted = current;
      paintedFrom = from;
    };

    // Amortecimento pelo tempo real, não por repaint: a desaceleração tem a
    // mesma duração em monitores de 60 Hz e de 144 Hz.
    const tick = (time: number) => {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
      previousTime = time;
      const target = frame.get();
      current += (target - current) * (1 - Math.exp(-STIFFNESS * dt));
      if (Math.abs(target - current) < 0.002) current = target;
      paint();
      if (current === target) {
        raf = 0;
        previousTime = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.imageSmoothingQuality = "high";
      paint(true);
    };

    // Primeiro o quadro inicial, depois a sequência em passadas cada vez mais
    // finas: o scroll já funciona, grosseiro, muito antes de tudo baixar.
    const order: number[] = [];
    const queued = new Set<number>();
    for (let stride = 32; stride >= 1; stride /= 2) {
      for (let index = 0; index < SEQUENCE_FRAMES; index += stride) {
        if (!queued.has(index)) {
          queued.add(index);
          order.push(index);
        }
      }
    }

    let cursor = 0;
    const loadNext = () => {
      if (disposed || cursor >= order.length) return;
      const index = order[cursor++];
      const image = new Image();
      image.src = sequenceFrameSrc(index);
      image
        .decode()
        .then(() => {
          if (disposed) return;
          images[index] = image;
          // Redesenha se o recém-chegado melhora o que está na tela
          const base = Math.floor(current);
          if (
            paintedFrom < 0 ||
            index === base + 1 ||
            Math.abs(index - base) < Math.abs(paintedFrom - base)
          ) {
            paint(true);
          }
        })
        .catch(() => {})
        .finally(loadNext);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    for (let lane = 0; lane < CONCURRENCY; lane++) loadNext();
    const unsubscribe = frame.on("change", wake);

    return () => {
      disposed = true;
      unsubscribe();
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [frame]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className={className} />;
}
