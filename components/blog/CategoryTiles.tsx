'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LayoutGrid } from 'lucide-react'
import { blogHref, type CategoryInfo } from '@/lib/blog-format'
import { useReducedMotion } from 'framer-motion'
import PostImage from './PostImage'
import { isPlainClick } from './soft-nav'

interface CategoryTilesProps {
  categories: CategoryInfo[]
  /** Total de artigos, para o cartão "Todos". */
  total: number
  /** Capa da categoria: a do artigo mais recente dela. */
  covers: Record<string, string>
  /** Categoria aberta, ou nenhuma na listagem geral. */
  activeSlug?: string
  /** Troca de categoria no lugar. Sem ele, os links recarregam a página normalmente. */
  onNavigate?: (href: string) => void
}

const TILE =
  'group relative block h-32 w-44 shrink-0 snap-start overflow-hidden rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:h-40 sm:w-64'

/**
 * "Explore por tema": uma fileira de cartões com a capa de cada categoria, no
 * lugar de abas ou menus. Todas as categorias ficam à vista (a fileira rola
 * com o dedo, o mouse ou as setas), a escolhida ganha contorno vermelho e um
 * visto, e o clique troca a lista no lugar. São links comuns para páginas
 * próprias (/blog/categoria/…), então funcionam sem JavaScript e o Google os
 * encontra.
 */
export default function CategoryTiles({ categories, total, covers, activeSlug, onNavigate }: CategoryTilesProps) {
  const reduceMotion = useReducedMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      observer.disconnect()
    }
  }, [updateEdges])

  // A categoria aberta fica no centro da fileira (só rola a fileira, nunca a página)
  useEffect(() => {
    const el = scrollerRef.current
    const current = el?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!el || !current) return
    const box = el.getBoundingClientRect()
    const tile = current.getBoundingClientRect()
    el.scrollTo({
      left: el.scrollLeft + (tile.left - box.left) - (box.width - tile.width) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [activeSlug, reduceMotion])

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const click = (slug: string | undefined, active: boolean) => (event: React.MouseEvent) => {
    if (!onNavigate || !isPlainClick(event)) return
    event.preventDefault()
    if (!active) onNavigate(blogHref({ category: slug }))
  }

  const arrow =
    'hidden h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white sm:grid'

  const allActive = !activeSlug

  return (
    <nav aria-label="Explorar por tema">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Explore por tema</p>
        <div className="flex gap-2">
          <button type="button" aria-label="Temas anteriores" disabled={edge.start} onClick={() => scrollBy(-1)} className={arrow}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Próximos temas" disabled={edge.end} onClick={() => scrollBy(1)} className={arrow}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* O respiro (p-2 -m-2) deixa o contorno e a sombra dos cartões aparecerem sem serem cortados */}
      <div
        ref={scrollerRef}
        className="-m-2 flex snap-x gap-3 overflow-x-auto scroll-smooth p-2 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        <a
          href={blogHref()}
          aria-current={allActive ? 'page' : undefined}
          onClick={click(undefined, allActive)}
          className={`${TILE} bg-gradient-to-br from-ink via-gray-900 to-red-900 text-white ${
            allActive ? 'ring-2 ring-red-600 ring-offset-2' : 'hover:-translate-y-0.5 hover:shadow-xl'
          }`}
        >
          <LayoutGrid className="absolute left-4 top-4 h-6 w-6 text-red-400" aria-hidden="true" />
          <span className="absolute inset-x-0 bottom-0 p-4">
            <span className="block text-base font-extrabold leading-tight">Todos os temas</span>
            <span className="mt-0.5 block text-xs font-semibold text-white/70">{total} artigos</span>
          </span>
          {allActive && <Badge />}
        </a>

        {categories.map((category) => {
          const active = category.slug === activeSlug
          const cover = covers[category.slug]
          return (
            <a
              key={category.slug}
              href={blogHref({ category: category.slug })}
              aria-current={active ? 'page' : undefined}
              onClick={click(category.slug, active)}
              className={`${TILE} bg-ink ${active ? 'ring-2 ring-red-600 ring-offset-2' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
            >
              {cover && (
                <PostImage
                  src={cover}
                  alt=""
                  sizes="256px"
                  className="transition-transform duration-500 ease-out group-hover:scale-110"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-transparent transition-opacity group-hover:opacity-80"
              />
              <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="block text-base font-extrabold leading-tight">{category.name}</span>
                <span className="mt-0.5 block text-xs font-semibold text-white/70">
                  {category.count} {category.count === 1 ? 'artigo' : 'artigos'}
                </span>
              </span>
              {active && <Badge />}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

/** Visto no canto do cartão escolhido. */
function Badge() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white shadow-lg"
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  )
}
