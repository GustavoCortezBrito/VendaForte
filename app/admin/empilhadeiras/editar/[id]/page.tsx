'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Save, Upload, ImageIcon, X, Plus, Tag, Zap,
  Layers, Star, Grid3X3, FileText, Eye, CheckCircle2, ChevronRight, Pencil,
  Truck, LogOut, ExternalLink
} from 'lucide-react'

interface Props { params: Promise<{ id: string }> }

const INPUT = [
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3',
  'text-sm text-gray-800 font-medium placeholder:text-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500',
  'transition-all duration-200 shadow-sm',
].join(' ')

const LABEL = 'block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2'

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

function CatalogCardPreview({ title, subtitle, capacity, liftingHeight, batteryVoltage, mainImage }: {
  title: string; subtitle: string; capacity: string; liftingHeight: string; batteryVoltage: string; mainImage: string
}) {
  const badge = batteryVoltage.trim().toUpperCase().replace(' ', '') || '80V'
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center overflow-hidden">
          {mainImage ? (
            <img src={mainImage} alt="" className="w-full h-full object-contain p-4"
              onError={e => { (e.target as HTMLImageElement).src = '/sede.png' }} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <ImageIcon size={36} />
              <span className="text-[11px] font-semibold">Sem imagem</span>
            </div>
          )}
        </div>
        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider shadow">
          {badge} LI-ION
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-base font-bold text-gray-900">{title || '—'}</p>
          <p className="text-xs text-red-600 font-semibold mt-0.5">{subtitle || '—'}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-[9px] font-semibold uppercase text-gray-400 tracking-wider">Capacidade</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{capacity || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-[9px] font-semibold uppercase text-gray-400 tracking-wider">Elevação</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{liftingHeight || '—'}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="w-full bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl text-center">Ver Ficha Técnica →</div>
          <div className="w-full bg-green-500 text-white text-xs font-semibold py-2.5 rounded-xl text-center">📱 Orçamento</div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon: Icon, label, title, children }: {
  icon: React.ElementType; label: string; title: string; children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-sm">
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">{label}</p>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

const TABS = [
  { key: 'identificacao', label: 'Identificação', icon: Tag },
  { key: 'specs',         label: 'Especificações', icon: Zap },
  { key: 'midia',         label: 'Mídia',          icon: ImageIcon },
  { key: 'conteudo',      label: 'Conteúdo',       icon: FileText },
] as const

type Tab = typeof TABS[number]['key']

export default function EditarEquipamentoPage({ params }: Props) {
  const router = useRouter()
  const { id } = use(params)

  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploadMain, setUpMain]   = useState(false)
  const [uploadGal, setUpGal]     = useState(false)
  const [tab, setTab]             = useState<Tab>('identificacao')

  const [formId,      setFormId]     = useState('')
  const [slug,        setSlug]       = useState('')
  const [title,       setTitle]      = useState('')
  const [subtitle,    setSubtitle]   = useState('')
  const [type,        setType]       = useState('')
  const [capacity,    setCapacity]   = useState('')
  const [liftHeight,  setLiftH]      = useState('')
  const [voltage,     setVoltage]    = useState('80 V')
  const [battType,    setBattType]   = useState('Li-Ion')
  const [turning,     setTurning]    = useState('')
  const [speed,       setSpeed]      = useState('')
  const [description, setDesc]       = useState('')
  const [url,         setUrl]        = useState('')
  const [mainImage,   setMainImage]  = useState('')
  const [gallery,     setGallery]    = useState<string[]>([])
  const [apps,        setApps]       = useState<string[]>([])
  const [highlights,  setHighlights] = useState<{ title: string; desc: string }[]>([])
  const [specs,       setSpecs]      = useState<[string, string][]>([])

  useEffect(() => {
    fetch(`/api/empilhadeiras?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.forklift) { alert('Equipamento não encontrado.'); router.push('/admin/empilhadeiras'); return }
        const f = d.forklift
        setFormId(f.id||''); setSlug(f.slug||''); setTitle(f.title||'')
        setSubtitle(f.subtitle||''); setType(f.type||''); setCapacity(f.capacity||'')
        setLiftH(f.liftingHeight||''); setVoltage(f.batteryVoltage||'80 V')
        setBattType(f.batteryType||'Li-Ion'); setTurning(f.turningRadius||'')
        setSpeed(f.travelSpeed||''); setDesc(f.description||''); setUrl(f.url||'')
        setMainImage(f.mainImage||''); setGallery(f.galleryImages||[])
        setApps(f.applications||[]); setHighlights(f.highlights||[])
        const rows: [string,string][] = Object.entries(f.specs||{}).map(([k,v])=>[k,String(v??'')])
        setSpecs(rows.length ? rows : [['','']])
      })
      .catch(() => { alert('Erro ao carregar.'); router.push('/admin/empilhadeiras') })
      .finally(() => setLoading(false))
  }, [id, router])

  const STATUS = [
    { label: 'Título',     ok: !!title },
    { label: 'Subtítulo',  ok: !!subtitle },
    { label: 'Capacidade', ok: !!capacity },
    { label: 'Elevação',   ok: !!liftHeight },
    { label: 'Voltagem',   ok: !!voltage },
    { label: 'Imagem',     ok: !!mainImage },
  ]
  const pct = Math.round((STATUS.filter(s=>s.ok).length / STATUS.length) * 100)

  async function uploadMain_fn(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setUpMain(true)
    try {
      const fd=new FormData(); fd.append('file',f)
      const r=await fetch('/api/upload',{method:'POST',body:fd})
      if (!r.ok){alert((await r.json()).error||'Erro');return}
      const {url:u}=await r.json()
      setMainImage(u); setGallery(p=>p.includes(u)?p:[u,...p])
    } catch {alert('Erro no upload')}
    finally {setUpMain(false);e.target.value=''}
  }

  async function uploadGal_fn(e: React.ChangeEvent<HTMLInputElement>) {
    const files=Array.from(e.target.files||[]); if (!files.length) return
    setUpGal(true)
    try {
      const urls=(await Promise.all(files.map(async f=>{
        const fd=new FormData();fd.append('file',f)
        const r=await fetch('/api/upload',{method:'POST',body:fd})
        return r.ok?(await r.json()).url as string:null
      }))).filter(Boolean) as string[]
      setGallery(p=>[...p,...urls])
    } catch {alert('Erro no upload da galeria')}
    finally {setUpGal(false);e.target.value=''}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()){alert('Informe o Modelo / Título.');return}
    const specsObj:Record<string,string>={}
    specs.forEach(([k,v])=>{if(k.trim())specsObj[k.trim()]=v})
    const payload = {
      id:formId, slug, title, subtitle, type, capacity,
      liftingHeight:liftHeight, batteryVoltage:voltage, batteryType:battType,
      turningRadius:turning, travelSpeed:speed, description, url,
      category:'Empilhadeiras Elétricas', categorySlug:'empilhadeiras-eletricas',
      mainImage, galleryImages:gallery, applications:apps.filter(a=>a.trim()),
      highlights, specs:specsObj,
    }
    setSaving(true)
    try {
      const res = await fetch('/api/empilhadeiras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        alert('Equipamento atualizado com sucesso!')
        router.push('/admin/empilhadeiras')
      } else {
        const err = await res.json()
        alert(`Erro: ${err.error}`)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-600">Carregando equipamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">

      {/* ── Header Admin Completo & Adaptado ───────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="h-0.5 bg-gray-100">
          <div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500" style={{ width:`${pct}%` }} />
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
              <span className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">
                Editar: <span className="text-red-600">{title || '...'}</span>
              </span>
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
                disabled={saving||uploadMain||uploadGal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-5 py-2 rounded-full hover:shadow-lg transition-all font-semibold text-xs disabled:opacity-50"
              >
                <Save size={14} />
                <span>{saving ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Body ───────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

            {/* ── MAIN ── */}
            <div className="space-y-5">
              <AnimatePresence mode="wait">

                {tab === 'identificacao' && (
                  <motion.div key="ident" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}} className="space-y-5">
                    <Section icon={Tag} label="Editar" title="Identificação do Produto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Modelo / Título *">
                          <input type="text" required value={title} onChange={e=>setTitle(e.target.value)} className={`${INPUT} text-base font-bold`} />
                        </Field>
                        <Field label="Slug (URL)" hint={`/empilhadeiras-eletricas/${slug}`}>
                          <input type="text" value={slug} onChange={e=>setSlug(e.target.value)} className={INPUT} />
                        </Field>
                        <Field label="Subtítulo" hint="Aparece em vermelho no catálogo">
                          <input type="text" value={subtitle} onChange={e=>setSubtitle(e.target.value)} className={INPUT} />
                        </Field>
                        <Field label="Tipo / Categoria">
                          <input type="text" value={type} onChange={e=>setType(e.target.value)} className={INPUT} />
                        </Field>
                        <Field label="URL Oficial EP Equipment">
                          <input type="text" value={url} onChange={e=>setUrl(e.target.value)} className={INPUT} />
                        </Field>
                        <Field label="Descrição / Tag">
                          <input type="text" value={description} onChange={e=>setDesc(e.target.value)} className={INPUT} />
                        </Field>
                      </div>
                    </Section>
                  </motion.div>
                )}

                {tab === 'specs' && (
                  <motion.div key="specs" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}} className="space-y-5">
                    <Section icon={Zap} label="Editar" title="Dados Técnicos Principais">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          {label:'Capacidade de Carga', val:capacity, set:setCapacity, ph:'1500 kg'},
                          {label:'Elevação Máxima',     val:liftHeight, set:setLiftH, ph:'5000 mm'},
                          {label:'Raio de Giro',        val:turning, set:setTurning, ph:'1450 mm'},
                          {label:'Velocidade',          val:speed, set:setSpeed, ph:'13/14 km/h'},
                        ].map(f=>(
                          <Field key={f.label} label={f.label}>
                            <input type="text" placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} className={INPUT} />
                          </Field>
                        ))}
                        <Field label="Voltagem da Bateria">
                          <select value={voltage} onChange={e=>setVoltage(e.target.value)} className={INPUT}>
                            <option value="80 V">80 V — High Voltage Li-Ion</option>
                            <option value="48 V">48 V — Standard Li-Ion</option>
                            <option value="36 V">36 V</option>
                            <option value="24 V">24 V — Compacto</option>
                          </select>
                        </Field>
                        <Field label="Tipo de Bateria">
                          <select value={battType} onChange={e=>setBattType(e.target.value)} className={INPUT}>
                            <option value="Li-Ion">Li-Ion (Lítio)</option>
                            <option value="PzS">PzS (Chumbo-Ácido)</option>
                            <option value="AGM">AGM</option>
                          </select>
                        </Field>
                      </div>
                    </Section>

                    <Section icon={Grid3X3} label="Opcional" title="Ficha Técnica Completa">
                      <p className="text-xs text-gray-400 mb-4">Tabela de especificações exibida na página de detalhe.</p>
                      <div className="space-y-2">
                        <div className="grid grid-cols-[1fr_1fr_32px] gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-1 pb-2 border-b border-gray-100">
                          <span>Especificação</span><span>Valor</span><span></span>
                        </div>
                        {specs.map(([k,v],i)=>(
                          <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center group">
                            <input type="text" placeholder="Ex: Capacidade Nominal" value={k}
                              onChange={e=>{const r=[...specs];r[i]=[e.target.value,r[i][1]];setSpecs(r)}}
                              className={`${INPUT} text-xs py-2`}/>
                            <input type="text" placeholder="Ex: 1500 kg" value={v}
                              onChange={e=>{const r=[...specs];r[i]=[r[i][0],e.target.value];setSpecs(r)}}
                              className={`${INPUT} text-xs py-2`}/>
                            <button type="button" onClick={()=>setSpecs(specs.filter((_,j)=>j!==i))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                              <X size={13}/>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={()=>setSpecs([...specs,['','']])}
                          className="mt-2 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-semibold">
                          <Plus size={14}/> Adicionar linha
                        </button>
                      </div>
                    </Section>
                  </motion.div>
                )}

                {tab === 'midia' && (
                  <motion.div key="midia" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}} className="space-y-5">
                    <Section icon={ImageIcon} label="Editar" title="Imagem Principal">
                      <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex-shrink-0 w-full sm:w-48">
                          <div className="w-full aspect-square rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-slate-100 overflow-hidden flex items-center justify-center">
                            {mainImage?(
                              <img src={mainImage} alt="" className="w-full h-full object-contain p-3"
                                onError={e=>{(e.target as HTMLImageElement).src='/sede.png'}}/>
                            ):(
                              <div className="text-center text-gray-300"><ImageIcon size={36} className="mx-auto mb-1"/><span className="text-[11px] font-medium">Sem imagem</span></div>
                            )}
                          </div>
                          {mainImage&&(
                            <button type="button" onClick={()=>setMainImage('')}
                              className="mt-2 w-full text-xs text-gray-400 hover:text-red-600 transition-colors font-medium py-1 flex items-center justify-center gap-1">
                              <X size={12}/> Remover
                            </button>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <input type="file" accept="image/*" onChange={uploadMain_fn} className="hidden" id="main-edit" disabled={uploadMain}/>
                          <label htmlFor="main-edit"
                            className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                              uploadMain?'border-red-300 bg-red-50/50':'border-gray-200 hover:border-red-400 hover:bg-red-50/30'
                            }`}>
                            {uploadMain?(
                              <><div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"/>
                              <span className="text-sm font-semibold text-red-600">Fazendo upload...</span></>
                            ):(
                              <><div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                <Upload size={22} className="text-red-500"/>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">Clique para trocar a imagem</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · máx. 5MB</p>
                              </div></>
                            )}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">URL</span>
                            <input type="text" placeholder="https://cdn.ep-portal.net/products/..."
                              value={mainImage} onChange={e=>setMainImage(e.target.value)}
                              className={`${INPUT} pl-12 text-xs`}/>
                          </div>
                        </div>
                      </div>
                    </Section>

                    <Section icon={Layers} label="Opcional" title="Galeria de Imagens">
                      {gallery.length>0&&(
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                          {gallery.map((img,i)=>(
                            <div key={i} className="relative group">
                              <div className={`aspect-square rounded-xl overflow-hidden border-2 bg-gray-50 flex items-center justify-center ${img===mainImage?'border-red-500 shadow-sm shadow-red-200':'border-gray-100'}`}>
                                <img src={img} alt="" className="w-full h-full object-contain p-1"
                                  onError={e=>{(e.target as HTMLImageElement).src='/sede.png'}}/>
                              </div>
                              {img===mainImage&&(<span className="absolute bottom-0 left-0 right-0 text-center text-[8px] bg-red-600 text-white rounded-b-xl font-bold py-0.5">PRINCIPAL</span>)}
                              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                                {img!==mainImage&&(<button type="button" onClick={()=>setMainImage(img)} className="p-1.5 bg-white rounded-lg shadow-sm text-gray-700 hover:text-red-600"><Eye size={11}/></button>)}
                                <button type="button" onClick={()=>setGallery(gallery.filter((_,j)=>j!==i))} className="p-1.5 bg-red-600 rounded-lg shadow-sm text-white"><X size={11}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input type="file" accept="image/*" multiple onChange={uploadGal_fn} className="hidden" id="gal-edit" disabled={uploadGal}/>
                        <label htmlFor="gal-edit"
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer text-sm font-semibold transition-all ${
                            uploadGal?'border-red-300 bg-red-50 text-red-600':'border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50/30'
                          }`}>
                          {uploadGal?<><div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/>Enviando...</>:<><Upload size={14}/>Adicionar à galeria</>}
                        </label>
                        <div className="flex gap-2 flex-1">
                          <input type="text" id="gurl-edit" placeholder="URL de imagem..." className={`${INPUT} text-xs flex-1 py-2.5`}/>
                          <button type="button"
                            onClick={()=>{const el=document.getElementById('gurl-edit') as HTMLInputElement;if(el.value.trim()){setGallery(p=>[...p,el.value.trim()]);el.value=''}}}
                            className="px-4 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-700 transition-colors flex-shrink-0">+URL</button>
                        </div>
                      </div>
                    </Section>
                  </motion.div>
                )}

                {tab === 'conteudo' && (
                  <motion.div key="cont" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}} className="space-y-5">
                    <Section icon={Tag} label="Editar" title="Aplicações">
                      <p className="text-xs text-gray-400 mb-4">Contextos de uso listados na ficha técnica do produto.</p>
                      <div className="space-y-2.5">
                        {apps.map((app,i)=>(
                          <div key={i} className="flex items-center gap-3 group">
                            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"/>
                            <input type="text" value={app}
                              onChange={e=>{const a=[...apps];a[i]=e.target.value;setApps(a)}}
                              placeholder={`Aplicação ${i+1}`} className={`${INPUT} flex-1 py-2.5 text-sm`}/>
                            <button type="button" onClick={()=>setApps(apps.filter((_,j)=>j!==i))}
                              className="p-2 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={()=>setApps([...apps,''])}
                          className="mt-1 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-semibold">
                          <Plus size={14}/> Adicionar aplicação
                        </button>
                      </div>
                    </Section>

                    <Section icon={Star} label="Opcional" title="Destaques / Highlights">
                      <p className="text-xs text-gray-400 mb-4">Diferenciais exibidos em destaque na ficha técnica.</p>
                      <div className="space-y-3">
                        {highlights.map((h,i)=>(
                          <div key={i} className="group flex gap-3 items-start p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 shadow-sm">
                              {i+1}
                            </div>
                            <div className="flex-1 space-y-2">
                              <input type="text" placeholder="Título" value={h.title}
                                onChange={e=>{const hs=[...highlights];hs[i]={...hs[i],title:e.target.value};setHighlights(hs)}}
                                className={`${INPUT} text-sm font-semibold py-2.5`}/>
                              <input type="text" placeholder="Descrição" value={h.desc}
                                onChange={e=>{const hs=[...highlights];hs[i]={...hs[i],desc:e.target.value};setHighlights(hs)}}
                                className={`${INPUT} text-sm py-2.5`}/>
                            </div>
                            <button type="button" onClick={()=>setHighlights(highlights.filter((_,j)=>j!==i))}
                              className="p-2 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={()=>setHighlights([...highlights,{title:'',desc:''}])}
                          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-semibold">
                          <Plus size={14}/> Adicionar destaque
                        </button>
                      </div>
                    </Section>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* ── SIDEBAR (Acompanha o scroll sem barra visível) ── */}
            <div className="space-y-3 sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">Pré-visualização</p>
                <CatalogCardPreview title={title} subtitle={subtitle} capacity={capacity}
                  liftingHeight={liftHeight} batteryVoltage={voltage} mainImage={mainImage}/>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Progresso</p>
                  <span className="text-sm font-bold text-red-600">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" style={{width:`${pct}%`}}/>
                </div>
                <div className="space-y-2.5">
                  {STATUS.map(({label,ok})=>(
                    <div key={label} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${ok?'bg-emerald-500':'bg-gray-100 border-2 border-gray-200'}`}>
                        {ok&&<CheckCircle2 size={10} className="text-white"/>}
                      </div>
                      <span className={`text-xs font-medium ${ok?'text-gray-700':'text-gray-400'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2.5">
                <button type="submit" disabled={saving||uploadMain||uploadGal}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm disabled:opacity-50 disabled:scale-100">
                  <Save size={16}/>
                  {saving?'Salvando...':'Salvar Alterações'}
                </button>
                <Link href="/admin/empilhadeiras"
                  className="w-full flex items-center justify-center text-sm font-medium text-gray-400 hover:text-red-600 transition-colors py-2">
                  Cancelar
                </Link>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
