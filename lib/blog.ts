import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: string
  image: string
  category: string
  tags: string[]
  content: string
  readingTime: string
}

export interface PostMetadata {
  slug: string
  title: string
  description: string
  date: string
  author: string
  image: string
  category: string
  tags: string[]
  readingTime: string
}

// Garantir que o diretório existe
function ensureDirectoryExists() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// Calcular tempo de leitura
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min de leitura`
}

// Listar todos os posts
export function getAllPosts(): PostMetadata[] {
  ensureDirectoryExists()
  
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Sem título',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'Venda Forte',
        image: data.image || '/images/blog/default.jpg',
        category: data.category || 'Geral',
        tags: data.tags || [],
        readingTime: calculateReadingTime(content)
      }
    })

  // Ordenar por data (mais recente primeiro)
  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

// Obter post por slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureDirectoryExists()
  
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Se o conteúdo já for HTML (do editor TipTap), usar diretamente
    // Senão, converter markdown para HTML
    let contentHtml = content
    if (!content.trim().startsWith('<')) {
      const processedContent = await remark()
        .use(html)
        .process(content)
      contentHtml = processedContent.toString()
    }

    return {
      slug,
      title: data.title || 'Sem título',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Venda Forte',
      image: data.image || '/images/blog/default.jpg',
      category: data.category || 'Geral',
      tags: data.tags || [],
      content: contentHtml,
      readingTime: calculateReadingTime(content)
    }
  } catch (error) {
    return null
  }
}

// Criar novo post
export function createPost(slug: string, data: any): boolean {
  ensureDirectoryExists()
  
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    // Verificar se já existe
    if (fs.existsSync(fullPath)) {
      return false
    }

    const frontmatter = matter.stringify(data.content || '', {
      title: data.title,
      description: data.description,
      date: data.date || new Date().toISOString(),
      author: data.author || 'Venda Forte',
      image: data.image || '/images/blog/default.jpg',
      category: data.category || 'Geral',
      tags: data.tags || []
    })

    fs.writeFileSync(fullPath, frontmatter)
    return true
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return false
  }
}

// Atualizar post existente
export function updatePost(slug: string, data: any): boolean {
  ensureDirectoryExists()
  
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    const frontmatter = matter.stringify(data.content || '', {
      title: data.title,
      description: data.description,
      date: data.date || new Date().toISOString(),
      author: data.author || 'Venda Forte',
      image: data.image || '/images/blog/default.jpg',
      category: data.category || 'Geral',
      tags: data.tags || []
    })

    fs.writeFileSync(fullPath, frontmatter)
    return true
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return false
  }
}

// Deletar post
export function deletePost(slug: string): boolean {
  ensureDirectoryExists()
  
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return false
    }

    fs.unlinkSync(fullPath)
    return true
  } catch (error) {
    console.error('Erro ao deletar post:', error)
    return false
  }
}

// Obter categorias únicas
export function getCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set(posts.map(post => post.category))
  return Array.from(categories).sort()
}

// Obter posts por categoria
export function getPostsByCategory(category: string): PostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.category === category)
}
