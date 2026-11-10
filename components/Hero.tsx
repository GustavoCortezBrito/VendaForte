'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin, Pause, Play } from 'lucide-react'
import { EASE_OUT } from '@/components/promo/ui'
import { BTN_GHOST, BTN_PRIMARY } from '@/components/site/styles'

/**
 * Abertura da home: a fachada da matriz em Chapecó, de ponta a ponta. A foto carrega primeiro (é
 * ela que conta para a velocidade); o vídeo da mesma fachada, com as nuvens e a folhagem em
 * movimento, entra por cima quando está pronto. Com movimento reduzido, fica só a foto.
 * O texto fica à esquerda, sobre um véu escuro que garante a leitura.
 *
 * Foto e vídeo saíram de public/sede.png pelo Higgsfield (ampliação 4K e Seedance 2.5): o passo a
 * passo está em docs/site/README.md, seção 6.
 */
const HERO_PHOTO = '/fotos/home/fachada.webp'
// ?v= invalida o cache do navegador quando o arquivo é trocado (um vídeo antigo em cache com o novo por cima não decodifica)
const HERO_VIDEO: string | null = '/fotos/home/fachada.mp4?v=3'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
})

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const inView = useInView(ref, { amount: 0.05 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // A fachada desce mais devagar que a página e o texto sobe e some: profundidade sem pesar
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduced || HERO_VIDEO ? '0%' : '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-12%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0])

  // O vídeo só roda quando a abertura está na tela e a pessoa não o pausou (economiza bateria e dá controle)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView && !userPaused) video.play().catch(() => {})
    else video.pause()
  }, [inView, userPaused, videoReady])

  return (
    <section ref={ref} id="home" data-hero="photo" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink lg:items-center">
      {/* Fachada */}
      <motion.div aria-hidden="true" style={{ y: photoY }} className="absolute inset-0 -z-20">
        <div className={`absolute inset-0 ${HERO_VIDEO && !reduced ? '' : 'hero-kenburns'}`}>
          <Image src={HERO_PHOTO} alt="" fill priority sizes="100vw" quality={75} className="object-cover object-[60%_center]" />
          {HERO_VIDEO && !reduced && (
            <video
              ref={videoRef}
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onPlaying={() => setVideoReady(true)}
              onError={() => setVideoReady(false)}
              className={`absolute inset-0 h-full w-full object-cover object-[60%_center] transition-opacity duration-1000 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </motion.div>

      {/* Véus: escuro à esquerda para o texto, base dissolvendo na página, brilho vermelho atrás do título */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ink/45 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/55 to-transparent lg:h-1/2 lg:via-ink/45" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
        <div
          className="absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.22), transparent 65%)' }}
        />
        {!(HERO_VIDEO && !reduced) && <div className="hero-sweep absolute inset-y-0 -left-1/2 w-1/2" />}
      </div>

      <motion.div style={{ y: textY, opacity: textOpacity }} className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 lg:px-8 lg:pb-0 lg:pt-24">
        <div className="max-w-2xl">
          <motion.p {...rise(0.1)} className="text-sm font-semibold text-red-400 lg:text-base lg:text-red-500">
            Grupo Venda Forte · Dealer oficial EP Equipment
          </motion.p>
          <motion.h1
            {...rise(0.2)}
            className="mt-4 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
          >
            Soluções completas em empilhadeiras e equipamentos
          </motion.h1>
          <motion.p {...rise(0.35)} className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
            Venda, locação, peças originais e assistência técnica EP Equipment para Santa Catarina e toda a região Sul.
          </motion.p>
          <motion.div {...rise(0.5)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/#contact" className={BTN_PRIMARY}>
              Peça seu orçamento
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/produtos" className={`${BTN_GHOST} bg-ink/30 backdrop-blur-sm`}>
              Ver catálogo
            </Link>
          </motion.div>
          <motion.div {...rise(0.65)} className="mt-10">
            <p className="flex items-center gap-2 text-sm text-neutral-300">
              <MapPin className="h-4 w-4 text-red-500" aria-hidden="true" />
              Matriz em Chapecó - SC
            </p>
          </motion.div>
        </div>
      </motion.div>

      {HERO_VIDEO && !reduced && videoReady && (
        <button
          type="button"
          onClick={() => setUserPaused((value) => !value)}
          aria-label={userPaused ? 'Reproduzir o vídeo de fundo' : 'Pausar o vídeo de fundo'}
          className="absolute bottom-6 left-6 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-ink/60 text-white backdrop-blur-md transition-colors hover:bg-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:left-8"
        >
          {userPaused ? <Play className="h-4 w-4 fill-current" aria-hidden="true" /> : <Pause className="h-4 w-4 fill-current" aria-hidden="true" />}
        </button>
      )}
    </section>
  )
}
