'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'

interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: string
  image: string
  category: string
  tags: string[]
  readingTime: string
}

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  const postsPerPage = 6

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      // Buscar apenas posts publicados
      const response = await fetch('/api/blog?published=true')
      
      // Verificar se a resposta é OK
      if (!response.ok) {
        console.error('Erro na resposta:', response.status)
        setLoading(false)
        return
      }

      // Verificar se é JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Resposta não é JSON')
        setLoading(false)
        return
      }

      const data = await response.json()
      const postsData = data.posts || []
      
      // Ajustar nomes dos campos do banco para o frontend
      const formattedPosts = postsData.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: p.created_at || p.date,
        author: p.author,
        image: p.image,
        category: p.category,
        tags: p.tags || [],
        readingTime: p.reading_time || '5 min de leitura'
      }))

      setPosts(formattedPosts)
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(formattedPosts.map((p: Post) => p.category))] as string[]
      setCategories(uniqueCategories)

      // Extrair todas as tags únicas
      const tags = formattedPosts.flatMap((p: Post) => p.tags)
      const uniqueTags = [...new Set(tags)].sort() as string[]
      setAllTags(uniqueTags)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, selectedCategory, selectedTags, searchTerm, sortBy, currentPage])

  function filterAndSortPosts() {
    let filtered = posts

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filtrar por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      )
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
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

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
    setCurrentPage(1)
  }

  function clearFilters() {
    setSelectedCategory('all')
    setSelectedTags([])
    setSearchTerm('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  // Paginação
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0 || searchTerm !== ''

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header com Animações */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24 overflow-hidden z-0">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Círculos animados */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-sm font-bold border border-white/30 shadow-lg hover:bg-white/30 transition-all">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Blog Oficial
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="inline-block animate-slide-down">Blog</span>{' '}
              <span className="inline-block animate-slide-down" style={{ animationDelay: '0.1s' }}>Venda</span>{' '}
              <span className="inline-block animate-slide-down" style={{ animationDelay: '0.2s' }}>Forte</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-red-50 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Dicas, novidades e conteúdo especializado sobre empilhadeiras e equipamentos industriais
            </p>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="h-0.5 w-20 bg-white/30"></div>
              <div className="h-1 w-1 bg-white rounded-full"></div>
              <div className="h-0.5 w-20 bg-white/30"></div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barra de Busca, Ordenação e Filtros */}
        <div className="mb-10 space-y-6">
          {/* Busca e Ordenação */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Buscar posts por título, descrição ou tags..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:shadow-md text-base"
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
                  {(selectedCategory !== 'all' ? 1 : 0) + selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Painel de Filtros Expansível */}
          {showFilters && (
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 space-y-6 shadow-lg animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal className="text-red-600" size={24} />
                  Filtros Avançados
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 border-2 border-red-600 transition-all hover:shadow-lg"
                  >
                    <X size={18} />
                    Limpar Todos
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

              {/* Filtro de Tags */}
              <div>
                <label className="block font-bold text-gray-700 mb-4 text-base">
                  🏷️ Tags
                  {selectedTags.length > 0 && (
                    <span className="ml-2 text-red-600">({selectedTags.length} selecionadas)</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-white rounded-xl border-2 border-gray-200 shadow-inner">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-red-600 text-white scale-105 shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 hover:scale-105'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tags Selecionadas (fora do painel) */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center animate-fade-in-up">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtrando por:
              </span>
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-200 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                >
                  #{tag}
                  <X size={16} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-32 animate-fade-in">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-red-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full bg-red-600/10 animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-lg font-semibold">Carregando posts...</p>
            <p className="text-gray-400 text-sm mt-2">Aguarde um momento</p>
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Nenhum post encontrado</h3>
            <p className="text-gray-500 text-lg mb-6">Tente ajustar os filtros ou buscar por outro termo</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
              >
                <X size={20} />
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid de Posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentPosts.map((post, index) => (
                <article 
                  key={post.slug}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col animate-scale-in hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg group-hover:bg-red-700 transition-colors">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 font-medium">
                      <time className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </time>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readingTime}
                      </span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors line-clamp-2 group-hover:text-red-600">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <span 
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-red-600 hover:text-red-700 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Ler mais
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            <div className="space-y-6">
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
                  {[...Array(totalPages)].map((_, index) => {
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border-2 border-gray-200 hover:bg-red-50 hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  title="Próxima página"
                >
                  <ChevronRight size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Info de resultados */}
              <div className="text-center">
                <p className="text-gray-600 font-medium">
                  Mostrando <span className="text-red-600 font-bold">{indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)}</span> de <span className="text-red-600 font-bold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
