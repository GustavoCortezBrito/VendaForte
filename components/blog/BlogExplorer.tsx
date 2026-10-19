'use client'

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { blogHref, categoryOf, type BlogPostSummary } from '@/lib/blog-format'
import { buildListing, listingTitle, parseBlogPath, sortSuffix, type SortOrder } from '@/lib/blog-list'
import CategoryTiles from './CategoryTiles'
import FeaturedPost from './FeaturedPost'
import GuideCards, { type Guide } from './GuideCards'
import Pagination from './Pagination'
import PostCard from './PostCard'
import SortToggle from './SortToggle'
import { getServerSort, getSortSnapshot, notifySort, subscribeSort } from './sort-store'
import { softNavigate, isPlainClick } from './soft-nav'
import { CONTAINER } from './styles'

interface BlogExplorerProps {
  posts: BlogPostSummary[]
  /** Guias por máquina: aparecem só na primeira página da listagem geral. */
  guides: Guide[]
}

/** Altura do menu fixo do site: a lista não deve ficar escondida atrás dele. */
const MENU_HEIGHT = 96

/**
 * Filtros, lista e paginação da listagem do blog. O servidor entrega o HTML
 * completo de cada endereço (/blog, /blog/categoria/x, /blog/page/2…), e aqui, no
 * navegador, trocar de categoria ou de página só refaz a lista: a página não
 * volta ao topo, a abertura não muda e o botão Voltar funciona. Categoria e
 * página saem do endereço, e a ordem (mais recentes ou mais antigos) do
 * `?ordem=` dele: o endereço é a única fonte da verdade.
 */
export default function BlogExplorer({ posts, guides }: BlogExplorerProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const resultsRef = useRef<HTMLDivElement>(null)

  const { category: categorySlug, page: requestedPage } = parseBlogPath(pathname)
  const sort = useSyncExternalStore(subscribeSort, getSortSnapshot, getServerSort)
  const suffix = sortSuffix(sort)
  const listing = useMemo(
    () => buildListing(posts, categorySlug, requestedPage, sort) ?? buildListing(posts, undefined, 1, sort)!,
    [posts, categorySlug, requestedPage, sort]
  )
  const { categories, category, page, totalPages, featured, items, range } = listing

  // A aba do navegador acompanha a lista, já que o Next não refaz os metadados ao trocar no lugar
  useEffect(() => {
    document.title = listingTitle({ category, page })
  }, [category, page])

  const navigate = useCallback(
    (href: string) => {
      softNavigate(href)
      notifySort()
      // Depois de trocar, mantém o começo da lista à vista: sobe se ficou atrás do menu
      // (paginação) e desce se ficou fora da tela (escolha de tema, lá em cima)
      requestAnimationFrame(() => {
        const results = resultsRef.current
        if (!results) return
        const top = results.getBoundingClientRect().top
        const behavior = reduceMotion ? 'auto' : 'smooth'
        if (top < MENU_HEIGHT) results.scrollIntoView({ block: 'start', behavior })
        else if (top > window.innerHeight - 200) window.scrollBy({ top: top - window.innerHeight * 0.5, behavior })
      })
    },
    [reduceMotion]
  )

  // Capa de cada tema: a do artigo mais recente dele
  const covers: Record<string, string> = {}
  for (const item of categories) {
    const newest = posts.find((post) => categoryOf(post) === item.name)
    if (newest?.image) covers[item.slug] = newest.image
  }

  const changeSort = (next: SortOrder) => {
    if (next !== sort) navigate(blogHref({ category: category?.slug }) + sortSuffix(next))
  }

  const heading = category ? category.name : 'Todos os artigos'
  const countText = `${range.total} ${range.total === 1 ? 'artigo' : 'artigos'}`
  const showGuides = !category && page === 1 && guides.length > 0

  return (
    <>
      <div>
        <section aria-label="Temas do blog" className="border-b border-gray-100 bg-white pb-8 pt-4 lg:pb-10">
          <div className={CONTAINER}>
            <CategoryTiles categories={categories} total={posts.length} covers={covers} activeSlug={category?.slug} onNavigate={navigate} hrefSuffix={suffix} />
          </div>
        </section>

        <section className="bg-gray-50 py-12 lg:py-16" aria-labelledby="artigos">
          <div className={CONTAINER}>
            <div ref={resultsRef} className="mb-8 flex scroll-mt-28 flex-wrap items-end justify-between gap-x-6 gap-y-4">
              <div>
                <h2 id="artigos" className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {heading}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {countText}
                  {totalPages > 1 && ` · página ${page} de ${totalPages}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {category && (
                  <a
                    href={blogHref() + suffix}
                    onClick={(event) => {
                      if (!isPlainClick(event)) return
                      event.preventDefault()
                      navigate(blogHref() + suffix)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  >
                    Limpar filtro
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {posts.length > 1 && <SortToggle value={sort} onChange={changeSort} />}
              </div>
            </div>

            {/* Avisa leitores de tela da troca, já que nada na página recarrega */}
            <p role="status" className="sr-only">
              {`${heading}, ${sort === 'antigos' ? 'dos mais antigos aos mais recentes' : 'dos mais recentes aos mais antigos'}: ${range.from} a ${range.to} de ${range.total} artigos, página ${page} de ${totalPages}.`}
            </p>

            {posts.length === 0 && (
              <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
                Os primeiros artigos estão a caminho.
              </p>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${category?.slug ?? 'todos'}-${page}-${sort}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              >
                {featured && <FeaturedPost post={featured} label={sort === 'antigos' ? 'Mais antigo' : 'Mais recente'} />}

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

            <Pagination
              page={page}
              totalPages={totalPages}
              category={category?.slug}
              range={range}
              onNavigate={navigate}
              hrefSuffix={suffix}
            />
          </div>
        </section>
      </div>

      {showGuides && <GuideCards guides={guides} />}
    </>
  )
}
