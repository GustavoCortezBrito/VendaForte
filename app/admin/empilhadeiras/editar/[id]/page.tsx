'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditarEquipamentoPage({ params }: Props) {
  const router = useRouter()
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    title: '',
    subtitle: '',
    type: '',
    capacity: '',
    liftingHeight: '',
    batteryVoltage: '',
    batteryType: 'Li-Ion',
    turningRadius: '',
    travelSpeed: '',
    mainImage: '',
    description: '',
  })

  useEffect(() => {
    fetch(`/api/empilhadeiras?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.forklift) {
          setFormData(data.forklift)
        } else {
          alert('Equipamento não encontrado.')
          router.push('/admin/empilhadeiras')
        }
      })
      .catch(err => {
        console.error(err)
        alert('Erro ao carregar dados do equipamento.')
      })
      .finally(() => setLoading(false))
  }, [id, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Por favor, informe o título do modelo.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/empilhadeiras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Equipamento atualizado com sucesso!')
        router.push('/admin/empilhadeiras')
      } else {
        const err = await res.json()
        alert(`Erro ao atualizar: ${err.error}`)
      }
    } catch (err) {
      alert('Erro na conexão com o servidor.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-700">Carregando dados do equipamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Top Bar */}
      <header className="bg-gray-900 text-white sticky top-0 z-50 border-b border-gray-800 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin/empilhadeiras"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Painel</span>
          </Link>
          <div className="font-extrabold text-sm">Editar Equipamento ({formData.title})</div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-extrabold text-gray-900">Editar Modelo: {formData.title}</h1>
            <p className="text-xs text-gray-500 font-medium">Altere as informações do equipamento conforme necessário.</p>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
                Modelo / Título <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
                Subtítulo do Produto
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Capacidade de Carga</label>
              <input
                type="text"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Elevação Máxima</label>
              <input
                type="text"
                value={formData.liftingHeight}
                onChange={e => setFormData({ ...formData, liftingHeight: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Voltagem da Bateria</label>
              <input
                type="text"
                value={formData.batteryVoltage}
                onChange={e => setFormData({ ...formData, batteryVoltage: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Tipo / Categoria</label>
              <input
                type="text"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

          </div>

          {/* Main Image URL */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">URL da Imagem Principal</label>
            <input
              type="text"
              value={formData.mainImage}
              onChange={e => setFormData({ ...formData, mainImage: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
            />
            {formData.mainImage && (
              <div className="mt-2 w-28 h-20 bg-white border border-gray-200 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                <img src={formData.mainImage} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Descrição Comercial</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Link
              href="/admin/empilhadeiras"
              className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{submitting ? 'Atualizando...' : 'Atualizar Equipamento'}</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  )
}
