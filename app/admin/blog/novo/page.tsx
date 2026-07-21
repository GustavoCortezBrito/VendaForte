'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'

// Categorias padrão
const DEFAULT_CATEGORIES = [
  'Novidades',
  'Manutenção',
  'Dicas',
  'Cases de Sucesso',
  'Segurança',
  'Tecnologia',
  'Produtos'
]

// Tags mais usadas como sugestões
const SUGGESTED_TAGS = [
  'empilhadeira',
  'manutenção',
  'segurança',
  'dicas',
  'equipamentos',
  'produtividade',
  'logística',
  'armazém',
  'operação',
  'tecnologia'
]

export default function NovoPostPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [existingCategories, setExistingCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    author: 'Equipe Venda Forte',
    category: 'Novidades',
    image: '/sede.png',
    content: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('/sede.png')

  useEffect(() => {
    // Verificar autenticação via API (cookie JWT)
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/admin/login')
        } else {
          setAuthenticated(true)
          loadExistingCategories()
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  async function loadExistingCategories() {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      if (data.posts && data.posts.length > 0) {
        const categories = [...new Set(data.posts.map((p: any) => p.category))] as string[]
        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])]
        setExistingCategories(allCategories)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    if (value === '__new__') {
      setShowNewCategory(true)
      setFormData(prev => ({ ...prev, category: '' }))
    } else {
      setShowNewCategory(false)
      setFormData(prev => ({ ...prev, category: value }))
    }
  }

  function handleAddNewCategory() {
    if (newCategoryName.trim()) {
      const formatted = newCategoryName.trim()
      setExistingCategories(prev => [...prev, formatted])
      setFormData(prev => ({ ...prev, category: formatted }))
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  function addCustomTag() {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()])
      setCustomTag('')
    }
  }

  function removeTag(tag: string) {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Erro ao fazer upload')
        return
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, image: data.url }))
      setImagePreview(data.url)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-gerar slug do título
    if (name === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.category) {
      alert('Por favor, selecione ou crie uma categoria')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug,
          title: formData.title,
          description: formData.description,
          author: formData.author,
          category: formData.category,
          tags: selectedTags,
          image: formData.image,
          content: formData.content,
          date: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('Post criado com sucesso!')
        router.push('/admin/blog')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar post')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao criar post')
    } finally {
      setSaving(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Título - Estilo Original */}
            <Link href="/admin/blog" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
                  Criar Novo Post
                </p>
              </div>
            </Link>

            {/* Botão Voltar */}
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all font-medium"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Voltar ao Painel</span>
            </Link>
          </div>
        </div>
        
        {/* Linha de Progresso Vermelha */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 w-full"></div>
      </header>

      {/* Form */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 space-y-8 border border-gray-100">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Digite o título do post"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="titulo-do-post"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL: /blog/{formData.slug || 'titulo-do-post'}
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
              placeholder="Breve descrição do post (aparece na listagem)"
            />
          </div>

          {/* Grid: Categoria e Autor */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="category"
                value={showNewCategory ? '__new__' : formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                {existingCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__new__">➕ Nova Categoria</option>
              </select>
              
              {/* Campo para nova categoria */}
              {showNewCategory && (
                <div className="mt-3 flex gap-2 animate-fade-in-up">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())}
                    placeholder="Nome da nova categoria"
                    className="flex-1 px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategoryName('')
                      setFormData(prev => ({ ...prev, category: existingCategories[0] }))
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Autor *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          {/* Tags com Sugestões */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            
            {/* Tags Selecionadas */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-900 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Sugestões de Tags */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2 font-medium">Sugestões populares:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Adicionar Tag Personalizada */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                placeholder="Adicionar tag personalizada..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Adicionar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Clique nas sugestões ou adicione tags personalizadas
            </p>
          </div>

          {/* Imagem de Capa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagem de Capa *
            </label>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Preview da imagem */}
              <div className="flex-shrink-0">
                <div className="w-full md:w-48 h-32 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/sede.png'
                    }}
                  />
                </div>
              </div>

              {/* Upload */}
              <div className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                          <p className="text-sm text-gray-600">Fazendo upload...</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-semibold text-gray-700">
                            Clique para selecionar ou arraste a imagem
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, GIF ou WebP (máx. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Esta imagem aparecerá como capa do post na listagem do blog
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Conteúdo *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-5 rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg transform hover:-translate-y-0.5"
            >
              <Save size={22} />
              {saving ? 'Salvando...' : 'Criar Post'}
            </button>
            <Link
              href="/admin/blog"
              className="px-8 py-5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 text-lg"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
