-- Redes sociais e perfil de revisor no painel (02/11/2026).
-- Rodar uma vez no Supabase: SQL Editor > New query > colar tudo > Run. Pode rodar de novo sem estragar nada.

-- 1) Perfil "revisor" (Paulo e Rodrigo): lê, comenta e aprova.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'editor', 'revisor'));

-- 2) Textos das redes sociais: uma linha por peça do calendário.
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id TEXT UNIQUE,                 -- id da peça em docs/seo/agenda-conteudo.json; evita importar duas vezes
  channel TEXT NOT NULL CHECK (channel IN ('Instagram', 'LinkedIn', 'Facebook', 'WhatsApp', 'Perfil Google')),
  post_number INT,                       -- número do post do blog a que a peça se liga
  post_title TEXT,
  title TEXT NOT NULL,                   -- o que a peça é (vem do calendário)
  caption TEXT NOT NULL DEFAULT '',      -- legenda ou texto que vai ao ar
  art_url TEXT,                          -- link da arte (Drive, Canva) ou do arquivo enviado
  art_note TEXT,                         -- orientação da arte: o que deve aparecer nela
  link TEXT,                             -- endereço com UTM que vai na legenda
  scheduled_for DATE,
  owner TEXT,
  conditional BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_aprovacao', 'ajustes', 'aprovado', 'publicado')),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3) Conversa de cada peça: comentários, aprovações e pedidos de ajuste.
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  kind TEXT NOT NULL DEFAULT 'comentario' CHECK (kind IN ('comentario', 'aprovado', 'ajustes')),
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_comments(post_id, created_at);

DROP TRIGGER IF EXISTS update_social_posts_updated_at ON social_posts;
CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Só o servidor do painel (chave de serviço) lê e grava. Sem política, o acesso público fica fechado.
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
