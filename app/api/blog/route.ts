import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'
import { isLocalRequest, LOCAL_BLOCK_MESSAGE } from '@/lib/environment'

// Fallback: buscar posts de arquivos .md se Supabase não estiver configurado
import { getAllPosts as getAllPostsFromFiles, getPostBySlug as getPostBySlugFromFiles, createPost, updatePost, deletePost } from '@/lib/blog'

// Verificar se Supabase está configurado
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Tempo máximo de espera pelo Supabase nas leituras. Sem ele, um banco fora do
// ar deixava cada chamada esperando ~7 s antes de cair nos arquivos locais.
const SUPABASE_READ_TIMEOUT_MS = 3000

// As páginas públicas do blog são geradas no servidor e ficam em cache. Ao criar,
// editar ou apagar um post, marca-as para atualizar na próxima visita: a listagem,
// as páginas numeradas, as categorias, a busca e os artigos ficam todos sob /blog.
function refreshPublicBlog() {
  revalidatePath('/blog', 'layout')
  revalidatePath('/sitemap.xml')
}

// No ambiente local o painel só mexe em rascunhos (o .env.local aponta para o banco de produção)
const blockedLocally = () => NextResponse.json({ error: LOCAL_BLOCK_MESSAGE, local: true }, { status: 403 })

// O post está no ar agora? Se o banco não responder, não há como afirmar: segue o fluxo normal
async function isLive(slug: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  try {
    const { data } = await supabaseAdmin
      .from('posts')
      .select('published')
      .eq('slug', slug)
      .abortSignal(AbortSignal.timeout(SUPABASE_READ_TIMEOUT_MS))
      .maybeSingle()
    return data?.published === true
  } catch {
    return false
  }
}

// GET - Listar todos os posts OU buscar um post específico por slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const published = searchParams.get('published')
    // Rascunhos (published = false) só saem para quem está logado no painel
    const onlyPublished = !getUserFromRequest(request)

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
          let postQuery = supabaseAdmin.from('posts').select('*').eq('slug', slug)
          if (onlyPublished) postQuery = postQuery.eq('published', true)
          const { data: post, error } = await postQuery
            .abortSignal(AbortSignal.timeout(SUPABASE_READ_TIMEOUT_MS))
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

        if (published === 'true' || onlyPublished) {
          query = query.eq('published', true)
        }

        const { data: posts, error } = await query.abortSignal(AbortSignal.timeout(SUPABASE_READ_TIMEOUT_MS))

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

    // Criar um post já no ar é publicar
    if (published !== false && isLocalRequest(request.headers)) return blockedLocally()

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
            published_at: published === false ? null : new Date().toISOString(),
            reading_time: readingTime,
            author_id: user.id
          })
          .select()
          .single()

        if (!error && post) {
          // Cópia local de segurança, só de post publicado: um rascunho em content/blog apareceria no site
          if (published !== false) {
            createPost(slug, { title, description, content, image, category, tags, author, date: new Date().toISOString() })
          }
          refreshPublicBlog()
          return NextResponse.json({ success: true, post })
        }
      } catch (err) {
        console.warn('⚠️ Supabase indisponível, salvando post localmente (.md)')
      }
    }

    // Rascunho não tem reserva em arquivo: sem o banco, o melhor é avisar e não salvar
    if (published === false) {
      return NextResponse.json(
        { error: 'O banco de dados está indisponível e o rascunho não foi salvo. Tente de novo em instantes.' },
        { status: 503 }
      )
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

    refreshPublicBlog()
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

    // Localmente: nem publicar um rascunho, nem alterar o texto de um post que já está no ar
    if (isLocalRequest(request.headers) && (published === true || (await isLive(slug)))) return blockedLocally()

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
          if (published !== false && post.published !== false) {
            updatePost(slug, { title, description, content, image, category, tags, author, date: new Date().toISOString() })
          }
          refreshPublicBlog()
          return NextResponse.json({ success: true, post })
        }
      } catch (err) {
        console.warn('⚠️ Supabase indisponível, atualizando post localmente (.md)')
      }
    }

    if (published === false) {
      return NextResponse.json(
        { error: 'O banco de dados está indisponível e as alterações do rascunho não foram salvas.' },
        { status: 503 }
      )
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

    refreshPublicBlog()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao atualizar post' },
      { status: 500 }
    )
  }
}

// PATCH - Publicar ou despublicar um post (requer autenticação)
export async function PATCH(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (isLocalRequest(request.headers)) return blockedLocally()

    const { slug, published } = await request.json()
    if (!slug || typeof slug !== 'string' || typeof published !== 'boolean') {
      return NextResponse.json({ error: 'Informe o slug e se o post deve ficar publicado' }, { status: 400 })
    }
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: 'O banco de dados não está configurado' }, { status: 503 })
    }

    const { data: current, error: readError } = await supabaseAdmin
      .from('posts')
      .select('slug,title,description,content,image,category,published')
      .eq('slug', slug)
      .abortSignal(AbortSignal.timeout(SUPABASE_READ_TIMEOUT_MS))
      .maybeSingle()

    if (readError) {
      return NextResponse.json({ error: 'Não foi possível ler o post. Tente de novo em instantes.' }, { status: 503 })
    }
    if (!current) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    if (published) {
      // Não publica um post incompleto
      const missing = [
        !current.title?.trim() && 'título',
        !current.description?.trim() && 'descrição',
        !current.content?.trim() && 'texto',
        !current.category?.trim() && 'categoria',
        !current.image?.trim() && 'capa',
      ].filter(Boolean)
      if (missing.length) {
        return NextResponse.json({ error: `Antes de publicar, preencha: ${missing.join(', ')}.` }, { status: 400 })
      }
    }

    // Ao publicar, a data do post passa a ser a de hoje; ao despublicar, a data anterior fica guardada
    const update = published ? { published: true, published_at: new Date().toISOString() } : { published: false }
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update(update)
      .eq('slug', slug)
      .select('slug,title,published,published_at')
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Não foi possível atualizar o post. Tente de novo em instantes.' }, { status: 500 })
    }

    refreshPublicBlog()
    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    console.error('Erro ao publicar post:', error)
    return NextResponse.json({ error: error.message || 'Erro interno ao publicar post' }, { status: 500 })
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

    if (isLocalRequest(request.headers) && (await isLive(slug))) return blockedLocally()

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

    refreshPublicBlog()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao deletar post' },
      { status: 500 }
    )
  }
}
