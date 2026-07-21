'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Eye, LogOut, Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

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
}

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc'

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
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, selectedCategory, searchTerm, sortBy])

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
  }

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
    setSearchTerm('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  async function handleDelete(slug: string) {
    if (!confirm('Tem certeza que deseja deletar este post?')) {
      return
    }

    try {
      const response = await fetch(`/api/blog?slug=${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Post deletado com sucesso!')
        fetchPosts()
      } else {
        alert('Erro ao deletar post')
      }
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      alert('Erro ao deletar post')
    }
  }

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm !== ''
  
  // Paginação
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header Administrativo */}
      <header className="bg-white shadow-lg border-b-2 border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Título - Estilo Original */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Venda Forte Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement!
                    parent.classList.add('bg-red-600')
                    parent.innerHTML = '<span class="text-white font-bold text-xl">VF</span>'
                  }}
                />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  Venda Forte
                </div>
                <p className="text-xs font-medium text-gray-500">
                  Painel Administrativo
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                <Eye size={20} />
                <span className="hidden sm:inline">Ver Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Sair</span>
              </button>
              <Link
                href="/admin/blog/novo"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold"
              >
                <Plus size={20} />
                <span>Novo Post</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Linha de Progresso Vermelha */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 w-full"></div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {loading ? (
          <div className="text-center py-32">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-xl font-medium">Carregando posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-2xl border border-gray-100">
            <div className="max-w-lg mx-auto px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Plus size={48} className="text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nenhum post ainda</h2>
              <p className="text-gray-600 mb-10 text-lg">Comece criando seu primeiro post para o blog da Venda Forte</p>
              <Link
                href="/admin/blog/novo"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-5 rounded-xl hover:shadow-2xl transition-all duration-200 font-bold text-lg transform hover:-translate-y-1"
              >
                <Plus size={24} />
                Criar Primeiro Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Estatísticas no Topo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total de Posts */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-red-600 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-5xl font-black text-red-600">{posts.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Total de Posts</h3>
                <p className="text-gray-600 text-sm">
                  {posts.length === 1 ? 'post publicado' : 'posts publicados'}
                </p>
              </div>

              {/* Categorias */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-red-600 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="text-5xl font-black text-red-600">
                    {new Set(posts.map(p => p.category)).size}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Categorias</h3>
                <p className="text-gray-600 text-sm">
                  categorias ativas
                </p>
              </div>

              {/* Último Post */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-red-600 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Último Post</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(posts[0].created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  publicação mais recente
                </p>
              </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={22} />
                  <input
                    type="text"
                    placeholder="Buscar por título, descrição, categoria ou autor..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:shadow-md text-base bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-semibold bg-white shadow-sm hover:shadow-md cursor-pointer text-base"
                >
                  <option value="newest">📅 Mais Recentes</option>
                  <option value="oldest">📅 Mais Antigos</option>
                  <option value="title-asc">🔤 Título (A-Z)</option>
                  <option value="title-desc">🔤 Título (Z-A)</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-4 rounded-xl font-bold transition-all flex items-center gap-3 shadow-sm hover:shadow-md ${
                    showFilters || hasActiveFilters
                      ? 'bg-red-600 text-white hover:bg-red-700 scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-red-600'
                  }`}
                >
                  <SlidersHorizontal size={22} />
                  <span className="hidden sm:inline">Filtros</span>
                  {hasActiveFilters && (
                    <span className="bg-white text-red-600 text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                      {selectedCategory !== 'all' ? 1 : 0}
                    </span>
                  )}
                </button>
              </div>

              {/* Painel de Filtros */}
              {showFilters && (
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 space-y-6 shadow-lg animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                      <SlidersHorizontal className="text-red-600" size={24} />
                      Filtros
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 border-2 border-red-600 transition-all hover:shadow-lg"
                      >
                        <X size={18} />
                        Limpar Filtros
                      </button>
                    )}
                  </div>

                  {/* Filtro de Categorias */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-4 text-base">📂 Categorias</label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                        className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md ${
                          selectedCategory === 'all'
                            ? 'bg-red-600 text-white scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-600'
                        }`}
                      >
                        Todas <span className="ml-1 opacity-75">({posts.length})</span>
                      </button>
                      {categories.map(category => {
                        const count = posts.filter(p => p.category === category).length
                        return (
                          <button
                            key={category}
                            onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                            className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md ${
                              selectedCategory === category
                                ? 'bg-red-600 text-white scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-600'
                            }`}
                          >
                            {category} <span className="ml-1 opacity-75">({count})</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador de Resultados */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-blue-900 font-semibold">
                    Mostrando <span className="text-blue-600 font-bold">{filteredPosts.length}</span> de <span className="text-blue-600 font-bold">{posts.length}</span> posts
                  </p>
                </div>
              )}
            </div>

            {/* Lista de Posts */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-100">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">Nenhum post encontrado</h3>
                <p className="text-gray-500 text-lg mb-6">Tente ajustar os filtros ou buscar por outro termo</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <X size={20} />
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {currentPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                  >
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-8">
                      {/* Conteúdo do Post */}
                      <div className="flex-1 space-y-4">
                        {/* Meta informações */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200">
                            {post.category}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(post.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {/* Título */}
                        <h3 className="text-2xl font-bold text-gray-900 hover:text-red-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        {/* Descrição */}
                        <p className="text-gray-600 text-base leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                        
                        {/* Informações adicionais */}
                        <div className="flex items-center gap-5 text-sm text-gray-500 pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">
                                {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-medium">{post.author}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">{post.reading_time}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-3.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all shadow-sm hover:shadow-md border border-blue-100"
                          title="Visualizar post"
                        >
                          <Eye size={22} />
                        </Link>
                        <Link
                          href={`/admin/blog/editar/${post.slug}`}
                          className="p-3.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all shadow-sm hover:shadow-md border border-green-100"
                          title="Editar post"
                        >
                          <Edit size={22} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="p-3.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-md border border-red-100"
                          title="Deletar post"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                ))}
              </div>

              {/* Paginação - Sempre visível */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:bg-red-50 hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    title="Página anterior"
                  >
                    <ChevronLeft size={24} className="text-gray-600" />
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages || 1)].map((_, index) => {
                      const pageNumber = index + 1
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-12 h-12 rounded-full font-bold transition-all ${
                            currentPage === pageNumber
                              ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-100'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-600 hover:text-red-600 hover:scale-105 active:scale-95'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
                    disabled={currentPage === (totalPages || 1)}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:bg-red-50 hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    title="Próxima página"
                  >
                    <ChevronRight size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Info de resultados */}
                <div className="text-center">
                  <p className="text-gray-600 font-medium">
                    Mostrando <span className="text-red-600 font-bold">{Math.min(indexOfFirstPost + 1, filteredPosts.length)}-{Math.min(indexOfLastPost, filteredPosts.length)}</span> de <span className="text-red-600 font-bold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>
            </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
