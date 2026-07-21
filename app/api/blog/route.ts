import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

// Fallback: buscar posts de arquivos .md se Supabase não estiver configurado
import { getAllPosts as getAllPostsFromFiles, getPostBySlug as getPostBySlugFromFiles } from '@/lib/blog'

// Verificar se Supabase está configurado
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// GET - Listar todos os posts OU buscar um post específico por slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const published = searchParams.get('published')

    // Se Supabase não estiver configurado, usar arquivos .md
    if (!isSupabaseConfigured) {
      console.log('⚠️  Supabase não configurado, usando arquivos .md')
      
      if (slug) {
        const post = getPostBySlugFromFiles(slug)
        if (!post) {
          return NextResponse.json(
            { error: 'Post não encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({ post })
      }

      const posts = getAllPostsFromFiles()
      return NextResponse.json({ posts })
    }

    // Se slug for fornecido, retorna post específico
    if (slug) {
      const { data: post, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !post) {
        return NextResponse.json(
          { error: 'Post não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({ post })
    }

    // Caso contrário, retorna todos os posts
    let query = supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtrar apenas publicados se especificado
    if (published === 'true') {
      query = query.eq('published', true)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Erro ao buscar posts:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts: posts || [] })
  } catch (error: any) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar posts' },
      { status: 500 }
    )
  }
}

// POST - Criar novo post (requer autenticação)
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { slug, title, description, content, image, category, tags, author, published } = body

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug e título são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se slug já existe
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Post com este slug já existe' },
        { status: 409 }
      )
    }

    // Calcular tempo de leitura
    const wordCount = content ? content.trim().split(/\s+/).length : 0
    const readingTime = `${Math.ceil(wordCount / 200)} min de leitura`

    // Criar post usando supabaseAdmin (para respeitar RLS do Supabase)
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        slug,
        title,
        description: description || '',
        content: content || '',
        image: image || '/sede.png',
        category: category || 'Geral',
        tags: tags || [],
        author: author || user.name,
        published: published ?? true,
        reading_time: readingTime,
        author_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar post no Supabase:', error)
      return NextResponse.json(
        { error: `Erro ao criar post: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    console.error('Erro ao criar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao criar post' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar post existente (requer autenticação)
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { slug, title, description, content, image, category, tags, author, published } = body

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug é obrigatório' },
        { status: 400 }
      )
    }

    // Calcular tempo de leitura
    const wordCount = content ? content.trim().split(/\s+/).length : 0
    const readingTime = `${Math.ceil(wordCount / 200)} min de leitura`

    // Atualizar post usando supabaseAdmin
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        title,
        description,
        content,
        image,
        category,
        tags,
        author,
        published,
        reading_time: readingTime
      })
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar post no Supabase:', error)
      return NextResponse.json(
        { error: `Erro ao atualizar post: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao atualizar post' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar post (requer autenticação de admin)
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Apenas administradores podem deletar posts' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug é obrigatório' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Erro ao deletar post no Supabase:', error)
      return NextResponse.json(
        { error: `Erro ao deletar post: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao deletar post' },
      { status: 500 }
    )
  }
}
