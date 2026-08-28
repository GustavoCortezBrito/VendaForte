'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  MessageCircle,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronRight as ChevronIcon
} from 'lucide-react'

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
  
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, margin: "-50px" })
  
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
        author: p.author || 'Equipe Venda Forte',
        image: p.image || '/sede.png',
        category: p.category || 'Geral',
        tags: p.tags || [],
        readingTime: p.reading_time || '5 min de leitura'
      }))

      setPosts(formattedPosts)
      
      const uniqueCategories = [...new Set(formattedPosts.map((p: Post) => p.category))].filter(Boolean) as string[]
      setCategories(uniqueCategories)

      const tags = formattedPosts.flatMap((p: Post) => p.tags)
      const uniqueTags = [...new Set(tags)].filter(Boolean).sort() as string[]
      setAllTags(uniqueTags)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, selectedCategory, selectedTags, searchTerm, sortBy])

  function filterAndSortPosts() {
    let filtered = [...posts]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      )
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.description.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term)) ||
        post.category.toLowerCase().includes(term)
      )
    }

    const sorted = filtered.sort((a, b) => {
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

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0 || searchTerm.trim() !== ''
  const showFeaturedPost = !hasActiveFilters && currentPage === 1 && filteredPosts.length > 0
  
  const featuredPost = showFeaturedPost ? filteredPosts[0] : null
  const gridPosts = showFeaturedPost ? filteredPosts.slice(1) : filteredPosts

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = showFeaturedPost 
    ? gridPosts.slice(0, postsPerPage) 
    : filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
    
  const totalPages = Math.ceil((showFeaturedPost ? gridPosts.length : filteredPosts.length) / postsPerPage) || 1

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-gray-900 relative">
      
      {/* Hero Escuro Contrastante com a Imagem da Sede - Padrão do Hero Principal */}
      <section ref={heroRef} className="relative bg-gray-950 text-white pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden border-b border-gray-800">
        
        {/* Background com Imagem da Sede e Overlay Escuro */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
            style={{ backgroundImage: 'url(/sede.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-950/95 to-gray-950" />
          
          {/* Glows vermelhos da identidade visual */}
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-700/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Badge com contraste escuro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase tracking-wider mb-4 px-4 py-1.5 bg-red-950/60 rounded-full border border-red-500/30 backdrop-blur-md shadow-lg shadow-red-950/50 cursor-default">
                <Sparkles size={14} className="text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Conteúdo & Inteligência Logística</span>
              </span>
            </motion.div>

            {/* Título com alto contraste */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
            >
              Blog <span className="text-red-500">Venda Forte</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed"
            >
              Artigos práticos, guias técnicos sobre empilhadeiras elétricas Li-Ion e soluções para otimizar sua operação.
            </motion.p>

            {/* Barra de Busca Dark/Glassmorphism com contraste nítido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="relative group">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" 
                  size={20} 
                />
                <input
                  type="text"
                  placeholder="Pesquisar por assunto ou modelo (ex: DS3, F4, Bateria de Lítio)..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-900/90 text-white placeholder-gray-400 border border-gray-700/80 shadow-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 backdrop-blur-xl transition-all text-sm sm:text-base outline-none hover:border-gray-600"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Tags rápidas no Hero */}
            {allTags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-semibold"
              >
                <span className="text-gray-400">Tópicos:</span>
                {allTags.slice(0, 5).map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3.5 py-1 rounded-full transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'bg-gray-900/80 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700/70'
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                })}
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Conteúdo dos Artigos com Fundo em Alto Contraste */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        
        {/* Post em Destaque com visual nítido */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-900">
                Publicação em Destaque
              </span>
            </div>

            <article className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-gray-300/40 hover:shadow-2xl hover:shadow-red-500/10 transition-all group overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Imagem do Destaque */}
                <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 border border-gray-100 group-hover:border-red-200 transition-colors">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-gray-950/80 text-white backdrop-blur-md shadow-md border border-white/20">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Destaque */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-red-600" />
                        {new Date(featuredPost.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        {featuredPost.readingTime}
                      </span>
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 group-hover:text-red-600 transition-colors leading-tight tracking-tight">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    {/* Descrição */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {featuredPost.description}
                    </p>

                    {/* Tags */}
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {featuredPost.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <span>{featuredPost.author}</span>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="px-5 py-3 rounded-2xl bg-gray-950 hover:bg-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors group/btn shadow-md"
                    >
                      <span>Ler Artigo Completo</span>
                      <ChevronIcon size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                </div>

              </div>
            </article>
          </motion.div>
        )}

        {/* Barra de Categorias e Ordenação */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
            
            {/* Abas de Categorias */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <span>Todas ({posts.length})</span>
              </button>

              {categories.map(cat => {
                const count = posts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <span>{cat} ({count})</span>
                  </button>
                )
              })}
            </div>

            {/* Ordenação & Tags */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm cursor-pointer hover:bg-gray-50"
              >
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
                <option value="title-asc">Título (A-Z)</option>
                <option value="title-desc">Título (Z-A)</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  showFilters || hasActiveFilters
                    ? 'bg-gray-950 text-white shadow-md'
                    : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal size={15} />
                <span>Tags</span>
                {selectedTags.length > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {selectedTags.length}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>

          </div>

          {/* Gaveta de Tags */}
          <AnimatePresence>
            {showFilters && allTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Tag size={13} className="text-red-600" />
                    Filtrar por Tags
                  </span>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Limpar tags
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid de Artigos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-gray-200 animate-pulse space-y-4 shadow-sm">
                <div className="h-44 bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen size={26} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum artigo encontrado</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5">
              Não localizamos publicações com os critérios atuais. Tente outros termos de busca.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-red-700 shadow-md shadow-red-600/20 transition-all"
            >
              Ver todos os artigos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white border border-gray-200 rounded-3xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-200 transition-all flex flex-col justify-between group transform hover:-translate-y-1"
                >
                  <div>
                    {/* Imagem do Card */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 mb-4 border border-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-gray-950/80 text-white backdrop-blur-md shadow-sm border border-white/20">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadados */}
                    <div className="flex items-center gap-2.5 text-[11px] text-gray-500 font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-red-600" />
                        {new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock size={12} />
                        {post.readingTime}
                      </span>
                    </div>

                    {/* Título do Card */}
                    <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2 mb-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Descrição */}
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                      {post.description}
                    </p>
                  </div>

                  {/* Rodapé do Card */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 truncate max-w-[110px]">
                      {post.author}
                    </span>

                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`Ler artigo: ${post.title}`}
                      className="text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Ler artigo</span>
                      <ChevronIcon size={14} />
                    </Link>
                  </div>

                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                <p className="text-xs font-semibold text-gray-500">
                  Página <span className="font-bold text-gray-900">{currentPage}</span> de <span className="font-bold text-gray-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                      window.scrollTo({ top: 400, behavior: 'smooth' })
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        setCurrentPage(i + 1)
                        window.scrollTo({ top: 400, behavior: 'smooth' })
                      }}
                      className={`min-w-[34px] h-8 px-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        currentPage === i + 1
                          ? 'bg-red-600 text-white shadow-red-600/30'
                          : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                      window.scrollTo({ top: 400, behavior: 'smooth' })
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Seção CTA com Alto Contraste (Fundo Dark Grafite + Destaques em Vermelho e Verde) */}
        <section className="mt-16 bg-gray-950 text-white border border-gray-800 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase tracking-wider px-3.5 py-1 bg-red-950/80 rounded-full border border-red-500/30 shadow-sm">
                <CheckCircle2 size={14} className="text-red-400" />
                <span>Atendimento Consultivo</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Precisa de auxílio para escolher o equipamento ideal?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Nossos consultores técnicos estão prontos para dimensionar corredores operacionais, capacidades de carga e autonomia da bateria Íon-Lítio para sua empresa.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href="https://wa.me/5549988395635?text=Ol%C3%A1%21%20Estava%20lendo%20o%20blog%20da%20Venda%20Forte%20e%20gostaria%20de%20falar%20com%20um%20consultor."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Falar no WhatsApp Comercial</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                href="/empilhadeiras-eletricas"
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors text-center border border-white/15"
              >
                <span>Explorar Catálogo Completo</span>
                <ChevronIcon size={16} />
              </Link>
            </div>

          </div>
        </section>

        {/* Rodapé com Selos */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-gray-600">
          <div className="flex items-center gap-2 cursor-default">
            <ShieldCheck size={16} className="text-red-600" />
            <span>Conteúdo Técnico Validado por Especialistas</span>
          </div>
          <div className="flex items-center gap-2 cursor-default">
            <Truck size={16} className="text-red-600" />
            <span>Entrega Técnica em Todo o Brasil</span>
          </div>
        </div>

      </div>
    </div>
  )
}
