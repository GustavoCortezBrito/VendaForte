'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Save, Loader2, Plus, X } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import AdminNav from '@/components/admin/AdminNav'

import { notify } from '@/components/admin/Feedback'
// Categorias do blog: as mesmas das abas da listagem (/blog). Novas categorias criadas
// no formulário também viram aba, ordenadas das mais cheias às mais vazias.
const DEFAULT_CATEGORIES = [
  'Custos',
  'Máquinas EP',
  'Tecnologia',
  'Empresa',
  'Guia de compra',
  'Aplicações',
  'Segurança e normas'
]

// Tags de máquina: ligam o artigo ao cartão "Na campanha" e a "Guias por máquina" no blog
const MACHINE_TAGS = ['DS3', 'F4', 'EFL302 B3']

// Tags mais usadas como sugestões
const SUGGESTED_TAGS = [
  ...MACHINE_TAGS,
  'lítio',
  'bateria',
  'ficha técnica',
  'custos',
  'financiamento',
  'armazém',
  'logística',
  'segurança'
]

export default function EditarPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // Rascunho (false) ou no ar (true); `null` até o post carregar
  const [published, setPublished] = useState<boolean | null>(null)
  // Falso em ambiente local: não dá para publicar nem alterar um post que já está no ar
  const [canPublish, setCanPublish] = useState(true)

  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [existingCategories, setExistingCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    image: '',
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
          res.json().then((data) => setCanPublish(data.canPublish !== false)).catch(() => {})
          setAuthenticated(true)
          loadExistingCategories()
          loadPost()
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router, slug])

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
        notify(error.error || 'Erro ao fazer upload')
        return
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, image: data.url }))
      setImagePreview(data.url)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      notify('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  async function loadPost() {
    try {
      const response = await fetch(`/api/blog?slug=${slug}`)
      const data = await response.json()

      if (data.post) {
        const post = data.post
        setPublished(post.published !== false)
        setFormData({
          title: post.title || '',
          description: post.description || '',
          author: post.author || '',
          category: post.category || '',
          image: post.image || '/sede.png',
          content: post.content || ''
        })
        
        // Carregar tags
        if (Array.isArray(post.tags)) {
          setSelectedTags(post.tags)
        }
        
        // Carregar preview da imagem
        setImagePreview(post.image || '/sede.png')
      } else {
        notify('Post não encontrado')
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error)
      notify('Erro ao carregar post')
      router.push('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // "Salvar e publicar" (value="publicar") grava o texto e em seguida publica o rascunho
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const publishAfterSaving = submitter?.value === 'publicar'
    
    if (!formData.category) {
      notify('Por favor, selecione ou crie uma categoria')
      return
    }
    
    setSaving(true)

    try {
      const response = await fetch('/api/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug,
          title: formData.title,
          description: formData.description,
          author: formData.author,
          category: formData.category,
          tags: selectedTags,
          image: formData.image,
          content: formData.content
        })
      })

      if (response.ok && publishAfterSaving) {
        const publish = await fetch('/api/blog', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, published: true })
        })
        if (publish.ok) {
          notify('Post publicado com sucesso!')
          router.push('/admin/blog')
        } else {
          const error = await publish.json().catch(() => ({}))
          notify('O texto foi salvo, mas o post não foi publicado: ' + (error.error || 'tente de novo em instantes.'))
          router.push('/admin/rascunhos')
        }
      } else if (response.ok) {
        notify(published === false ? 'Rascunho salvo! Ele continua fora do site.' : 'Post atualizado com sucesso!')
        router.push(published === false ? '/admin/rascunhos' : '/admin/blog')
      } else {
        const error = await response.json()
        notify(error.error || 'Erro ao atualizar post')
      }
    } catch (error) {
      console.error('Erro:', error)
      notify('Erro ao atualizar post')
    } finally {
      setSaving(false)
    }
  }

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-white/[0.03] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="text-neutral-400 mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink ">
      {/* ── Header Admin ── */}
      <AdminNav active="blog" crumb={`Editar: ${formData.title || '…'}`}>
        <button
          type="submit"
          form="blog-edit-form"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
          <span>{saving ? 'Salvando…' : 'Salvar alterações'}</span>
        </button>
      </AdminNav>

      {/* Form */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <form id="blog-edit-form" onSubmit={handleSubmit} className="bg-ink-raised rounded-[28px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] p-10 space-y-8 border border-white/[0.06]">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              placeholder="Digite o título do post"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-2">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
              placeholder="Breve descrição do post"
            />
          </div>

          {/* Grid: Categoria e Autor */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-2">
                Categoria *
              </label>
              <select
                name="category"
                value={showNewCategory ? '__new__' : formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
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
                    className="flex-1 px-4 py-2 border border-red-500/40 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold transition"
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
                    className="px-4 py-2 bg-white/10 text-neutral-200 rounded-lg hover:bg-white/25 font-semibold transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-2">
                Autor *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Tags com Sugestões */}
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-2">
              Tags
            </label>
            
            {/* Tags Selecionadas */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white/[0.03] rounded-lg border border-white/10">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-red-500/15 text-red-400 px-3 py-1.5 rounded-full text-sm font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-200 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Sugestões de Tags */}
            <div className="mb-3">
              <p className="text-xs text-ink-muted mb-2 font-medium">Sugestões populares:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
 selectedTags.includes(tag)
 ? 'bg-red-600 text-white shadow-md'
 : 'bg-white/10 text-neutral-200 hover:bg-white/25'
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
                className="min-w-0 flex-1 px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="shrink-0 px-4 sm:px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold transition flex items-center gap-2"
              >
                <Plus size={20} />
                Adicionar
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-2">
              Clique nas sugestões ou adicione tags personalizadas.
              As tags <strong>DS3</strong>, <strong>F4</strong> e <strong>EFL302 B3</strong> ligam o artigo à máquina: aparece o cartão “Na campanha” e ele entra em “Guias por máquina”. Use só uma por artigo: com mais de uma tag de máquina, o cartão “Na campanha” não aparece.
            </p>
          </div>

          {/* Imagem de Capa */}
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-2">
              Imagem de Capa *
            </label>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Preview da imagem */}
              <div className="flex-shrink-0">
                <div className="w-full md:w-48 h-32 rounded-lg border border-white/10 overflow-hidden bg-white/[0.03]">
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
                <div className="border border-dashed border-white/15 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
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
                          <p className="text-sm text-neutral-400">Fazendo upload...</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-semibold text-neutral-200">
                            Clique para selecionar ou arraste a imagem
                          </p>
                          <p className="text-xs text-ink-muted">
                            JPG, PNG, GIF ou WebP (máx. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                
                <p className="text-xs text-ink-muted mt-2">
                  É a capa do artigo, do cartão na listagem e do compartilhamento. Use uma imagem horizontal 16:9 (ex.: 1600 × 900 px); imagens quadradas ou verticais são cortadas.
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-3">
              Conteúdo *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
            />
          </div>

          {/* Botões */}
          {!canPublish && published !== false && (
            <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm font-semibold text-amber-300">
              Ambiente local: este post está no ar e não pode ser alterado daqui. Use o painel do site publicado.
            </p>
          )}

          {published === false && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm font-semibold text-amber-300">
              Este post é um rascunho: não aparece no blog, na busca nem no mapa do site. Veja como ficará em{' '}
              <Link href={`/admin/rascunhos/${slug}`} className="underline">
                Visualizar rascunho
              </Link>
              .
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
            <button
              type="submit"
              value="salvar"
              disabled={saving || (!canPublish && published !== false)}
              title={!canPublish && published !== false ? 'Indisponível no ambiente local: este post está no ar' : undefined}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-5 rounded-full hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg transform hover:-translate-y-0.5"
            >
              {saving ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={22} />
                  {published === false ? 'Salvar rascunho' : 'Salvar Alterações'}
                </>
              )}
            </button>
            {published === false && (
              <button
                type="submit"
                value="publicar"
                disabled={saving || !canPublish}
                title={canPublish ? undefined : 'Indisponível no ambiente local'}
                className="flex-1 inline-flex items-center justify-center gap-3 border border-red-600 bg-ink-raised text-red-400 px-8 py-5 rounded-xl hover:bg-red-500/15 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg"
              >
                Salvar e publicar
              </button>
            )}
            <Link
              href="/admin/blog"
              className="px-8 py-5 border border-white/15 rounded-full hover:bg-white/[0.06] transition-colors font-bold text-neutral-200 text-lg"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
