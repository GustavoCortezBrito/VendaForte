"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

export const SEQUENCE_FPS = 24;
export const SEQUENCE_FRAMES = 145;

export const sequenceFrameSrc = (index: number) =>
  `/promo/sequencia/ds3-${String(index).padStart(3, "0")}.webp`;

/** Quanto do caminho até o quadro alvo é percorrido a cada repaint. */
const EASE = 0.14;
const CONCURRENCY = 6;

interface ScrollSequenceProps {
  /** Índice de quadro, fracionário, já derivado do scroll. */
  frame: MotionValue<number>;
  className?: string;
  label: string;
}

/**
 * Desenha a sequência de quadros num canvas, em modo "cover".
 *
 * O quadro exibido persegue o alvo com suavização, então scroll de roda com
 * saltos grandes vira movimento contínuo. Quadros ainda não baixados são
 * substituídos pelo vizinho carregado mais próximo.
 */
export default function ScrollSequence({ frame, className, label }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const images: (HTMLImageElement | null)[] = new Array(SEQUENCE_FRAMES).fill(null);
    let current = frame.get();
    let painted = -1;
    let raf = 0;
    let disposed = false;

    const clampIndex = (value: number) =>
      Math.min(Math.max(Math.round(value), 0), SEQUENCE_FRAMES - 1);

    const nearestLoaded = (index: number) => {
      for (let offset = 0; offset < SEQUENCE_FRAMES; offset++) {
        if (images[index - offset]) return index - offset;
        if (images[index + offset]) return index + offset;
      }
      return -1;
    };

    const paint = () => {
      const index = nearestLoaded(clampIndex(current));
      if (index < 0 || index === painted) return;
      const image = images[index]!;
      const { width, height } = canvas;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      painted = index;
    };

    const tick = () => {
      const target = frame.get();
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.05) current = target;
      paint();
      raf = current === target ? 0 : requestAnimationFrame(tick);
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
      painted = -1;
      paint();
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
          // Redesenha se o recém-chegado estiver mais perto do alvo que o atual
          const wanted = clampIndex(current);
          if (Math.abs(index - wanted) < Math.abs(painted - wanted) || painted < 0) {
            painted = -1;
            paint();
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
