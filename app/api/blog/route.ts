import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

// Fallback: buscar posts de arquivos .md se Supabase não estiver configurado
import { getAllPosts as getAllPostsFromFiles, getPostBySlug as getPostBySlugFromFiles, createPost, updatePost, deletePost } from '@/lib/blog'

// Verificar se Supabase está configurado
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// GET - Listar todos os posts OU buscar um post específico por slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const published = searchParams.get('published')

    // Helper para formatar posts de arquivos .md locais
    const getLocalPosts = () => {
      const filePosts = getAllPostsFromFiles()
      return filePosts.map(p => ({
        ...p,
        created_at: p.date,
        reading_time: p.readingTime,
        published: true
      }))
    }

    // Se slug for fornecido, retorna post específico
    if (slug) {
      if (isSupabaseConfigured) {
        try {
          const { data: post, error } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single()

          if (!error && post) {
            return NextResponse.json({ post })
          }
        } catch (err) {
          console.warn('⚠️ Supabase indisponível para post individual, buscando nos arquivos locais.')
        }
      }

      const post = await getPostBySlugFromFiles(slug)
      if (!post) {
        return NextResponse.json(
          { error: 'Post não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        post: {
          ...post,
          created_at: post.date,
          reading_time: post.readingTime,
          published: true
        }
      })
    }

    // Listar todos os posts com fallback para arquivos locais
    if (isSupabaseConfigured) {
      try {
        let query = supabaseAdmin
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (published === 'true') {
          query = query.eq('published', true)
        }

        const { data: posts, error } = await query

        if (!error && posts && posts.length > 0) {
          return NextResponse.json({ posts })
        }
      } catch (err) {
        console.warn('⚠️ Supabase indisponível, usando fallback de posts locais (.md)')
      }
    }

    // Fallback seguro: carregar os posts .md da pasta content/blog
    const localPosts = getLocalPosts()
    return NextResponse.json({ posts: localPosts })
  } catch (error: any) {
    console.error('Erro na API de blog, carregando arquivos locais:', error)
    const localPosts = getAllPostsFromFiles().map(p => ({
      ...p,
      created_at: p.date,
      reading_time: p.readingTime,
      published: true
    }))
    return NextResponse.json({ posts: localPosts })
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

    // Calcular tempo de leitura
    const wordCount = content ? content.trim().split(/\s+/).length : 0
    const readingTime = `${Math.ceil(wordCount / 200)} min de leitura`

    if (isSupabaseConfigured) {
      try {
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

        if (!error && post) {
          // Criar também cópia local de segurança
          createPost(slug, { title, description, content, image, category, tags, author, date: new Date().toISOString() })
          return NextResponse.json({ success: true, post })
        }
      } catch (err) {
        console.warn('⚠️ Supabase indisponível, salvando post localmente (.md)')
      }
    }

    // Fallback: criar arquivo .md local
    const createdLocal = createPost(slug, {
      title,
      description,
      content,
      image,
      category,
      tags,
      author: author || user.name,
      date: new Date().toISOString()
    })

    if (!createdLocal) {
      return NextResponse.json(
        { error: 'Erro ao criar post localmente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post: {
        slug,
        title,
        description,
        content,
        image,
        category,
        tags,
        author: author || user.name,
        created_at: new Date().toISOString(),
        reading_time: readingTime,
        published: true
      }
    })
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

    if (isSupabaseConfigured) {
      try {
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

        if (!error && post) {
          updatePost(slug, { title, description, content, image, category, tags, author, date: new Date().toISOString() })
          return NextResponse.json({ success: true, post })
        }
      } catch (err) {
        console.warn('⚠️ Supabase indisponível, atualizando post localmente (.md)')
      }
    }

    // Fallback: atualizar arquivo .md local
    updatePost(slug, {
      title,
      description,
      content,
      image,
      category,
      tags,
      author: author || user.name,
      date: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
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

    if (isSupabaseConfigured) {
      try {
        await supabaseAdmin
          .from('posts')
          .delete()
          .eq('slug', slug)
      } catch (err) {
        console.warn('⚠️ Supabase indisponível ao deletar, removendo localmente (.md)')
      }
    }

    // Deletar também localmente
    deletePost(slug)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao deletar post' },
      { status: 500 }
    )
  }
}
