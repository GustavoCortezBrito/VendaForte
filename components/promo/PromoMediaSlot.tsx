"use client";

import Image from "next/image";
import { ImageIcon, Video } from "lucide-react";
import { MEDIA, type MediaAsset } from "./promo.config";

/**
 * Slot de mídia da campanha.
 *
 * Enquanto o arquivo final não existir, renderiza um marcador com o caminho de
 * destino e a especificação de produção. Assim a página fica completa e navegável
 * antes das peças ficarem prontas, e nenhum componente quebra por arquivo ausente.
 *
 * Para publicar uma peça, preencha o `src` do registro em `promo.config.ts`.
 */

interface PromoMediaSlotProps {
  /** Chave do registro `MEDIA` em `promo.config.ts`. */
  media: keyof typeof MEDIA;
  /** Classe aplicada ao contêiner. Deve definir a proporção ou a altura. */
  className?: string;
  /** Classe aplicada à imagem quando ela existe. */
  imageClassName?: string;
  sizes?: string;
  /** Marca a imagem como candidata a LCP. */
  preload?: boolean;
  /** `contain` preserva o recorte do produto, `cover` preenche o quadro. */
  fit?: "contain" | "cover";
  /** Esconde a legenda do slot quando o espaço é muito pequeno. */
  compact?: boolean;
}

export default function PromoMediaSlot({
  media,
  className = "",
  imageClassName = "",
  sizes = "100vw",
  preload = false,
  fit = "cover",
  compact = false,
}: PromoMediaSlotProps) {
  const asset: MediaAsset = MEDIA[media];

  // O Tailwind emite `.relative` depois de `.absolute`, então um `relative` fixo
  // aqui venceria o `absolute` vindo de quem chama e tiraria o slot do
  // posicionamento pretendido. `absolute` já serve de bloco de contenção para o
  // `fill` do next/image, então só entra `relative` quando não há posição dada.
  const position = /(?:^|\s)(?:absolute|fixed|sticky|static)(?:\s|$)/.test(className)
    ? ""
    : "relative";

  if (asset.src) {
    return (
      <div className={`${position} overflow-hidden ${className}`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          className={`${fit === "contain" ? "object-contain" : "object-cover"} ${imageClassName}`}
          {...(preload ? { preload: true } : {})}
        />
      </div>
    );
  }

  const Icon = asset.kind === "video" ? Video : ImageIcon;

  return (
    <div
      className={`${position} overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.02] ${className}`}
      data-media-slot={asset.file}
    >
      {/* Hachura diagonal discreta, para o slot não ser confundido com erro */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 10px)",
        }}
      />

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <Icon className="h-5 w-5 text-orange-400/70" />
        {!compact && (
          <>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-400/80">
              Slot de {asset.kind === "video" ? "vídeo" : "imagem"}
            </div>
            <div className="text-sm font-medium text-neutral-300">{asset.label}</div>
            <div className="font-mono text-[10px] leading-relaxed text-neutral-500">
              {asset.file}
              <br />
              {asset.spec}
            </div>
          </>
        )}
        {compact && (
          <div className="font-mono text-[10px] leading-tight text-neutral-500">
            {asset.label}
          </div>
        )}
      </div>
    </div>
  );
}

/** Indica se a peça final já foi entregue. Útil para variar o layout. */
export function hasMedia(media: keyof typeof MEDIA): boolean {
  return MEDIA[media].src !== null;
}
