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

export default function BlogListingClient() {
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
      const response = await fetch('/api/blog?published=true')
      
      if (!response.ok) {
        console.error('Erro na resposta:', response.status)
        setLoading(false)
        return
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Resposta não é JSON')
        setLoading(false)
        return
      }

      const data = await response.json()
      const postsData = data.posts || []
      
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
      
      const uniqueCategories = [...new Set(formattedPosts.map((p: Post) => p.category))] as string[]
      setCategories(uniqueCategories)

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

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

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

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0 || searchTerm !== ''

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header com Animações */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24 overflow-hidden z-0">
        <div className="absolute inset-0 z-0">
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

            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="h-0.5 w-20 bg-white/30"></div>
              <div className="h-1 w-1 bg-white rounded-full"></div>
              <div className="h-0.5 w-20 bg-white/30"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 space-y-6">
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
                    Limpar Filtros
                  </button>
                )}
              </div>

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

              {allTags.length > 0 && (
                <div>
                  <label className="block font-bold text-gray-700 mb-4 text-base">🏷️ Tags Populares</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => {
                      const isSelected = selectedTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                            isSelected
                              ? 'bg-red-600 text-white scale-105'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-red-600'
                          }`}
                        >
                          #{tag}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lista de Posts */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">Carregando conteúdos...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-500 mb-6">Tente busca por outros termos ou escolha outra categoria</p>
            <button
              onClick={clearFilters}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md"
            >
              Ver todos os posts
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group transform hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-900">
                    <img
                      src={post.image || '/sede.png'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span>📅 {new Date(post.date).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>⏱️ {post.readingTime}</span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        Por {post.author}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-red-600 font-bold text-sm hover:text-red-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Ler artigo →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === i + 1
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
