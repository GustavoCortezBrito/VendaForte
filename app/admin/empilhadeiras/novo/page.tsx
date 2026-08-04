'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Save, Upload, ImageIcon, X, Plus, Tag, Zap,
  Layers, Star, Grid3X3, FileText, Eye, CheckCircle2,
  ChevronRight, HelpCircle, Truck, LogOut, ExternalLink
} from 'lucide-react'

// ─── Design Tokens ──────────────────────────────────────────────
const INPUT = [
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3',
  'text-sm text-gray-800 font-medium placeholder:text-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500',
  'transition-all duration-200 shadow-sm',
].join(' ')

const SELECT = [
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3',
  'text-sm text-gray-800 font-medium',
  'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500',
  'transition-all duration-200 shadow-sm',
].join(' ')

const LABEL = 'block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2'

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className={LABEL}>
        {label} {required && <span className="text-red-600 font-bold">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ─── Preview Card do Catálogo (Versão Compacta) ────────────────────
function CatalogCardPreview({ title, subtitle, capacity, liftingHeight, batteryVoltage, mainImage }: {
  title: string; subtitle: string; capacity: string; liftingHeight: string; batteryVoltage: string; mainImage: string
}) {
  const badge = batteryVoltage ? batteryVoltage.trim().toUpperCase().replace(' ', '') : '80V'
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
      <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500">
        <span>Pré-visualização no Site</span>
        <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Catálogo</span>
      </div>
      <div className="relative">
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center overflow-hidden">
          {mainImage ? (
            <img src={mainImage} alt="" className="w-full h-full object-contain p-2"
              onError={e => { (e.target as HTMLImageElement).src = '/sede.png' }} />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-300">
              <ImageIcon size={28} />
              <span className="text-[10px] font-medium">Nenhuma foto</span>
            </div>
          )}
        </div>
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
          {badge} LI-ION
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div>
          <p className="text-sm font-bold text-gray-900 leading-snug">{title || 'Nome do Modelo'}</p>
          <p className="text-[11px] text-red-600 font-semibold mt-0.5 line-clamp-1">{subtitle || 'Subtítulo / Descrição rápida'}</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-gray-50 rounded-lg p-1.5">
            <p className="text-[8px] font-semibold uppercase text-gray-400 tracking-wider">Capacidade</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">{capacity || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-1.5">
            <p className="text-[8px] font-semibold uppercase text-gray-400 tracking-wider">Elevação</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">{liftingHeight || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Container de Seção ────────────────────────────────────────────
function FormSection({ id, icon: Icon, step, title, description, children }: {
  id: string; icon: React.ElementType; step: string; title: string; description: string; children: React.ReactNode
}) {
  return (
    <div id={id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-24">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-sm">
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">{step}</span>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
export default function NovoEquipamentoPage() {
  const router = useRouter()
  const [saving, setSaving]           = useState(false)
  const [uploadMain, setUploadMain]   = useState(false)
  const [uploadGal, setUploadGal]     = useState(false)

  // ── Form States (em branco para novo equipamento) ────────────────
  const [title, setTitle]             = useState('')
  const [slug, setSlug]               = useState('')
  const [subtitle, setSubtitle]       = useState('')
  const [type, setType]               = useState('Elétrica Contrabalançada (3 Rodas)')
  const [capacity, setCapacity]       = useState('')
  const [liftHeight, setLiftHeight]   = useState('')
  const [voltage, setVoltage]         = useState('80 V')
  const [battType, setBattType]       = useState('Li-Ion')
  const [turning, setTurning]         = useState('')
  const [speed, setSpeed]             = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl]                 = useState('')
  const [mainImage, setMainImage]     = useState('')
  const [gallery, setGallery]         = useState<string[]>([])

  // Lista de especificações editáveis
  const [specs, setSpecs]             = useState<[string, string][]>([
    ['Capacidade Nominal', ''],
    ['Elevação Máxima', ''],
    ['Raio de Giro', ''],
    ['Velocidade de Deslocamento', ''],
    ['Voltagem da Bateria', ''],
    ['Tipo de Bateria', 'Li-Ion'],
    ['Tipo de Motor', 'AC PMSM'],
  ])

  // Aplicações
  const [apps, setApps]               = useState<string[]>([
    'Armazéns, logística e centros de distribuição',
    'Carga e descarga de caminhões',
    'Operações industriais e corredores estreitos',
  ])

  // Destaques / Highlights
  const [highlights, setHighlights]   = useState<{ title: string; desc: string }[]>([
    { title: 'Bateria Li-Ion Íon-Lítio', desc: 'Tecnologia avançada com recarga oportunidade em 1h e zero manutenção de água.' },
    { title: 'Ergonomia & Alta Visibilidade', desc: 'Cabine intuitiva com controles ao alcance do operador e amplo mastro panorâmico.' },
    { title: 'Motor de Alta Eficiência', desc: 'Desempenho equivalente a modelos a combustão com custo operacional reduzido.' },
    { title: 'Garantia & Suporte Venda Forte', desc: 'Assistência técnica autorizada em todo o Sul do Brasil e amplo estoque de peças.' },
  ])

  // Cálculo de progresso de preenchimento
  const STATUS = [
    { label: 'Modelo / Nome', ok: !!title.trim() },
    { label: 'Subtítulo do Produto', ok: !!subtitle.trim() },
    { label: 'Capacidade de Carga', ok: !!capacity.trim() },
    { label: 'Elevação Máxima', ok: !!liftHeight.trim() },
    { label: 'Voltagem da Bateria', ok: !!voltage.trim() },
    { label: 'Imagem Principal', ok: !!mainImage.trim() },
  ]
  const completePct = Math.round((STATUS.filter(s => s.ok).length / STATUS.length) * 100)

  // Auto-gerar slug e sugestão de subtítulo ao digitar título
  function onTitleChange(val: string) {
    setTitle(val)
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setSlug(generatedSlug)
    if (!subtitle && val.trim()) {
      setSubtitle(`Empilhadeira Elétrica ${val}`)
    }
  }

  // Upload Imagem Principal
  async function uploadMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadMain(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) { alert((await res.json()).error || 'Erro no upload'); return }
      const { url: imgUrl } = await res.json()
      setMainImage(imgUrl)
      setGallery(prev => prev.includes(imgUrl) ? prev : [imgUrl, ...prev])
    } catch {
      alert('Erro no upload da imagem principal.')
    } finally {
      setUploadMain(false)
      e.target.value = ''
    }
  }

  // Upload Galeria
  async function uploadGalleryImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadGal(true)
    try {
      const urls = (await Promise.all(files.map(async f => {
        const fd = new FormData()
        fd.append('file', f)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        return res.ok ? (await res.json()).url as string : null
      }))).filter(Boolean) as string[]

      setGallery(prev => [...prev, ...urls])
      if (!mainImage && urls[0]) setMainImage(urls[0])
    } catch {
      alert('Erro no upload das imagens da galeria.')
    } finally {
      setUploadGal(false)
      e.target.value = ''
    }
  }

  // Submit Form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      alert('Por favor, informe o Modelo / Título do equipamento.')
      return
    }

    const specsObj: Record<string, string> = {}
    specs.forEach(([k, v]) => {
      if (k.trim()) specsObj[k.trim()] = v
    })

    const payload = {
      id: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      subtitle: subtitle || `Empilhadeira Elétrica ${title}`,
      type,
      capacity,
      liftingHeight: liftHeight,
      batteryVoltage: voltage,
      batteryType: battType,
      turningRadius: turning,
      travelSpeed: speed,
      description,
      url,
      category: 'Empilhadeiras Elétricas',
      categorySlug: 'empilhadeiras-eletricas',
      mainImage: mainImage || gallery[0] || '',
      galleryImages: gallery,
      applications: apps.filter(a => a.trim()),
      highlights,
      specs: specsObj,
    }

    setSaving(true)
    try {
      const res = await fetch('/api/empilhadeiras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('Equipamento cadastrado no catálogo com sucesso!')
        router.push('/admin/empilhadeiras')
      } else {
        const err = await res.json()
        alert(`Erro ao salvar: ${err.error}`)
      }
    } catch {
      alert('Erro na conexão com o servidor.')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-20 font-sans">

      {/* ── Header Admin Completo & Adaptado ───────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
            style={{ width: `${completePct}%` }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo + Tabs + Breadcrumb */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/admin" className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-600/20">
                  VF
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-bold text-gray-900 leading-none block">Venda Forte</span>
                  <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider block">Painel Admin</span>
                </div>
              </Link>

              {/* Tabs de navegação do Admin */}
              <div className="flex items-center gap-1 sm:gap-2 border-l border-gray-200 pl-3 sm:pl-5">
                <Link
                  href="/admin/empilhadeiras"
                  className="px-3 py-1.5 rounded-full bg-red-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Truck size={13} />
                  <span className="hidden md:inline">Empilhadeiras</span>
                </Link>
                <Link
                  href="/admin/blog"
                  className="px-3 py-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText size={13} />
                  <span className="hidden md:inline">Blog</span>
                </Link>
              </div>

              <ChevronRight size={14} className="text-gray-300 hidden sm:block" />
              <span className="font-bold text-gray-900 text-xs sm:text-sm">Novo Equipamento</span>
            </div>

            {/* Ações da direita */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/empilhadeiras-eletricas"
                target="_blank"
                className="text-xs font-semibold text-gray-600 hover:text-red-600 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-full hover:bg-red-50"
                title="Ver site público"
              >
                <ExternalLink size={14} />
                <span className="hidden md:inline">Ver Site</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Sair do Painel"
              >
                <LogOut size={16} />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || uploadMain || uploadGal}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm disabled:opacity-50"
              >
                <Save size={15} />
                <span>{saving ? 'Salvando...' : 'Salvar Equipamento'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Formulário Principal ───────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Coluna Esquerda: Todas as Seções do Formulário */}
          <div className="space-y-6">

            {/* SEÇÃO 1: Identificação Básica */}
            <FormSection
              id="identificacao"
              icon={Tag}
              step="Passo 1"
              title="Identificação do Produto"
              description="Informações principais exibidas no card do catálogo e na busca"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Modelo / Nome do Equipamento" required hint="Ex: TVL151, EFL302, CPD20L1">
                  <input
                    type="text"
                    required
                    placeholder="Ex: TVL151"
                    value={title}
                    onChange={e => onTitleChange(e.target.value)}
                    className={`${INPUT} font-bold text-base`}
                  />
                </Field>

                <Field label="Slug (URL Amigável)" hint={slug ? `/empilhadeiras-eletricas/${slug}` : 'Gerado automaticamente'}>
                  <input
                    type="text"
                    placeholder="tvl151"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field label="Subtítulo Comercial" hint="Aparece em destaque em vermelho abaixo do nome">
                  <input
                    type="text"
                    placeholder="Ex: Empilhadeira Elétrica Contrabalançada 3 Rodas 80V"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field label="Linha / Categoria de Produto">
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className={SELECT}
                  >
                    <option value="Elétrica Contrabalançada (3 Rodas)">3 Rodas (Agilidade & Corredores Estreitos)</option>
                    <option value="Elétrica Contrabalançada (4 Rodas 80V)">4 Rodas (Alta Capacidade 80V)</option>
                    <option value="Linha Compacta (48V / 24V)">Linha Compacta (48V / 24V)</option>
                    <option value="Paleteira & Transpaleteira Elétrica">Paleteiras & Transpaleteiras</option>
                    <option value="Equipamento Autônomo (AGV / AMR)">Equipamentos Autônomos (AGV / AMR)</option>
                    <option value="Uso Misto (Interno / Externo)">Uso Misto (Interno / Externo)</option>
                  </select>
                </Field>

                <Field label="URL Oficial EP Equipment" hint="Link oficial do produto para referência">
                  <input
                    type="text"
                    placeholder="https://ep-equipment.com/product/..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field label="Descrição Curta / Tag" hint="Ex: Global, Heavy-Duty, Lithium-Ion">
                  <input
                    type="text"
                    placeholder="Ex: Global Lithium-Ion"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={INPUT}
                  />
                </Field>
              </div>
            </FormSection>

            {/* SEÇÃO 2: Especificações Principais */}
            <FormSection
              id="especificacoes"
              icon={Zap}
              step="Passo 2"
              title="Especificações Técnicas Principais"
              description="Valores numéricos de capacidade, elevação e voltagem exibidos nos cards"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Capacidade de Carga" required hint="Ex: 1.500 kg, 3.000 kg">
                  <input
                    type="text"
                    placeholder="Ex: 1.500 kg"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field label="Elevação Máxima" required hint="Ex: 4.800 mm, 6.000 mm">
                  <input
                    type="text"
                    placeholder="Ex: 5.000 mm"
                    value={liftHeight}
                    onChange={e => setLiftHeight(e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field label="Voltagem da Bateria" required>
                  <select
                    value={voltage}
                    onChange={e => setVoltage(e.target.value)}
                    className={SELECT}
                  >
                    <option value="80 V">80 V (High Voltage Li-Ion)</option>
                    <option value="48 V">48 V (Standard Li-Ion)</option>
                    <option value="36 V">36 V</option>
                    <option value="24 V">24 V (Compact / Paleteira)</option>
                  </select>
                </Field>

                <Field label="Tipo de Bateria">
                  <select
                    value={battType}
                    onChange={e => setBattType(e.target.value)}
                    className={SELECT}
                  >
                    <option value="Li-Ion">Li-Ion (Íon-Lítio)</option>
                    <option value="PzS">PzS (Chumbo-Ácido)</option>
                    <option value="AGM">AGM</option>
                  </select>
                </Field>

                <Field label="Raio de Giro" hint="Ex: 1.450 mm">
                  <input
                    type="text"
                    placeholder="Ex: 1.450 mm"
                    value={turning}
                    onChange={e => setTurning(e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field label="Velocidade de Deslocamento" hint="Ex: 13/14 km/h">
                  <input
                    type="text"
                    placeholder="Ex: 13/14 km/h"
                    value={speed}
                    onChange={e => setSpeed(e.target.value)}
                    className={INPUT}
                  />
                </Field>
              </div>

              {/* Tabela de Ficha Técnica Completa */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Ficha Técnica Completa</h4>
                    <p className="text-xs text-gray-500">Tabela detalhada de especificações exibida na página do equipamento</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpecs([...specs, ['', '']])}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={13} />
                    <span>Adicionar Linha</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_36px] gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-1 pb-1">
                    <span>Especificação</span>
                    <span>Valor</span>
                    <span></span>
                  </div>
                  {specs.map(([k, v], idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center group">
                      <input
                        type="text"
                        placeholder="Nome (ex: Peso Operacional)"
                        value={k}
                        onChange={e => {
                          const updated = [...specs]
                          updated[idx] = [e.target.value, updated[idx][1]]
                          setSpecs(updated)
                        }}
                        className={`${INPUT} py-2 text-xs`}
                      />
                      <input
                        type="text"
                        placeholder="Valor (ex: 2.950 kg)"
                        value={v}
                        onChange={e => {
                          const updated = [...specs]
                          updated[idx] = [updated[idx][0], e.target.value]
                          setSpecs(updated)
                        }}
                        className={`${INPUT} py-2 text-xs`}
                      />
                      <button
                        type="button"
                        onClick={() => setSpecs(specs.filter((_, j) => j !== idx))}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>

            {/* SEÇÃO 3: Imagens e Galeria */}
            <FormSection
              id="midia"
              icon={ImageIcon}
              step="Passo 3"
              title="Fotos e Mídia do Produto"
              description="Upload da foto principal do catálogo e imagens adicionais da galeria"
            >
              <div className="space-y-6">
                
                {/* Imagem Principal */}
                <div>
                  <label className={LABEL}>Imagem Principal (Card do Catálogo)</label>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-48 aspect-square rounded-2xl border-2 border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt="Preview"
                          className="w-full h-full object-contain p-3"
                          onError={e => { (e.target as HTMLImageElement).src = '/sede.png' }}
                        />
                      ) : (
                        <div className="text-center text-gray-300">
                          <ImageIcon size={40} className="mx-auto mb-1" />
                          <span className="text-xs font-medium">Nenhuma foto</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadMainImage}
                        className="hidden"
                        id="main-image-input"
                        disabled={uploadMain}
                      />
                      <label
                        htmlFor="main-image-input"
                        className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                          uploadMain ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-red-400 hover:bg-red-50/30'
                        }`}
                      >
                        {uploadMain ? (
                          <>
                            <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                            <span className="text-xs font-semibold text-red-600">Enviando imagem...</span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                              <Upload size={22} className="text-red-600" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold text-gray-800">Clique para selecionar do computador</p>
                              <p className="text-[11px] text-gray-400 mt-1">PNG, JPG ou WebP (máx. 5MB)</p>
                            </div>
                          </>
                        )}
                      </label>

                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">URL</span>
                        <input
                          type="text"
                          placeholder="Ou cole a URL direta (https://cdn.ep-portal.net/...)"
                          value={mainImage}
                          onChange={e => setMainImage(e.target.value)}
                          className={`${INPUT} pl-12 text-xs`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Galeria de Fotos */}
                <div className="pt-4 border-t border-gray-100">
                  <label className={LABEL}>Galeria de Imagens Adicionais</label>
                  
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                      {gallery.map((imgUrl, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-full object-contain p-1"
                            onError={e => { (e.target as HTMLImageElement).src = '/sede.png' }}
                          />
                          {imgUrl === mainImage && (
                            <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[8px] font-bold text-center py-0.5 uppercase">
                              Principal
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {imgUrl !== mainImage && (
                              <button
                                type="button"
                                onClick={() => setMainImage(imgUrl)}
                                className="p-1.5 bg-white text-gray-800 rounded-lg shadow hover:text-red-600"
                                title="Definir como principal"
                              >
                                <Eye size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setGallery(gallery.filter((_, j) => j !== idx))}
                              className="p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                              title="Remover"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={uploadGalleryImages}
                      className="hidden"
                      id="gallery-input"
                      disabled={uploadGal}
                    />
                    <label
                      htmlFor="gallery-input"
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer text-xs font-bold transition-all ${
                        uploadGal ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-red-400 hover:bg-red-50/30'
                      }`}
                    >
                      {uploadGal ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          <span>Fazendo upload...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={15} />
                          <span>Adicionar fotos à galeria (múltiplas)</span>
                        </>
                      )}
                    </label>

                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        id="gallery-url-input"
                        placeholder="Cole a URL de uma foto..."
                        className={`${INPUT} text-xs py-2`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inp = document.getElementById('gallery-url-input') as HTMLInputElement
                          if (inp.value.trim()) {
                            setGallery(prev => [...prev, inp.value.trim()])
                            inp.value = ''
                          }
                        }}
                        className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0"
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </FormSection>

            {/* SEÇÃO 4: Aplicações & Destaques */}
            <FormSection
              id="conteudo"
              icon={Star}
              step="Passo 4"
              title="Aplicações & Destaques Comerciais"
              description="Contextos de uso e diferenciais para convencer o cliente"
            >
              {/* Aplicações */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Aplicações Recomendadas</h4>
                    <p className="text-xs text-gray-500">Exemplos de ambientes onde este equipamento se destaca</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApps([...apps, ''])}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    <Plus size={13} />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {apps.map((appText, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={appText}
                        onChange={e => {
                          const updated = [...apps]
                          updated[idx] = e.target.value
                          setApps(updated)
                        }}
                        placeholder={`Aplicação ${idx + 1}`}
                        className={`${INPUT} py-2.5 text-xs flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => setApps(apps.filter((_, j) => j !== idx))}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Diferenciais em Destaque (Highlights)</h4>
                    <p className="text-xs text-gray-500">PONTOS FORTES para a ficha técnica do produto</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHighlights([...highlights, { title: '', desc: '' }])}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    <Plus size={13} />
                    <span>Adicionar Destaque</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Título do destaque (ex: Bateria Íon-Lítio)"
                          value={item.title}
                          onChange={e => {
                            const updated = [...highlights]
                            updated[idx] = { ...updated[idx], title: e.target.value }
                            setHighlights(updated)
                          }}
                          className={`${INPUT} py-2 text-xs font-bold`}
                        />
                        <input
                          type="text"
                          placeholder="Descrição breve do benefício..."
                          value={item.desc}
                          onChange={e => {
                            const updated = [...highlights]
                            updated[idx] = { ...updated[idx], desc: e.target.value }
                            setHighlights(updated)
                          }}
                          className={`${INPUT} py-2 text-xs`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setHighlights(highlights.filter((_, j) => j !== idx))}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </FormSection>

          </div>

          {/* Coluna Direita: Preview Card do Catálogo + Checklist de Progresso + Botão de Salvar (Sticky sem scrollbar visível) */}
          <div className="space-y-3 sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            {/* Live Preview Card */}
            <CatalogCardPreview
              title={title}
              subtitle={subtitle}
              capacity={capacity}
              liftingHeight={liftHeight}
              batteryVoltage={voltage}
              mainImage={mainImage}
            />

            {/* Status & Progresso */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Progresso</span>
                <span className="text-sm font-bold text-red-600">{completePct}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completePct}%` }}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                {STATUS.map(({ label, ok }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className={ok ? 'text-gray-800 font-medium' : 'text-gray-400'}>{label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ok ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {ok ? '✓ OK' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving || uploadMain || uploadGal}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Salvar Equipamento...' : 'Salvar Equipamento'}</span>
              </button>
            </div>

          </div>

        </form>
      </main>
    </div>
  )
}
