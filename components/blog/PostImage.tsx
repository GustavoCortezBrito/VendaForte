import Image from 'next/image'
import { canOptimizeImage, isStudioProductShot } from '@/lib/blog-format'

interface PostImageProps {
  src: string
  alt: string
  sizes: string
  /** Primeira imagem da página: carrega antes das demais. */
  priority?: boolean
  className?: string
}

/**
 * Imagem de capa que preenche o contêiner pai (que precisa ser `relative` e ter
 * proporção definida). Hosts fora de `next.config.ts` não passam pelo
 * otimizador, porque o `next/image` lançaria erro neles.
 */
export default function PostImage({ src, alt, sizes, priority = false, className = '' }: PostImageProps) {
  const classes = `object-cover ${className}`

  // Fotos do catálogo da EP têm fundo branco e a máquina centralizada: cortadas
  // em 16:9 perdem o topo, então aparecem inteiras sobre um painel claro.
  if (isStudioProductShot(src)) {
    return (
      <div className="absolute inset-0 bg-neutral-100">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-contain p-4 ${className}`} />
      </div>
    )
  }

  if (canOptimizeImage(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={classes} />
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} className={`absolute inset-0 h-full w-full ${classes}`} />
}
