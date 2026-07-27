import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getUserFromRequest } from '@/lib/auth'

const jsonFilePath = path.join(process.cwd(), 'lib', 'data', 'electric-forklifts.json')

function getForkliftsData(): any[] {
  try {
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Erro ao ler JSON de empilhadeiras:', error)
    return []
  }
}

function saveForkliftsData(data: any[]): boolean {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Erro ao salvar JSON de empilhadeiras:', error)
    return false
  }
}

// GET - Listar empilhadeiras ou buscar uma por id/slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const forklifts = getForkliftsData()

    if (id || slug) {
      const found = forklifts.find(item => item.id === id || item.slug === slug || item.id === slug)
      if (!found) {
        return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
      }
      return NextResponse.json({ forklift: found })
    }

    return NextResponse.json({ forklifts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao carregar dados' }, { status: 500 })
  }
}

// POST - Criar nova empilhadeira
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, capacity, liftingHeight, batteryVoltage, mainImage, description, type } = body

    if (!title) {
      return NextResponse.json({ error: 'Título do modelo é obrigatório' }, { status: 400 })
    }

    const forklifts = getForkliftsData()
    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const id = body.id || slug

    // Verificar se já existe
    if (forklifts.some(f => f.id === id || f.slug === slug)) {
      return NextResponse.json({ error: 'Já existe um equipamento com este modelo/slug' }, { status: 409 })
    }

    const newForklift = {
      id,
      slug,
      title,
      subtitle: subtitle || `Empilhadeira Elétrica ${title}`,
      type: type || 'Elétrica Contrabalançada',
      capacity: capacity || '1.500 kg',
      liftingHeight: liftingHeight || '4.500 mm',
      batteryVoltage: batteryVoltage || '80V',
      batteryType: body.batteryType || 'Li-Ion',
      turningRadius: body.turningRadius || '1.500 mm',
      travelSpeed: body.travelSpeed || '14 km/h',
      description: description || '',
      applications: body.applications || ['Armazéns', 'Centros Logísticos', 'Operação Interna/Externa'],
      url: body.url || '',
      mainImage: mainImage || 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp',
      galleryImages: body.galleryImages || [],
      specs: body.specs || {
        "Modelo": title,
        "Capacidade": capacity || '1.500 kg',
        "Elevação": liftingHeight || '4.500 mm',
        "Voltagem": batteryVoltage || '80V'
      },
      highlights: body.highlights || [
        { title: "Bateria de Lítio", desc: "Alta eficiência e carga rápida" },
        { title: "Manobrabilidade", desc: "Excelente raio de giro para galpões" }
      ]
    }

    forklifts.unshift(newForklift)
    const saved = saveForkliftsData(forklifts)

    if (!saved) {
      return NextResponse.json({ error: 'Erro ao salvar no arquivo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, forklift: newForklift })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar equipamento' }, { status: 500 })
  }
}

// PUT - Editar empilhadeira existente
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, slug } = body

    if (!id && !slug) {
      return NextResponse.json({ error: 'ID ou Slug é obrigatório' }, { status: 400 })
    }

    const forklifts = getForkliftsData()
    const index = forklifts.findIndex(f => f.id === id || f.slug === slug || f.id === slug)

    if (index === -1) {
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
    }

    const current = forklifts[index]
    const updated = {
      ...current,
      ...body,
      id: current.id,
      slug: current.slug
    }

    forklifts[index] = updated
    const saved = saveForkliftsData(forklifts)

    if (!saved) {
      return NextResponse.json({ error: 'Erro ao atualizar dados' }, { status: 500 })
    }

    return NextResponse.json({ success: true, forklift: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar equipamento' }, { status: 500 })
  }
}

// DELETE - Remover empilhadeira
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    if (!id && !slug) {
      return NextResponse.json({ error: 'ID ou Slug é obrigatório' }, { status: 400 })
    }

    let forklifts = getForkliftsData()
    const initialCount = forklifts.length
    forklifts = forklifts.filter(f => f.id !== id && f.slug !== slug && f.id !== slug)

    if (forklifts.length === initialCount) {
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
    }

    const saved = saveForkliftsData(forklifts)
    if (!saved) {
      return NextResponse.json({ error: 'Erro ao salvar remoção' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao deletar equipamento' }, { status: 500 })
  }
}
