'use client'

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CornerDownLeft, Search, SearchX, TrendingUp, X } from 'lucide-react'
import { categoryOf } from '@/lib/blog-format'
import { highlightRanges, queryTerms, searchPosts, type SearchEntry } from '@/lib/blog-search'

/** Sugestões exibidas antes de "ver todos os resultados". */
const MAX_SUGGESTIONS = 6

/** Buscas sugeridas com o campo vazio: as três máquinas e os temas dos guias do blog. */
const POPULAR = ['DS3', 'F4', 'EFL302 B3', 'Lítio', 'Câmara fria', 'NR-11', 'Retrátil', 'Capacidade', 'TCO']

/** Texto com os trechos que bateram com a busca em destaque. */
function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const ranges = highlightRanges(text, terms)
  if (ranges.length === 0) return <>{text}</>

  const parts: ReactNode[] = []
  let cursor = 0
  ranges.forEach(([start, end], index) => {
    if (start > cursor) parts.push(text.slice(cursor, start))
    parts.push(
      <mark key={index} className="rounded-sm bg-red-100 px-0.5 text-red-900">
        {text.slice(start, end)}
      </mark>
    )
    cursor = end
  })
  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts}</>
}

interface BlogSearchProps {
  index: SearchEntry[]
  /** Busca já feita, para a página de resultados abrir com o campo preenchido. */
  initialQuery?: string
}

/**
 * Campo de busca do blog, no padrão "combobox" da WAI-ARIA: sugestões ao digitar,
 * ↑ ↓ para escolher, Enter para abrir, Esc para fechar e limpar. Com o campo
 * vazio mostra buscas populares em vez de uma caixa vazia. A tecla "/" leva o
 * foco ao campo, como em GitHub, YouTube e na maioria dos sites de documentação.
 */
export default function BlogSearch({ index, initialQuery = '' }: BlogSearchProps) {
  const router = useRouter()
  const id = useId()
  const listId = `${id}-list`
  const inputRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const terms = useMemo(() => queryTerms(value), [value])
  const results = useMemo(() => searchPosts(index, value), [index, value])
  const suggestions = results.slice(0, MAX_SUGGESTIONS)
  const hasQuery = terms.length > 0
  // As sugestões mais a opção final "ver todos os resultados"
  const optionCount = suggestions.length > 0 ? suggestions.length + 1 : 0
  const showList = open && optionCount > 0
  const resultsHref = `/blog/busca?q=${encodeURIComponent(value.trim())}`

  const go = (href: string) => {
    setOpen(false)
    setActive(-1)
    router.push(href)
  }

  const choose = (position: number) => {
    const post = suggestions[position]
    go(post ? `/blog/${post.slug}` : resultsHref)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (hasQuery) go(resultsHref)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (optionCount === 0) return
      event.preventDefault()
      setOpen(true)
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current === -1 && step === -1 ? optionCount - 1 : (current + step + optionCount) % optionCount))
    } else if (event.key === 'Enter' && showList && active >= 0) {
      event.preventDefault()
      choose(active)
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        setOpen(false)
        setActive(-1)
      } else if (value) {
        setValue('')
      }
    }
  }

  // "/" leva o foco ao campo, exceto quando a pessoa já está digitando em outro
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      onBlur={(event) => {
        // Fecha ao sair do campo e do painel, mas não ao clicar dentro do painel
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false)
          setActive(-1)
        }
      }}
      className="relative text-left"
    >
      <label htmlFor={`${id}-input`} className="sr-only">
        Buscar no blog
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
      />
      <input
        ref={inputRef}
        id={`${id}-input`}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={optionCount > 0 ? listId : undefined}
        aria-activedescendant={showList && active >= 0 ? `${id}-option-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Buscar artigos, máquinas…"
        className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-14 text-base text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 [&::-webkit-search-cancel-button]:hidden"
      />

      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue('')
            setActive(-1)
            inputRef.current?.focus()
          }}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 hidden h-7 min-w-7 -translate-y-1/2 place-items-center rounded-lg border border-gray-200 bg-gray-50 px-2 font-sans text-xs font-semibold text-gray-500 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:grid"
        >
          /
        </kbd>
      )}

      <p role="status" className="sr-only">
        {hasQuery ? (results.length === 0 ? 'Nenhum artigo encontrado.' : `${results.length} artigos encontrados.`) : ''}
      </p>

      {open && (
        <div
          // Mantém o foco no campo ao clicar no painel
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10"
        >
          {!hasQuery && (
            <div className="p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Buscas populares
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setValue(term)
                      setActive(-1)
                      inputRef.current?.focus()
                    }}
                    className="cursor-pointer rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasQuery && results.length === 0 && (
            <div className="px-6 py-9 text-center">
              <SearchX className="mx-auto h-8 w-8 text-gray-300" aria-hidden="true" />
              <p className="mt-3 font-semibold text-gray-900">Nenhum artigo encontrado para “{value.trim()}”</p>
              <p className="mt-1 text-sm text-gray-500">Confira a grafia ou tente um termo mais geral, como “bateria”.</p>
            </div>
          )}

          {optionCount > 0 && (
            <>
              <ul id={listId} role="listbox" aria-label="Artigos encontrados" className="max-h-[24rem] overflow-y-auto p-2">
                {suggestions.map((post, position) => (
                  <li
                    key={post.slug}
                    id={`${id}-option-${position}`}
                    role="option"
                    aria-selected={active === position}
                    onMouseEnter={() => setActive(position)}
                    onClick={() => choose(position)}
                    className={`cursor-pointer rounded-xl px-4 py-3 transition-colors ${active === position ? 'bg-gray-100' : ''}`}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-red-600">
                      {categoryOf(post)}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-gray-900">
                      <Highlighted text={post.title} terms={terms} />
                    </span>
                    {post.description && (
                      <span className="mt-0.5 line-clamp-1 block text-sm text-gray-500">
                        <Highlighted text={post.description} terms={terms} />
                      </span>
                    )}
                  </li>
                ))}
                <li
                  id={`${id}-option-${suggestions.length}`}
                  role="option"
                  aria-selected={active === suggestions.length}
                  onMouseEnter={() => setActive(suggestions.length)}
                  onClick={() => choose(suggestions.length)}
                  className={`mt-1 flex cursor-pointer items-center justify-between gap-3 rounded-xl border-t border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 transition-colors ${
                    active === suggestions.length ? 'bg-gray-100' : ''
                  }`}
                >
                  <span>
                    Ver {results.length > 1 ? `todos os ${results.length} resultados` : 'o resultado'} para “{value.trim()}”
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                </li>
              </ul>

              <div
                aria-hidden="true"
                className="hidden items-center gap-4 border-t border-gray-100 bg-gray-50 px-5 py-2.5 text-xs text-gray-500 sm:flex"
              >
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-gray-200 bg-white px-1.5 font-sans">↑</kbd>
                  <kbd className="rounded border border-gray-200 bg-white px-1.5 font-sans">↓</kbd>
                  navegar
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="grid h-5 place-items-center rounded border border-gray-200 bg-white px-1.5">
                    <CornerDownLeft className="h-3 w-3" />
                  </kbd>
                  abrir
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-gray-200 bg-white px-1.5 font-sans">esc</kbd>
                  fechar
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </form>
  )
}
