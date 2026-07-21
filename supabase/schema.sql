-- Criação das tabelas para o sistema de blog do Venda Forte

-- Tabela de usuários (administradores)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts do blog
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(255) NOT NULL,
  published BOOLEAN DEFAULT false,
  reading_time VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para definir published_at quando o post for publicado
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_post_published_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- Inserir usuário admin padrão (senha: vendaforte2026)
-- Hash bcrypt da senha "vendaforte2026": $2a$10$xYZ...
-- IMPORTANTE: Altere a senha após o primeiro login!
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@vendaforte.com',
  '$2a$10$YourBcryptHashHere', -- Será substituído pelo script de migração
  'Administrador',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler todos os usuários
CREATE POLICY "Usuários autenticados podem ler usuários"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Política: Apenas admins podem inserir/atualizar/deletar usuários
CREATE POLICY "Apenas admins podem gerenciar usuários"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Política: Posts publicados são visíveis publicamente
CREATE POLICY "Posts publicados são públicos"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Política: Usuários autenticados podem ver todos os posts (incluindo rascunhos)
CREATE POLICY "Usuários autenticados veem todos os posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- Política: Usuários autenticados podem criar posts
CREATE POLICY "Usuários autenticados podem criar posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Usuários podem atualizar seus próprios posts ou admins podem atualizar tudo
CREATE POLICY "Usuários podem atualizar posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Política: Apenas admins podem deletar posts
CREATE POLICY "Apenas admins podem deletar posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ========================================
-- CONFIGURAÇÃO DO STORAGE (IMAGENS DO BLOG)
-- ========================================

-- Criar bucket público para imagens do blog
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Qualquer pessoa pode ver imagens públicas
CREATE POLICY "Imagens do blog são públicas"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- Política: Usuários autenticados podem fazer upload
CREATE POLICY "Usuários autenticados podem fazer upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Política: Usuários autenticados podem atualizar suas imagens
CREATE POLICY "Usuários autenticados podem atualizar imagens"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Política: Apenas admins podem deletar imagens
CREATE POLICY "Apenas admins podem deletar imagens"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
