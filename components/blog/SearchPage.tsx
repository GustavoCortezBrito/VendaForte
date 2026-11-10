'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, SearchX } from 'lucide-react'
import type { BlogPostSummary, CategoryInfo } from '@/lib/blog-format'
import { searchPosts } from '@/lib/blog-search'
import BlogHeader from './BlogHeader'
import BlogSearch from './BlogSearch'
import PostCard from './PostCard'
import { BTN_LINE, CONTAINER } from './styles'

interface SearchPageProps {
  posts: BlogPostSummary[]
  categories: CategoryInfo[]
}

/**
 * Página de resultados da busca (/blog/busca?q=…). A busca roda no navegador
 * sobre a lista de posts que o servidor já entregou, então o resultado é
 * instantâneo e não pede nenhuma chamada extra.
 */
export default function SearchPage({ posts, categories }: SearchPageProps) {
  const query = (useSearchParams().get('q') ?? '').trim()
  const results = useMemo(() => searchPosts(posts, query), [posts, query])

  return (
    <div className="bg-ink-raised">
      <BlogHeader
        eyebrow="Busca"
        title={query ? <>Resultados para <span className="text-red-500">“{query}”</span></> : 'Buscar no blog'}
        intro={
          query
            ? results.length === 0
              ? 'Nenhum artigo encontrado.'
              : `${results.length} ${results.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}.`
            : 'Digite um assunto, uma máquina ou um termo da ficha técnica.'
        }
      >
        <div className="mx-auto mt-9 max-w-2xl">
          {/* `key` recria o campo quando a busca muda por link ou pelo botão Voltar */}
          <BlogSearch key={query} index={posts} initialQuery={query} />
        </div>
      </BlogHeader>

      <section className="min-h-[40vh] bg-ink py-12 lg:py-16" aria-label="Resultados da busca">
        <div className={CONTAINER}>
          {results.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, position) => (
                <li key={post.slug}>
                  <PostCard post={post} priority={position < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-ink-raised p-10 text-center">
              <SearchX className="mx-auto h-10 w-10 text-neutral-400" aria-hidden="true" />
              <p className="mt-4 text-xl font-bold text-white">
                {query ? 'Nada por aqui' : 'Comece pela busca acima'}
              </p>
              <p className="mt-2 text-neutral-400">
                {query ? 'Tente outro termo ou navegue pelas categorias:' : 'Ou navegue pelas categorias:'}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/blog/categoria/${category.slug}`}
                      className="inline-flex rounded-full border border-white/10 bg-ink-raised px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-300"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/blog" className={BTN_LINE}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
