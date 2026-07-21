import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente com service role para operações administrativas
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Tipos do banco de dados
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  slug: string
  title: string
  description: string
  content: string
  image: string
  category: string
  tags: string[]
  author: string
  published: boolean
  reading_time: string
  created_at: string
  updated_at: string
  published_at?: string
}
