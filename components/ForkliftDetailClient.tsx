'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Check, 
  Truck, 
  ZoomIn,
  Ruler,
  Battery,
  Settings,
  Scale,
  ArrowUpFromLine,
  SlidersHorizontal
} from 'lucide-react'
import ImageLightboxModal from '@/components/ImageLightboxModal'
import type { CatalogItem, ForkliftProduct } from '@/lib/catalog'
import { energyLabel } from '@/lib/catalog'
import { formatLift } from '@/lib/product-seo'
import { getOrganizedSpecs, FormattedSpecGroup } from '@/lib/utils/specs-formatter'

interface Props {
  product: ForkliftProduct
  /** Modelos do mesmo tipo com capacidade próxima. */
  relatedProducts: CatalogItem[]
  /** Página do tipo do modelo; o único modelo "especial/VNA" não tem. */
  typeLink?: { href: string; label: string }
  /** Parágrafos de abertura montados com os dados do modelo. */
  intro: string[]
  /** Post do blog que explica a ficha deste modelo, se já estiver no ar. */
  guide?: { href: string; label: string }
}

export default function ForkliftDetailClient({ product, relatedProducts, typeLink, intro, guide }: Props) {
  const [activeImage, setActiveImage] = useState(product.mainImage)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSpecTab, setActiveSpecTab] = useState<string>('all')
  const phoneNumber = '+5549988395635'

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsAppQuote = () => {
    const message = `Olá! Gostaria de solicitar uma cotação e ficha técnica oficial do equipamento EP: ${product.title} (${product.capacity}).`
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const allImages = Array.from(new Set([product.mainImage, ...(product.galleryImages || [])])).filter(
    (img): img is string => Boolean(img) && !img.includes('/thumbnail/')
  )

  const organizedSpecs = useMemo(() => {
    return getOrganizedSpecs(product.specs || {})
  }, [product.specs])

  const totalSpecsCount = useMemo(() => {
    return organizedSpecs.reduce((acc, g) => acc + g.items.length, 0)
  }, [organizedSpecs])

  const displayedGroups = useMemo(() => {
    if (activeSpecTab === 'all') return organizedSpecs
    return organizedSpecs.filter(g => g.id === activeSpecTab)
  }, [organizedSpecs, activeSpecTab])

  const getGroupIcon = (iconName: FormattedSpecGroup['iconName']) => {
    switch (iconName) {
      case 'Zap':
        return <Zap size={18} className="text-red-500" />
      case 'Ruler':
        return <Ruler size={18} className="text-red-500" />
      case 'Battery':
        return <Battery size={18} className="text-red-500" />
      case 'Truck':
        return <Truck size={18} className="text-red-500" />
      default:
        return <Settings size={18} className="text-neutral-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink via-ink to-ink text-white pt-24 pb-20 font-sans">
      
      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 font-medium">
          <Link href="/" className="hover:text-red-400 transition-colors">Início</Link>
          <ChevronRight size={14} className="text-neutral-500" />
          <Link href="/produtos" className="hover:text-red-400 transition-colors">Produtos</Link>
          <ChevronRight size={14} className="text-neutral-500" />
          {typeLink && (
            <>
              <Link href={typeLink.href} className="hover:text-red-400 transition-colors">{typeLink.label}</Link>
              <ChevronRight size={14} className="text-neutral-500" />
            </>
          )}
          <span className="text-white font-bold">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[4/3] bg-white rounded-[28px] p-4 sm:p-6 flex items-center justify-center overflow-hidden cursor-zoom-in group/mainimg"
              style={{ isolation: 'isolate' }}
              title="Clique para ampliar a imagem"
            >
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span className="px-3.5 py-1 bg-red-600 font-bold text-white text-xs rounded-md">
                  {product.specs?.Drive === 'Diesel' ? 'Diesel' : `${product.batteryVoltage} ${/chumbo/i.test(product.batteryType) ? 'Chumbo-ácido' : 'Li-Ion'}`}
                </span>
                <span className="px-3.5 py-1 bg-ink-raised font-bold text-neutral-300 text-xs rounded-md border border-white/10">
                  {product.type}
                </span>
              </div>

              {/* Fotos reais (arquivos locais) preenchem o quadro; os recortes do catálogo ficam inteiros sobre o fundo claro */}
              <Image
                src={activeImage}
                alt={`${product.type} EP ${product.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={`transition-transform duration-300 group-hover/mainimg:scale-105 ${
                  activeImage.startsWith('/') ? 'object-cover' : 'object-contain p-4 sm:p-6 drop-shadow-md'
                }`}
                style={activeImage.startsWith('/') ? undefined : { mixBlendMode: 'multiply' }}
              />

              {/* Badge de zoom ao passar o mouse */}
              <div className="absolute bottom-4 right-4 bg-ink/80 hover:bg-white/10 text-white text-xs font-bold px-3.5 py-2 rounded-full backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover/mainimg:opacity-100 transition-all duration-300">
                <ZoomIn size={15} className="text-red-400" />
                <span>Clique para ampliar</span>
              </div>
            </div>

            {/* Thumbnails list */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-xl bg-white border flex-shrink-0 ${img.startsWith('/') ? 'p-0.5' : 'p-2'} overflow-hidden transition-all ${
                      activeImage === img
                        ? 'border-red-600 ring-2 ring-red-600/30'
                        : 'border-white/10 hover:border-white/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Foto ${i + 1} da EP ${product.title}`}
                      fill
                      sizes="80px"
                      className={img.startsWith('/') ? 'object-cover rounded-lg' : 'object-contain p-2'}
                      style={img.startsWith('/') ? undefined : { mixBlendMode: 'multiply' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Highlights Grid */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-neutral-400 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-red-500" />
                Destaques & Diferenciais do Equipamento
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.highlights.map((h, idx) => (
                  <div key={idx} className="bg-ink-raised border border-white/10 rounded-2xl p-4">
                    <h4 className="font-bold text-white text-sm mb-1">{h.title.replace(/ EP$/i, '')}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-normal">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Prominent Quote Action Box */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            
            <div>
              {/* Header Badge & Share */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-sm font-semibold text-red-500">Dealer oficial EP Equipment</span>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 font-bold transition-colors"
                  title="Compartilhar link deste equipamento"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                  <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl">
                {product.title}
              </h1>

              <p className="mb-5 mt-3 text-base font-medium text-neutral-300 sm:text-lg">
                {product.subtitle.replace(/^Empilhadeira Elétrica EP /i, 'Empilhadeira Elétrica ')}
              </p>

              <div className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal mb-6 space-y-3">
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {guide && (
                  <p>
                    <Link href={guide.href} className="font-bold text-red-500 hover:underline">
                      {guide.label}
                    </Link>
                  </p>
                )}
              </div>

              {/* Specs Cards Bar */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-ink-raised border border-white/10 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                    <Scale size={12} className="text-red-500" />
                    <span>Capacidade Nominal</span>
                  </div>
                  <span className="text-lg font-bold text-white mt-0.5 block">{product.capacity}</span>
                </div>
                <div className="bg-ink-raised border border-white/10 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                    <ArrowUpFromLine size={12} className="text-red-500" />
                    <span>Elevação Máxima</span>
                  </div>
                  <span className="text-lg font-bold text-white mt-0.5 block">{product.liftingHeight}</span>
                </div>
                <div className="bg-ink-raised border border-white/10 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                    <Zap size={12} className="text-red-500" />
                    <span>{product.specs?.Drive === 'Diesel' ? 'Acionamento' : 'Sistema de Bateria'}</span>
                  </div>
                  <span className="text-lg font-bold text-red-500 mt-0.5 block">{product.specs?.Drive === 'Diesel' ? 'Motor a diesel' : `${product.batteryVoltage} ${/chumbo/i.test(product.batteryType) ? 'Chumbo-ácido' : 'Lítio'}`}</span>
                </div>
                <div className="bg-ink-raised border border-white/10 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                    <SlidersHorizontal size={12} className="text-red-500" />
                    <span>Raio de Giro</span>
                  </div>
                  <span className="text-lg font-bold text-white mt-0.5 block">{product.turningRadius}</span>
                </div>
              </div>

              {/* Original Clean White CTA Box - Placed right here for immediate visibility */}
              <div className="bg-ink-raised border border-white/10 rounded-[28px] p-6 space-y-4 mb-6">
                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Solicitar Cotação no WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-red-500" />
                    Garantia Oficial EP Equipment
                  </span>
                  <span>Entrega para SC • PR • RS</span>
                </div>
              </div>

              {/* Recommended Applications */}
              <div className="bg-ink-raised border border-white/10 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-neutral-400 mb-3">
                  Aplicações Recomendadas:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium">
                  {product.applications.map((app, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-red-500 flex-shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* ORGANIZED & TRANSLATED SPECIFICATIONS SECTION */}
        {organizedSpecs.length > 0 && (
          <div className="mt-14 bg-ink-raised border border-white/10 rounded-[28px] p-6 sm:p-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <p className="mb-4 text-sm font-semibold text-red-500">Ficha técnica oficial</p>
                <h2 className="text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl">
                  Especificações completas ({product.title})
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Dados técnicos certificados segundo as normas industriais da EP Equipment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-300 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl shadow-2xs">
                  {totalSpecsCount} especificações detalhadas
                </span>
              </div>
            </div>

            {/* Category Filter Tabs for Specs */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setActiveSpecTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  activeSpecTab === 'all'
                    ? 'bg-ink-raised text-white border-white'
                    : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                }`}
              >
                Todas as Categorias ({totalSpecsCount})
              </button>

              {organizedSpecs.map(group => (
                <button
                  key={group.id}
                  onClick={() => setActiveSpecTab(group.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                    activeSpecTab === group.id
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {getGroupIcon(group.iconName)}
                  <span>{group.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    activeSpecTab === group.id ? 'bg-white/25 text-white' : 'bg-white/15 text-neutral-400'
                  }`}>
                    {group.items.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Spec Groups Container */}
            <div className="mt-8 space-y-8">
              {displayedGroups.map(group => (
                <div key={group.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  
                  {/* Group Header */}
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                    <div className="p-2 rounded-xl bg-ink-raised border border-white/10 shadow-2xs">
                      {getGroupIcon(group.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base sm:text-lg">
                        {group.title}
                      </h3>
                      <span className="text-[11px] font-medium text-neutral-400">
                        {group.items.length} parâmetros técnicos
                      </span>
                    </div>
                  </div>

                  {/* Specs Table Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {group.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 rounded-xl bg-ink-raised border border-white/10 shadow-2xs hover:border-red-500/25 transition-colors gap-1 text-xs sm:text-sm"
                      >
                        <span className="text-neutral-400 font-semibold text-xs sm:text-xs">
                          {item.label}
                        </span>
                        <span className="text-white font-bold text-xs sm:text-xs sm:text-right shrink-0">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {relatedProducts.length > 0 && (
          <section aria-labelledby="mais-da-linha" className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="mais-da-linha" className="text-2xl font-bold tracking-tight text-white">
                Mais modelos desta linha
              </h2>
              {typeLink && (
                <Link href={typeLink.href} className="text-sm font-bold text-red-500 hover:underline">
                  Ver todas: {typeLink.label.toLowerCase()}
                </Link>
              )}
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/produtos/${item.slug}`}
                    className="block h-full rounded-2xl border border-white/10 bg-ink-raised p-4 transition-colors hover:border-red-500/30"
                  >
                    <span className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-xl bg-white">
                      <Image
                        src={item.mainImage}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 45vw, 260px"
                        loading="lazy"
                        className="object-contain p-3"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </span>
                    <span className="block font-bold text-white">EP {item.title}</span>
                    <span className="mt-1 block text-xs text-neutral-400">
                      {item.capacity} · {formatLift(item.liftingHeight)} · {energyLabel({ batteryVoltage: item.batteryVoltage, batteryType: item.batteryType, specs: { Drive: item.drive } })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

      </section>

      {/* Lightbox Modal para Visualização em Alta Resolução */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc={activeImage}
        title={product.title}
        subtitle={product.subtitle}
        capacity={product.capacity}
        liftingHeight={product.liftingHeight}
        batteryVoltage={product.batteryVoltage}
        slug={product.slug}
      />
    </div>
  )
}
