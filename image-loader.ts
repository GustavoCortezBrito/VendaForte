'use client'

/**
 * Carregador de imagens do site (next.config.ts, images.loaderFile).
 *
 * - Imagem do próprio site (/fotos/..., /blog/..., /promo/...): usa a versão pré-gerada por
 *   scripts/gen-images.mjs em /_img/<largura>/..., servida como arquivo estático. Não passa pelo
 *   otimizador da Vercel, então não gasta a cota de transformações.
 * - Catálogo da EP (cdn.ep-portal.net): já é WebP leve (cerca de 60 KB), servido direto da CDN deles.
 * - Outras de fora (Supabase): continuam no otimizador do Next (/_next/image).
 * - SVG, GIF e ícones: sem mudança.
 */

// Precisa ser igual a WIDTHS em scripts/gen-images.mjs e a images.deviceSizes/imageSizes em next.config.ts
const WIDTHS = [384, 640, 1080, 1920]

const snap = (width: number) => WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1]

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (/^https?:\/\/cdn\.ep-portal\.net\//.test(src)) return src

  if (/^https?:\/\//.test(src)) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${snap(width)}&q=${quality || 75}`
  }

  const [path] = src.split('?')
  const dot = path.lastIndexOf('.')
  const ext = dot === -1 ? '' : path.slice(dot).toLowerCase()
  if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext) || !path.startsWith('/')) return src

  return `/_img/${snap(width)}${path.slice(0, dot)}.webp`
}
