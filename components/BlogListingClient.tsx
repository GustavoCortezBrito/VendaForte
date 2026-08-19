'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronLeft, ChevronRight, X,
  BookOpen, Clock, Calendar, User, ArrowRight,
  Tag, Layers, TrendingUp, ChevronDown
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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Equipamentos':    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  'Tecnologia':      { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'Logística':       { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  'Manutenção':      { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200' },
  'Segurança':       { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
}

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] || { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
}

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
  const [showTagsExpanded, setShowTagsExpanded] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const postsPerPage = 3

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    try {
      const response = await fetch('/api/blog?published=true')
      if (!response.ok) { setLoading(false); return }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) { setLoading(false); return }

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
    let filtered = posts

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => selectedTags.some(tag => post.tags.includes(tag)))
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
        case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'title-asc': return a.title.localeCompare(b.title)
        case 'title-desc': return b.title.localeCompare(a.title)
        default: return 0
      }
    })

    setFilteredPosts(sorted)
    setCurrentPage(1)
  }, [posts, selectedCategory, selectedTags, searchTerm, sortBy])

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
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
  const featuredPost = currentPage === 1 && !hasActiveFilters && currentPosts.length > 0 ? currentPosts[0] : null
  const remainingPosts = featuredPost ? currentPosts.slice(1) : currentPosts

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-24 pb-0" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b2e 40%, #7f1d1d 100%)'
      }}>
        {/* Diagonal stripe texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #ffffff 0px,
            #ffffff 1px,
            transparent 1px,
            transparent 12px
          )`
        }} />

        {/* Glowing orbs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-12 pb-20">

            {/* Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 text-red-300 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Blog & Conteúdo Especializado
              </div>
            </div>

            {/* Main headline */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
              <div className="max-w-3xl">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
                  Conteúdo que<br />
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(90deg, #f87171, #fca5a5)' }}>
                    eleva sua operação
                  </span>
                </h1>
                <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                  Artigos técnicos, guias práticos e novidades sobre empilhadeiras elétricas, intralogística e automação industrial — da equipe Venda Forte.
                </p>

                {/* Search shortcut */}
                <button
                  onClick={() => { setTimeout(() => searchRef.current?.focus(), 300); window.scrollTo({ top: 600, behavior: 'smooth' }) }}
                  className="mt-8 inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all group"
                >
                  <Search size={16} className="text-red-400" />
                  <span>Buscar um artigo...</span>
                  <span className="ml-auto text-[10px] bg-white/10 border border-white/15 px-2 py-0.5 rounded-md font-mono tracking-wide opacity-70">↓</span>
                </button>
              </div>

              {/* Stats column */}
              <div className="flex lg:flex-col gap-4 shrink-0">
                {[
                  { label: 'Artigos Publicados', value: posts.length, icon: BookOpen, color: 'from-red-600/30 to-red-700/20', border: 'border-red-500/20' },
                  { label: 'Categorias', value: categories.length, icon: Layers, color: 'from-violet-600/30 to-violet-700/20', border: 'border-violet-500/20' },
                  { label: 'Tags Disponíveis', value: allTags.length, icon: Tag, color: 'from-amber-600/30 to-amber-700/20', border: 'border-amber-500/20' },
                ].map(({ label, value, icon: Icon, color, border }) => (
                  <div key={label}
                    className={`flex items-center gap-4 bg-gradient-to-br ${color} backdrop-blur-sm border ${border} rounded-2xl px-5 py-4 min-w-[200px]`}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-white/80" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">{value}</div>
                      <div className="text-xs text-white/50 font-semibold">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="relative -mb-px">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 80L80 69C160 58 320 36 480 30C640 24 800 36 960 46C1120 58 1280 69 1360 74L1440 80V80H1360C1280 80 1120 80 960 80C800 80 640 80 480 80C320 80 160 80 80 80H0V80Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </div>


      {/* ─── FILTERS + CONTENT ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={18} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar artigos por título, tema ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/15 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-medium"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-semibold text-slate-700 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15 cursor-pointer transition-all"
              >
                <option value="newest">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
                <option value="title-asc">Título (A-Z)</option>
                <option value="title-desc">Título (Z-A)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {/* Clear if active */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl border border-red-200 transition-all"
              >
                <X size={14} />
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Category Chips */}
          {categories.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mr-1 shrink-0">
                <Layers size={13} />
                <span>Categorias:</span>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100'
                }`}
              >
                Todos ({posts.length})
              </button>
              {categories.map(cat => {
                const style = getCategoryStyle(cat)
                const isSelected = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600'
                        : `${style.bg} ${style.text} ${style.border} hover:opacity-80`
                    }`}
                  >
                    {cat} ({posts.filter(p => p.category === cat).length})
                  </button>
                )
              })}
            </div>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mr-1 shrink-0">
                <Tag size={13} />
                <span>Tags:</span>
              </div>
              {(showTagsExpanded ? allTags : allTags.slice(0, 8)).map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {allTags.length > 8 && (
                <button
                  onClick={() => setShowTagsExpanded(!showTagsExpanded)}
                  className="text-xs text-slate-500 hover:text-red-600 font-semibold underline underline-offset-2 transition-colors"
                >
                  {showTagsExpanded ? 'Ver menos' : `+${allTags.length - 8} tags`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results summary */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 font-medium">
              {hasActiveFilters
                ? <><span className="font-bold text-slate-800">{filteredPosts.length}</span> resultado{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}</>
                : <><span className="font-bold text-slate-800">{filteredPosts.length}</span> artigos publicados</>
              }
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-slate-400 font-medium">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        )}

        {/* ─── POSTS ──────────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Carregando artigos...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <BookOpen size={28} className="text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum artigo encontrado</h3>
              <p className="text-slate-500 text-sm">Tente outros termos ou remova os filtros aplicados.</p>
            </div>
            <button
              onClick={clearFilters}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs"
            >
              Ver todos os artigos
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${selectedCategory}-${searchTerm}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Featured Post (first post, first page, no active filters) */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="block group mb-8">
                  <article className="relative bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col lg:flex-row hover:shadow-lg hover:border-red-200 transition-all duration-300">
                    <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={featuredPost.image || '/sede.png'}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      <div className="absolute top-5 left-5">
                        <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          <TrendingUp size={11} />
                          Destaque
                        </span>
                      </div>
                    </div>

                    <div className="p-8 lg:p-10 flex flex-col justify-center flex-1">
                      <div className="mb-4">
                        {(() => {
                          const s = getCategoryStyle(featuredPost.category)
                          return (
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                              {featuredPost.category}
                            </span>
                          )
                        })()}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight mb-3">
                        {featuredPost.title}
                      </h2>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                        {featuredPost.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {new Date(featuredPost.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {featuredPost.readingTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={13} />
                            {featuredPost.author}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-red-600 font-bold text-sm group-hover:gap-3 transition-all">
                          Ler artigo <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Regular Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingPosts.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-red-200 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Card Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={post.image || '/sede.png'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {(() => {
                        const s = getCategoryStyle(post.category)
                        return (
                          <div className="absolute top-3.5 left-3.5">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${s.bg} ${s.text} ${s.border} backdrop-blur-sm shadow-xs`}>
                              {post.category}
                            </span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {post.readingTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2 flex-1">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {/* Description */}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {post.description}
                      </p>

                      {/* Tags (first 2) */}
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.tags.slice(0, 2).map(tag => (
                            <button
                              key={tag}
                              onClick={(e) => { e.preventDefault(); toggleTag(tag) }}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                                selectedTags.includes(tag)
                                  ? 'bg-red-600 text-white border-red-600'
                                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-red-300'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium">+{post.tags.length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <User size={11} />
                          {post.author}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          aria-label={`Ler artigo: ${post.title}`}
                          className="inline-flex items-center gap-1 text-red-600 font-bold text-xs hover:gap-2 transition-all"
                        >
                          Ler artigo <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination — always visible */}
              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-xs text-slate-500 font-medium">
                  Mostrando{' '}
                  <span className="font-bold text-slate-700">{indexOfFirstPost + 1}–{Math.min(indexOfLastPost, filteredPosts.length)}</span>
                  {' '}de{' '}
                  <span className="font-bold text-slate-700">{filteredPosts.length}</span> artigos
                  {totalPages > 1 && (
                    <span className="ml-2 text-slate-400">• Página {currentPage} de {totalPages}</span>
                  )}
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-700"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {[...Array(Math.max(totalPages, 1))].map((_, i) => {
                    const page = i + 1
                    if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                      if (page === 2 || page === totalPages - 1) return <span key={i} className="px-1 text-slate-400 text-xs">…</span>
                      return null
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[38px] h-[38px] px-2 rounded-xl text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/20 ring-2 ring-red-200'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-red-300'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-700"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
