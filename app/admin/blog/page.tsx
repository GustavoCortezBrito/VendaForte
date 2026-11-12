'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import PostImage from '@/components/blog/PostImage'
import { BADGE_DRAFT, BADGE_INFO, BTN_GHOST, BTN_ICON, BTN_PRIMARY, CHIP_OFF, CHIP_ON, EYEBROW, INPUT, PAGE_TITLE } from '@/components/admin/ui'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Eye, Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, EyeOff, Rocket, Loader2 } from 'lucide-react'

import { askConfirm, notify } from '@/components/admin/Feedback'
interface Post {
  slug: string
  title: string
  description: string
  created_at: string
  published_at?: string
  category: string
  author: string
  reading_time: string
  tags: string[]
  published: boolean
  image?: string
}

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc'
type StatusFilter = 'all' | 'published' | 'draft'

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  // Falso em ambiente local: não dá para despublicar nem mexer no que está no ar
  const [canPublish, setCanPublish] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    // Verificar autenticação via API (cookie JWT)
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/admin/login')
        } else {
          setAuthenticated(true)
          fetchPosts()
          return res.json().then((data) => setCanPublish(data.canPublish !== false)).catch(() => {})
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, selectedCategory, searchTerm, sortBy, statusFilter])

  async function fetchPosts() {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      const postsData = data.posts || []
      setPosts(postsData)
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(postsData.map((p: Post) => p.category))] as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortPosts() {
    let filtered = posts

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filtrar por status (no ar ou rascunho)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => (post.published !== false) === (statusFilter === 'published'))
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    setFilteredPosts(sorted)
  }

  function clearFilters() {
    setSelectedCategory('all')
    setStatusFilter('all')
    setSearchTerm('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  async function handleDelete(slug: string) {
    if (!(await askConfirm('Tem certeza que deseja deletar este post?', { confirmLabel: 'Excluir' }))) {
      return
    }

    try {
      const response = await fetch(`/api/blog?slug=${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        notify('Post deletado com sucesso!')
        fetchPosts()
      } else {
        notify('Erro ao deletar post')
      }
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      notify('Erro ao deletar post')
    }
  }

  async function handleUnpublish(slug: string) {
    if (!(await askConfirm('Tirar este post do blog? Ele volta a ser rascunho: sai da lista, da busca e do mapa do site, e o endereço deixa de abrir. O texto fica guardado.', { confirmLabel: 'Tirar do blog', danger: false }))) {
      return
    }

    try {
      const response = await fetch('/api/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, published: false }),
      })

      if (response.ok) {
        fetchPosts()
      } else {
        const error = await response.json().catch(() => ({}))
        notify(error.error || 'Erro ao despublicar post')
      }
    } catch (error) {
      console.error('Erro ao despublicar post:', error)
      notify('Erro ao despublicar post')
    }
  }

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm !== '' || statusFilter !== 'all'
  const publishedCount = posts.filter(post => post.published !== false).length
  const draftCount = posts.length - publishedCount
  
  // Paginação
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  if (!authenticated) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center bg-ink">
        <Loader2 size={28} className="animate-spin text-red-500" aria-label="Carregando" />
      </div>
    )
  }

  const statusTabs = [
    ['all', 'Todos', posts.length],
    ['published', 'No ar', publishedCount],
    ['draft', 'Rascunhos', draftCount],
  ] as const

  const ICON_LIVE = `${BTN_ICON} hover:text-sky-300`
  const ICON_DANGER = `${BTN_ICON} hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400`

  return (
    <div className="min-h-screen bg-ink">
      <AdminNav active="blog">
        <Link href="/admin/blog/novo" className={BTN_PRIMARY}>
          <Plus size={14} aria-hidden="true" />
          <span>Novo post</span>
        </Link>
      </AdminNav>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <header className="max-w-3xl">
          <p className={EYEBROW}>Blog e notícias</p>
          <h1 className={`mt-3 ${PAGE_TITLE}`}>Artigos do blog</h1>
          {!loading && posts.length > 0 && (
            <p className="mt-3 text-neutral-400">
              {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}: {publishedCount} no ar e {draftCount} {draftCount === 1 ? 'rascunho' : 'rascunhos'}.
            </p>
          )}
        </header>

        {!canPublish && (
          <div role="status" className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm font-medium text-amber-300">
            Ambiente local: dá para criar e editar rascunhos, mas não para publicar, despublicar nem alterar o que já está no ar. Para isso, use o painel do site
            publicado.
          </div>
        )}

        {loading ? (
          <p role="status" className="mt-16 flex items-center justify-center gap-3 text-sm font-medium text-neutral-400">
            <Loader2 size={18} className="animate-spin text-red-500" aria-hidden="true" />
            Carregando os artigos…
          </p>
        ) : posts.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-white/15 bg-ink-raised px-6 py-16 text-center">
            <p className="text-xl font-semibold text-white">Nenhum artigo ainda</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">Crie o primeiro texto do blog da Venda Forte.</p>
            <Link href="/admin/blog/novo" className={`${BTN_PRIMARY} mt-6`}>
              <Plus size={14} aria-hidden="true" />
              Criar o primeiro post
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por situação">
                {statusTabs.map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setStatusFilter(value); setCurrentPage(1) }}
                    aria-pressed={statusFilter === value}
                    className={statusFilter === value ? CHIP_ON : CHIP_OFF}
                  >
                    {label} <span className="opacity-60">{count}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
                  <input
                    type="search"
                    aria-label="Buscar artigo"
                    placeholder="Buscar por título, descrição, categoria ou autor…"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                    autoComplete="off"
                    spellCheck={false}
                    className={`${INPUT} rounded-full pl-11 pr-12`}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      aria-label="Limpar a busca"
                      className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Ordenar por"
                  className={`${INPUT} w-full cursor-pointer rounded-full md:w-56`}
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="title-asc">Título (A a Z)</option>
                  <option value="title-desc">Título (Z a A)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  className={`inline-flex h-[50px] cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                    showFilters || hasActiveFilters ? 'bg-white text-ink' : 'border border-white/15 text-white hover:bg-white/10'
                  }`}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Filtros
                </button>
              </div>

              {showFilters && (
                <div className="rounded-[28px] border border-white/10 bg-ink-raised p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-white">Categoria</p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                      >
                        <X size={16} aria-hidden="true" />
                        Limpar filtros
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setSelectedCategory('all'); setCurrentPage(1) }}
                      aria-pressed={selectedCategory === 'all'}
                      className={selectedCategory === 'all' ? CHIP_ON : CHIP_OFF}
                    >
                      Todas <span className="opacity-60">{posts.length}</span>
                    </button>
                    {categories.map((category) => {
                      const count = posts.filter((p) => p.category === category).length
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => { setSelectedCategory(category); setCurrentPage(1) }}
                          aria-pressed={selectedCategory === category}
                          className={selectedCategory === category ? CHIP_ON : CHIP_OFF}
                        >
                          {category} <span className="opacity-60">{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {hasActiveFilters && (
                <p role="status" className="text-sm text-neutral-400">
                  Mostrando <span className="font-semibold text-white">{filteredPosts.length}</span> de {posts.length} artigos
                </p>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/15 bg-ink-raised px-6 py-16 text-center">
                <p className="text-xl font-semibold text-white">Nenhum artigo encontrado</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">Mude os filtros ou busque por outro termo.</p>
                <button type="button" onClick={clearFilters} className={`${BTN_GHOST} mt-6`}>
                  <X size={14} aria-hidden="true" />
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {currentPosts.map((post) => {
                    const draft = post.published === false
                    return (
                      <li key={post.slug}>
                        <article className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-ink-raised p-5 transition-colors hover:border-white/20 sm:flex-row sm:items-center">
                          {post.image && (
                            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-white/[0.03] sm:w-56">
                              <PostImage src={post.image} alt="" sizes="224px" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={BADGE_INFO}>{post.category}</span>
                              {draft && <span className={BADGE_DRAFT}>Rascunho</span>}
                              <span className="text-sm text-ink-muted">
                                {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <h2 className="mt-3 text-balance text-xl font-semibold leading-snug tracking-tight text-white">{post.title}</h2>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-400">{post.description}</p>
                            <p className="mt-3 text-xs text-ink-muted">
                              {post.author} · {post.reading_time}
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-2 sm:grid sm:grid-cols-2">
                            {draft ? (
                              <Link href={`/admin/rascunhos/${post.slug}`} className={ICON_LIVE} title="Ver o rascunho e publicar" aria-label={`Ver o rascunho e publicar: ${post.title}`}>
                                <Rocket size={18} aria-hidden="true" />
                              </Link>
                            ) : (
                              <Link href={`/blog/${post.slug}`} target="_blank" className={ICON_LIVE} title="Ver no site" aria-label={`Ver no site: ${post.title}`}>
                                <Eye size={18} aria-hidden="true" />
                              </Link>
                            )}
                            {draft ? (
                              <span aria-hidden="true" className="hidden sm:block" />
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUnpublish(post.slug)}
                                disabled={!canPublish}
                                className={`${BTN_ICON} hover:text-amber-300`}
                                title={canPublish ? 'Despublicar (volta a ser rascunho)' : 'Indisponível no ambiente local'}
                                aria-label={`Despublicar: ${post.title}`}
                              >
                                <EyeOff size={18} aria-hidden="true" />
                              </button>
                            )}
                            <Link href={`/admin/blog/editar/${post.slug}`} className={BTN_ICON} title="Editar" aria-label={`Editar: ${post.title}`}>
                              <Edit size={18} aria-hidden="true" />
                            </Link>
                            <button type="button" onClick={() => handleDelete(post.slug)} className={ICON_DANGER} title="Excluir" aria-label={`Excluir: ${post.title}`}>
                              <Trash2 size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </article>
                      </li>
                    )
                  })}
                </ul>

                <nav aria-label="Páginas" className="flex flex-col items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={BTN_ICON}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    {[...Array(totalPages || 1)].map((_, index) => {
                      const pageNumber = index + 1
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setCurrentPage(pageNumber)}
                          aria-current={currentPage === pageNumber ? 'page' : undefined}
                          aria-label={`Página ${pageNumber}`}
                          className={`grid h-11 w-11 cursor-pointer place-items-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                            currentPage === pageNumber ? 'bg-red-600 text-white' : 'border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                      disabled={currentPage === (totalPages || 1)}
                      className={BTN_ICON}
                      aria-label="Próxima página"
                    >
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Mostrando {Math.min(indexOfFirstPost + 1, filteredPosts.length)} a {Math.min(indexOfLastPost, filteredPosts.length)} de {filteredPosts.length}{' '}
                    {filteredPosts.length === 1 ? 'artigo' : 'artigos'}
                  </p>
                </nav>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
