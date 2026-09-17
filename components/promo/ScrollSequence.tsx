"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { COMPACT_QUERY } from "./promo.config";

/** Larguras em que os quadros existem em AVIF. */
export type FrameWidth = 1280 | 1920 | 2560;

/** Uma sequência de quadros extraída de um vídeo, para desenho controlado pelo scroll. */
export interface FrameSequence {
  frames: number;
  /** Quadro em AVIF, na largura pedida. */
  avif: (index: number, width: FrameWidth) => string;
  /** Quadro em WebP, para navegadores sem AVIF e para pôsteres. */
  webp: (index: number) => string;
}

/**
 * Rigidez com que o quadro exibido persegue o alvo, por segundo. Quanto
 * menor, mais longa a desaceleração depois que o movimento para.
 */
const STIFFNESS = 5;
/** Downloads simultâneos. */
const CONCURRENCY = 6;
/** Decodificações simultâneas, fora da thread principal. */
const DECODERS = 3;
/**
 * Quadros decodificados guardados de uma vez. Um quadro de 2560 × 1440 ocupa
 * cerca de 15 MB decodificado: sem limite, a sequência inteira passaria de 5 GB.
 */
const DECODED_LIMIT = 24;
/** Quadros decodificados à frente, na direção do movimento. */
const LOOKAHEAD = 10;
/**
 * Alturas do canvas, em px reais, que separam os três tamanhos de quadro. O
 * quadro é encaixado pela altura, então é ela que decide: acima de 1150 vale o
 * de 2560; até 800, o de 1280 já cobre a tela sem esticar.
 */
const LARGE_CANVAS = 1150;
const SMALL_CANVAS = 800;
/** Distância da tela em que o palco começa a baixar e mantém quadros decodificados. */
const NEAR_MARGIN = "150% 0px";
/** Densidade máxima do canvas. Acima disso o custo de desenho não compensa. */
const MAX_PIXEL_RATIO = 1.5;
/** Fundo do estúdio nos vídeos, o mesmo `ink` da página. */
const STUDIO_RGB = "13, 13, 13";

// Um download por URL para a página toda: o hero e o visualizador da DS3 usam os
// mesmos quadros. Guarda só o arquivo comprimido, que é pequeno.
const blobs = new Map<string, Promise<Blob>>();

function fetchBlob(url: string): Promise<Blob> {
  let pending = blobs.get(url);
  if (!pending) {
    pending = fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      return response.blob();
    });
    pending.catch(() => blobs.delete(url));
    blobs.set(url, pending);
  }
  return pending;
}

// Testado uma vez, com um quadro de verdade, e compartilhado entre as sequências
let avifSupport: Promise<boolean> | null = null;

function supportsAvif(sample: string): Promise<boolean> {
  avifSupport ??= fetchBlob(sample)
    .then((blob) => createImageBitmap(blob))
    .then(
      (bitmap) => {
        bitmap.close();
        return true;
      },
      () => false
    );
  return avifSupport;
}

interface ScrollSequenceProps {
  sequence: FrameSequence;
  /** Índice de quadro, fracionário. Em `loop`, pode passar do fim ou ficar negativo. */
  frame: MotionValue<number>;
  /** O último quadro emenda no primeiro, como num giro de 360°. */
  loop?: boolean;
  /** Chamado a cada desenho com a posição exibida, já dentro de `[0, frames)`. */
  onPaint?: (position: number) => void;
  /** Multiplica a densidade do canvas, para quando ele é ampliado por CSS. */
  density?: number;
  className?: string;
  label: string;
}

/**
 * Desenha a sequência de quadros num canvas, encaixada pela altura.
 *
 * O quadro exibido persegue o alvo com amortecimento e, entre dois quadros
 * vizinhos, desenha a mistura dos dois na proporção da fração. Assim o
 * movimento não anda em degraus nem para seco.
 *
 * Os quadros só começam a baixar perto da tela, em AVIF e na largura que o
 * canvas pede. Ficam guardados comprimidos; decodificados, só os próximos da
 * posição atual, e nenhum quando o palco está longe da tela. Enquanto um quadro
 * não está pronto, o vizinho decodificado mais próximo ocupa o lugar.
 */
