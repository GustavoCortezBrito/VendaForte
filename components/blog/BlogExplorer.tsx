'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { BlogPostSummary } from '@/lib/blog-format'
import { buildListing, listingTitle, parseBlogPath } from '@/lib/blog-list'
import CategoryFilter from './CategoryFilter'
import FeaturedPost from './FeaturedPost'
import GuideCards, { type Guide } from './GuideCards'
import Pagination from './Pagination'
import PostCard from './PostCard'
import { softNavigate } from './soft-nav'
import { CONTAINER } from './styles'

interface BlogExplorerProps {
  posts: BlogPostSummary[]
  /** Guias por máquina: aparecem só na primeira página da listagem geral. */
  guides: Guide[]
}

/**
 * Altura que o cabeçalho do site e a barra de categorias ocupam no topo. Se a
 * lista começar acima disso, a troca de página a traz de volta para baixo da barra.
 */
const STICKY_OFFSET = 160

/**
 * Filtros, lista e paginação da listagem do blog. O servidor entrega o HTML
 * completo de cada endereço (/blog, /blog/categoria/x, /blog/page/2…), e aqui, no
 * navegador, trocar de categoria ou de página só refaz a lista: a página não
 * volta ao topo, a abertura não muda e o botão Voltar funciona. Categoria e
 * página saem do endereço, que é a única fonte da verdade.
 */
export default function BlogExplorer({ posts, guides }: BlogExplorerProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const resultsRef = useRef<HTMLDivElement>(null)

  const { category: categorySlug, page: requestedPage } = parseBlogPath(pathname)
  const listing = useMemo(
    () => buildListing(posts, categorySlug, requestedPage) ?? buildListing(posts, undefined, 1)!,
    [posts, categorySlug, requestedPage]
  )
  const { categories, category, page, totalPages, featured, items, range } = listing

  // A aba do navegador acompanha a lista, já que o Next não refaz os metadados ao trocar no lugar
  useEffect(() => {
    document.title = listingTitle({ category, page })
  }, [category, page])

  const navigate = useCallback(
    (href: string) => {
      softNavigate(href)
      requestAnimationFrame(() => {
        const results = resultsRef.current
        if (results && results.getBoundingClientRect().top < STICKY_OFFSET) {
          results.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' })
        }
      })
    },
    [reduceMotion]
  )

  const heading = category ? category.name : 'Todos os artigos'
  const countText = `${range.total} ${range.total === 1 ? 'artigo' : 'artigos'}`
  const showGuides = !category && page === 1 && guides.length > 0

  return (
    <>
      <div>
        {/* Cola abaixo do cabeçalho fixo do site (h-20) ao rolar */}
        <div className="sticky top-20 z-20 border-y border-gray-200 bg-white max-sm:has-[[data-open=true]]:z-[70] sm:bg-white/90 sm:backdrop-blur-md">
          <div className={CONTAINER}>
            <CategoryFilter categories={categories} total={posts.length} active={category} onNavigate={navigate} />
          </div>
        </div>

        <section className="bg-gray-50 py-12 lg:py-16" aria-labelledby="artigos">
          <div className={CONTAINER}>
            <div ref={resultsRef} className="mb-8 flex scroll-mt-40 flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 id="artigos" className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {heading}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {countText}
                  {totalPages > 1 && ` · página ${page} de ${totalPages}`}
                </p>
              </div>
            </div>

            {/* Avisa leitores de tela da troca, já que nada na página recarrega */}
            <p role="status" className="sr-only">
              {`${heading}: ${range.from} a ${range.to} de ${range.total} artigos, página ${page} de ${totalPages}.`}
            </p>

            {posts.length === 0 && (
              <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
                Os primeiros artigos estão a caminho.
              </p>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${category?.slug ?? 'todos'}-${page}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              >
                {featured && <FeaturedPost post={featured} />}

                {items.length > 0 && (
                  <ul className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-8' : ''}`}>
                    {items.map((post, position) => (
                      <li key={post.slug}>
                        <PostCard post={post} priority={!featured && position < 3} />
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>

            <Pagination page={page} totalPages={totalPages} category={category?.slug} range={range} onNavigate={navigate} />
          </div>
        </section>
      </div>

      {showGuides && <GuideCards guides={guides} />}
    </>
  )
}
