import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** Atraso de entrada de cada bloco, em segundos (animação .rise, em CSS). */
const delay = (seconds: number) => ({ '--delay': `${seconds}s` }) as React.CSSProperties

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Foto de fundo: otimizada e carregada com prioridade (é o maior elemento do primeiro quadro) */}
      <div className="absolute inset-0">
        <Image src="/sede.png" alt="" fill priority sizes="100vw" quality={55} className="object-cover object-center" />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Brilhos de fundo estáticos: no lugar de círculos desfocados e 50 partículas animadas, que custavam JavaScript e pintura */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.16), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(153,27,27,0.16), transparent 70%)' }}
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32 text-center">
        <div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 mt-16 sm:mt-20 md:mt-0"
          >
            <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-red-400 mb-2">
              Grupo Venda Forte
            </span>
            {' '}
            Soluções Completas em
            {' '}
            <span className="block text-red-500 mt-1 sm:mt-2">
              Empilhadeiras e Equipamentos
            </span>
          </h1>
          
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-2 font-normal"
          >
            O <strong className="text-white font-semibold">Grupo Venda Forte</strong> oferece <strong className="text-white font-semibold">soluções completas em empilhadeiras e equipamentos</strong> industriais e autônomos. Como Dealer Oficial da <strong className="text-white font-semibold">EP Equipment</strong>, fornecemos suporte especializado, peças originais e alta tecnologia para otimizar a operação logística em Santa Catarina e toda a região Sul.
          </p>

          <div
            className="rise flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2"
            style={delay(0.2)}
          >
            <Link
              href="/#contact"
              aria-label="Peça seu orçamento personalizado de empilhadeiras"
              title="Solicitar Orçamento de Empilhadeiras"
              className="inline-flex items-center justify-center bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg text-sm sm:text-base lg:text-lg"
            >
              Peça seu Orçamento
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link
              href="/#services"
              aria-label="Conheça nossos produtos e soluções em empilhadeiras"
              title="Ver Soluções e Equipamentos"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all text-sm sm:text-base lg:text-lg"
            >
              Nossos Produtos
            </Link>
          </div>

          {/* Stats */}
          <div
            className="rise grid grid-cols-2 gap-3 sm:gap-6 md:gap-12 mt-10 sm:mt-12 md:mt-16 max-w-xl mx-auto px-2"
            style={delay(0.35)}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">1000+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Equipamentos Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-1 sm:mb-2">20+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 leading-tight">Anos de Experiência</div>
            </div>
          </div>

          {/* Location Badge - Redesigned */}
          <div
            className="rise mt-8 sm:mt-10 md:mt-12 px-2"
            style={delay(0.5)}
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-red-500/30 shadow-xl max-w-full">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white font-bold text-base sm:text-lg">Chapecó - SC</span>
              </div>
              <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/30" />
              <span className="text-white/90 text-xs sm:text-sm text-center sm:text-left">Atendimento em todo Sul do Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
