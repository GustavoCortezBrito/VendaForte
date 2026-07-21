/**
 * Script de migração para mover posts de arquivos .md para o banco de dados Supabase
 * 
 * Como usar:
 * 1. Configure as variáveis de ambiente no .env.local
 * 2. Execute: npx tsx scripts/migrate-posts.ts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { loadEnvConfig } from '@next/env'

// Carregar variáveis de ambiente do .env.local
loadEnvConfig(process.cwd())

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createStorageBucket() {
  console.log('\n🗄️  Configurando Supabase Storage...')
  
  try {
    // Verificar se o bucket já existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'blog-images')
    
    if (!bucketExists) {
      // Criar bucket público
      const { error } = await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      })
      
      if (error) {
        console.error('❌ Erro ao criar bucket:', error.message)
      } else {
        console.log('✅ Bucket "blog-images" criado com sucesso')
      }
    } else {
      console.log('✅ Bucket "blog-images" já existe')
    }
  } catch (error: any) {
    console.error('❌ Erro ao configurar Storage:', error.message)
  }
}

async function createAdminUser() {
  console.log('\n📝 Criando usuário admin...')
  
  const email = 'admin@vendaforte.com'
  const password = 'vendaforte2026'
  const passwordHash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .upsert({
      email,
      password_hash: passwordHash,
      name: 'Administrador',
      role: 'admin'
    }, {
      onConflict: 'email'
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Erro ao criar usuário:', error.message)
    return null
  }

  console.log('✅ Usuário admin criado/atualizado:', email)
  return data
}

async function migratePosts() {
  console.log('\n📚 Iniciando migração de posts...\n')

  const postsDirectory = path.join(process.cwd(), 'content', 'blog')
  
  if (!fs.existsSync(postsDirectory)) {
    console.error('❌ Diretório de posts não encontrado:', postsDirectory)
    return
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const markdownFiles = fileNames.filter(name => name.endsWith('.md'))

  console.log(`📁 Encontrados ${markdownFiles.length} arquivos .md\n`)

  for (const fileName of markdownFiles) {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    const { data: metadata, content } = matter(fileContents)

    // Calcular tempo de leitura
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    const post = {
      slug,
      title: metadata.title || 'Sem título',
      description: metadata.description || '',
      content,
      image: metadata.image || '/sede.png',
      category: metadata.category || 'Geral',
      tags: metadata.tags || [],
      author: metadata.author || 'Equipe Venda Forte',
      published: true,
      reading_time: `${readingTime} min de leitura`,
      created_at: metadata.date ? new Date(metadata.date).toISOString() : new Date().toISOString()
    }

    console.log(`⏳ Migrando: ${post.title}`)

    const { error } = await supabase
      .from('posts')
      .upsert(post, {
        onConflict: 'slug'
      })

    if (error) {
      console.error(`❌ Erro ao migrar "${post.title}":`, error.message)
    } else {
      console.log(`✅ Migrado com sucesso: ${post.title}\n`)
    }
  }

  console.log('\n🎉 Migração concluída!')
}

async function main() {
  console.log('🚀 Iniciando script de migração do Venda Forte')
  console.log('=' .repeat(60))

  // Configurar Storage
  await createStorageBucket()

  // Criar usuário admin
  await createAdminUser()

  // Migrar posts
  await migratePosts()

  console.log('\n' + '='.repeat(60))
  console.log('✨ Processo de migração finalizado!')
  console.log('\n📌 Próximos passos:')
  console.log('   1. Acesse: http://localhost:3000/admin/login')
  console.log('   2. Login: admin@vendaforte.com')
  console.log('   3. Senha: vendaforte2026')
  console.log('   4. ⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n')
}

main().catch(console.error)