export default function ScrollSequence({
  sequence,
  frame,
  loop = false,
  onPaint,
  density = 1,
  className,
  label,
}: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Guardado em ref para trocar o callback sem reiniciar o carregamento
  const onPaintRef = useRef(onPaint);
  useEffect(() => {
    onPaintRef.current = onPaint;
  }, [onPaint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const total = sequence.frames;
    const lastIndex = total - 1;
    const wrap = (index: number) => ((index % total) + total) % total;
    /** Índice válido, ou -1 fora da sequência. */
    const normalize = (index: number) =>
      loop ? wrap(index) : index < 0 || index > lastIndex ? -1 : index;
    const distance = (a: number, b: number) => {
      const gap = Math.abs(a - b);
      return loop ? Math.min(gap, total - gap) : gap;
    };
    const clampTarget = (value: number) => (loop ? value : Math.min(Math.max(value, 0), lastIndex));
    const positionOf = (value: number) => (loop ? wrap(value) : value);

    const files: (Blob | null)[] = new Array(total).fill(null);
    const decoded = new Map<number, ImageBitmap>();
    const decoding = new Set<number>();

    let current = clampTarget(frame.get());
    let direction = 1;
    let painted = Number.NaN;
    let paintedFrom = -1;
    let raf = 0;
    let previousTime = 0;
    let disposed = false;
    let near = false;
    let started = false;
    let url = (index: number) => sequence.webp(index);

    const nearestDecoded = (index: number) => {
      let best = -1;
      let bestDistance = Infinity;
      for (const key of decoded.keys()) {
        const gap = distance(key, index);
        if (gap < bestDistance) {
          best = key;
          bestDistance = gap;
        }
      }
      return best;
    };

    const paint = (force = false) => {
      const position = positionOf(current);
      if (!force && Math.abs(position - painted) < 0.001) return;

      const base = Math.floor(position);
      const from = nearestDecoded(base);
      if (from < 0) return;
      // Só mistura com o vizinho exato; um quadro distante borraria o movimento
      const next = normalize(base + 1);
      const to = from === base && next >= 0 && decoded.has(next) ? next : -1;
      const mix = position - base;

      const { width, height } = canvas;
      const image = decoded.get(from)!;
      // Encaixa pela altura para a máquina nunca ser cortada. Em tela mais larga
      // que o quadro, as laterais recebem a cor do estúdio e a borda se dissolve.
      const drawWidth = image.width * (height / image.height);
      const x = (width - drawWidth) / 2;

      ctx.globalAlpha = 1;
      if (x > 0) {
        ctx.fillStyle = `rgb(${STUDIO_RGB})`;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(image, x, 0, drawWidth, height);

      if (to >= 0 && mix > 0.01) {
        ctx.globalAlpha = mix;
        ctx.drawImage(decoded.get(to)!, x, 0, drawWidth, height);
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

      painted = position;
      paintedFrom = from;
      onPaintRef.current?.(position);
    };

    /** Libera os decodificados mais distantes da posição até caber no limite. */
    const evict = (keep: number) => {
      while (decoded.size > DECODED_LIMIT) {
        let farthest = -1;
        let farthestDistance = -1;
        for (const key of decoded.keys()) {
          const gap = distance(key, keep);
          if (gap > farthestDistance) {
            farthest = key;
            farthestDistance = gap;
          }
        }
        decoded.get(farthest)?.close();
        decoded.delete(farthest);
      }
    };

    const releaseAll = () => {
      decoded.forEach((bitmap) => bitmap.close());
      decoded.clear();
      paintedFrom = -1;
      painted = Number.NaN;
    };

    const decode = (index: number) => {
      const file = files[index];
      if (!file) return;
      decoding.add(index);
      createImageBitmap(file)
        .then((bitmap) => {
          if (disposed || !near) {
            bitmap.close();
            return;
          }
          decoded.get(index)?.close();
          decoded.set(index, bitmap);
          const base = Math.floor(positionOf(current));
          evict(base);
          // Redesenha se o recém-chegado melhora o que está na tela
          if (
            paintedFrom < 0 ||
            index === normalize(base + 1) ||
            distance(index, base) < distance(paintedFrom, base)
          ) {
            paint(true);
          }
        })
        .catch(() => {})
        .finally(() => {
          decoding.delete(index);
          schedule();
        });
    };

    /** Decodifica o quadro atual, o seguinte e alguns à frente no sentido do movimento. */
    const schedule = () => {
      if (!near || disposed) return;
      const base = Math.floor(positionOf(current));
      const wanted = [base, base + 1];
      for (let step = 1; step <= LOOKAHEAD; step++) wanted.push(base + direction * (step + 1));
      wanted.push(base - direction, base - direction * 2);

      for (const raw of wanted) {
        if (decoding.size >= DECODERS) return;
        const index = normalize(raw);
        if (index < 0 || decoded.has(index) || decoding.has(index) || !files[index]) continue;
        decode(index);
      }

      // No começo, antes de os vizinhos baixarem: qualquer quadro próximo serve
      if (decoded.size === 0 && decoding.size === 0) {
        let closest = -1;
        for (let index = 0; index < total; index++) {
          if (files[index] && (closest < 0 || distance(index, base) < distance(closest, base))) {
            closest = index;
          }
        }
        if (closest >= 0) decode(closest);
      }
    };

    // Amortecimento pelo tempo real, não por repaint: a desaceleração tem a
    // mesma duração em monitores de 60 Hz e de 144 Hz.
    const tick = (time: number) => {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
      previousTime = time;
      const target = clampTarget(frame.get());
      if (target !== current) direction = target > current ? 1 : -1;
      current += (target - current) * (1 - Math.exp(-STIFFNESS * dt));
      if (Math.abs(target - current) < 0.002) current = target;
      paint();
      schedule();
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
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO) * density;
      // Tamanho de layout, sem transformações: uma ampliação por CSS não muda a medida
      canvas.width = Math.round(canvas.offsetWidth * ratio);
      canvas.height = Math.round(canvas.offsetHeight * ratio);
      ctx.imageSmoothingQuality = "high";
      paint(true);
    };

    const start = async () => {
      started = true;
      // Em tela pequena todos os palcos e o visualizador 360° pedem o mesmo
      // tamanho: os arquivos da DS3 servem ao hero e ao visualizador sem baixar
      // duas vezes, e 1080 px de altura cobrem a tela do celular sem esticar.
      const width: FrameWidth = window.matchMedia(COMPACT_QUERY).matches
        ? 1920
        : canvas.height > LARGE_CANVAS
          ? 2560
          : canvas.height > SMALL_CANVAS
            ? 1920
            : 1280;
      if (await supportsAvif(sequence.avif(0, width))) {
        url = (index) => sequence.avif(index, width);
      }
      if (disposed) return;

      // Primeiro o quadro da posição atual e o último, depois a sequência em
      // passadas cada vez mais finas: o movimento funciona, grosseiro, muito antes
      // de tudo baixar.
      const first = normalize(Math.round(positionOf(current)));
      const order = [Math.max(first, 0)];
      const queued = new Set(order);
      if (!queued.has(lastIndex)) {
        order.push(lastIndex);
        queued.add(lastIndex);
      }
      for (let stride = 32; stride >= 1; stride /= 2) {
        for (let index = 0; index < total; index += stride) {
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
        fetchBlob(url(index))
          .then((file) => {
            if (disposed) return;
            files[index] = file;
            schedule();
          })
          .catch(() => {})
          .finally(loadNext);
      };
      for (let lane = 0; lane < CONCURRENCY; lane++) loadNext();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    // Longe da tela o palco não baixa nada e não segura memória decodificada
    const visibility = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) {
          if (!started) void start();
          schedule();
          wake();
        } else {
          releaseAll();
        }
      },
      { rootMargin: NEAR_MARGIN }
    );
    visibility.observe(canvas);

    const unsubscribe = frame.on("change", wake);

    return () => {
      disposed = true;
      unsubscribe();
      observer.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(raf);
      releaseAll();
    };
  }, [frame, sequence, loop, density]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className={className} />;
}
