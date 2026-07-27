'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Truck, Plus, Trash2 } from 'lucide-react'

export default function NovoEquipamentoPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    type: '3 Rodas Li-Ion',
    capacity: '1.500 kg',
    liftingHeight: '4.500 mm',
    batteryVoltage: '80V',
    batteryType: 'Li-Ion',
    turningRadius: '1.450 mm',
    travelSpeed: '14 km/h',
    mainImage: 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp',
    description: '',
    applications: ['Armazéns e Logística', 'Carga e Descarga de Caminhões', 'Operações em Corredores Estreitos'],
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Por favor, informe o título do modelo.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/empilhadeiras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Equipamento cadastrado com sucesso!')
        router.push('/admin/empilhadeiras')
      } else {
        const err = await res.json()
        alert(`Erro ao cadastrar: ${err.error}`)
      }
    } catch (err) {
      alert('Erro na conexão com o servidor.')
    } finally {
      setSubmitting(false)
    }
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
          <div className="font-extrabold text-sm">Cadastrar Novo Equipamento</div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-extrabold text-gray-900">Novo Equipamento</h1>
            <p className="text-xs text-gray-500 font-medium">Preencha as informações técnicas para adicionar a empilhadeira ao catálogo público.</p>
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
                placeholder="Ex: TVL151, EFL302, CPD20L1"
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
                placeholder="Ex: Empilhadeira Elétrica Contrabalançada 3 Rodas 80V 1.5T"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Capacidade de Carga</label>
              <input
                type="text"
                placeholder="Ex: 1.500 kg (1.5T)"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Elevação Máxima</label>
              <input
                type="text"
                placeholder="Ex: 4.500 mm (4,5m)"
                value={formData.liftingHeight}
                onChange={e => setFormData({ ...formData, liftingHeight: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Voltagem da Bateria</label>
              <select
                value={formData.batteryVoltage}
                onChange={e => setFormData({ ...formData, batteryVoltage: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-red-600"
              >
                <option value="80V">80V (High Voltage)</option>
                <option value="48V">48V (Standard Voltage)</option>
                <option value="24V">24V (Compact / Paleteira)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Tipo / Categoria</label>
              <input
                type="text"
                placeholder="Ex: 3 Rodas Li-Ion, 4 Rodas Li-Ion"
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
              placeholder="https://cdn.ep-portal.net/products/..."
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
              placeholder="Descreva as vantagens técnicas e operacionais deste modelo..."
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
              <span>{submitting ? 'Salvando...' : 'Salvar Equipamento'}</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  )
}
