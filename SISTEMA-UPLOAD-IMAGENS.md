# Sistema de Upload de Imagens

## Data: 21/07/2026

## ✅ Sistema Implementado

Sistema completo de upload de imagens para o blog, permitindo upload de arquivos ao invés de URLs.

---

## 📸 Funcionalidades

### 1. **Imagem de Capa do Post**

**Como funciona:**
- Campo com preview visual da imagem
- Área de drag & drop ou clique para selecionar
- Upload automático ao selecionar arquivo
- Preview atualiza em tempo real

**Interface:**
```
┌─────────────────────────────────────────┐
│ Imagem de Capa *                        │
│                                         │
│ ┌────────┐  ┌──────────────────────┐   │
│ │        │  │                      │   │
│ │ PREVIEW│  │  📤 Clique para      │   │
│ │        │  │  selecionar ou       │   │
│ │  IMG   │  │  arraste a imagem    │   │
│ └────────┘  │                      │   │
│             │ JPG, PNG, GIF, WebP  │   │
│             │ (máx. 5MB)           │   │
│             └──────────────────────┘   │
└─────────────────────────────────────────┘
```

**Validações:**
- ✅ Tipos aceitos: JPG, JPEG, PNG, GIF, WebP
- ✅ Tamanho máximo: 5MB
- ✅ Feedback visual durante upload (spinner)

### 2. **Imagens no Conteúdo (TipTap)**

**3 Formas de Adicionar:**

**A) Botão na Toolbar (📷)**
- Clique no botão
- Abre seletor de arquivo direto
- Upload automático
- Insere no cursor

**B) Arrastar & Soltar**
- Arraste imagem do computador
- Solte no editor
- Mostra preview imediatamente
- Upload em background
- Substitui preview por URL real

**C) Ctrl+V (Colar)**
- Funciona automaticamente
- Cola imagens da área de transferência

**Funcionalidades das Imagens:**
- ✅ **Múltiplas imagens** ao longo do texto
- ✅ **Selecionar**: Clique na imagem (borda vermelha)
- ✅ **Redimensionar**: Duplo-clique → digite largura (50%, 300px, etc)
- ✅ **Mover**: Arrastar para outro local
- ✅ **Deletar**: Backspace com imagem selecionada

---

## 🔧 Implementação Técnica

### API Route de Upload

**Arquivo:** `app/api/upload/route.ts`

**Funcionalidades:**
```typescript
- Recebe arquivo via FormData
- Valida tipo (imagem) e tamanho (5MB)
- Gera nome único com timestamp
- Salva em: public/images/blog/
- Retorna URL pública: /images/blog/arquivo.jpg
```

**Segurança:**
- ✅ Validação de tipo MIME
- ✅ Validação de tamanho
- ✅ Nome sanitizado (remove caracteres especiais)
- ✅ Diretório criado automaticamente se não existir

**Response:**
```json
{
  "success": true,
  "url": "/images/blog/1234567890-imagem.jpg",
  "fileName": "1234567890-imagem.jpg"
}
```

**Errors:**
```json
{
  "error": "Tipo de arquivo inválido. Use JPG, PNG, GIF ou WebP"
}
{
  "error": "Arquivo muito grande. Máximo 5MB"
}
{
  "error": "Nenhum arquivo enviado"
}
```

### Armazenamento Local

**Estrutura de Pastas:**
```
public/
└── images/
    └── blog/
        ├── 1234567890-imagem1.jpg
        ├── 1234567891-imagem2.png
        └── 1234567892-screenshot.webp
```

**URLs Públicas:**
```
/images/blog/1234567890-imagem1.jpg
/images/blog/1234567891-imagem2.png
/images/blog/1234567892-screenshot.webp
```

**Vantagens:**
- ✅ Simples de implementar
- ✅ Sem dependências externas
- ✅ Rápido (local)
- ✅ Funciona offline

**Desvantagens:**
- ❌ Ocupa espaço no servidor
- ❌ Não tem CDN (mais lento para usuários distantes)
- ❌ Perde imagens se limpar pasta public
- ❌ Não otimiza imagens automaticamente

---

## 🎨 Componentes

### 1. Campo de Upload (Criar/Editar Post)

**Estados:**
```typescript
uploadingImage: boolean      // Mostra spinner
imagePreview: string         // URL para preview
formData.image: string       // URL salva no post
```

**Função:**
```typescript
async function handleImageUpload(e) {
  const file = e.target.files[0]
  
  // Criar FormData
  const formData = new FormData()
  formData.append('file', file)
  
  // Upload via API
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  
  // Atualizar preview e form
  setImagePreview(data.url)
  setFormData(prev => ({ ...prev, image: data.url }))
}
```

### 2. RichTextEditor (TipTap)

**Botão de Imagem:**
```typescript
const addImage = () => {
  // Criar input file invisível
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    
    // Upload
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', { ... })
    const data = await response.json()
    
    // Inserir no editor
    editor.chain().focus().setImage({ src: data.url }).run()
  }
  
  input.click()
}
```

**Drag & Drop:**
```typescript
handleDrop: (view, event) => {
  const file = event.dataTransfer.files[0]
  
  if (file.type.startsWith('image/')) {
    // 1. Mostrar preview imediato (base64)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      // Inserir preview no editor
      insertImage(base64)
    }
    reader.readAsDataURL(file)
    
    // 2. Upload em background
    const formData = new FormData()
    formData.append('file', file)
    fetch('/api/upload', { ... })
      .then(response => response.json())
      .then(data => {
        // Substituir base64 por URL real
        replaceImageSrc(base64, data.url)
      })
  }
}
```

---

## 🚀 Fluxo de Uso

### Criar Post

1. **Upload Imagem de Capa**
   - Usuário clica ou arrasta imagem
   - Sistema faz upload
   - Preview atualiza
   - URL salva em `formData.image`

2. **Adicionar Imagens no Texto**
   - Usuário clica no botão 📷 OU arrasta imagens
   - Sistema faz upload
   - Imagens aparecem no editor
   - URLs ficam no HTML do conteúdo

3. **Salvar Post**
   - `image`: URL da capa
   - `content`: HTML com `<img src="/images/blog/...">` tags

### Editar Post

1. **Carregar Post**
   - Carrega URL da imagem de capa
   - Mostra preview
   - Conteúdo carrega com imagens

2. **Trocar Imagem**
   - Upload nova imagem
   - Preview e URL atualizam
   - Imagem antiga continua na pasta (não deletada)

3. **Editar Conteúdo**
   - Pode adicionar mais imagens
   - Pode deletar imagens existentes
   - Imagens deletadas do texto continuam na pasta

---

## 📊 Performance

### Otimizações Implementadas

1. **Preview Imediato (Drag & Drop)**
   - Mostra base64 enquanto faz upload
   - UX mais rápida (não espera upload)
   - Substitui por URL real em background

2. **Upload Assíncrono**
   - Não bloqueia interface
   - Feedback visual (spinner)
   - Erros tratados gracefully

3. **Validação no Cliente e Servidor**
   - Cliente: valida antes de enviar
   - Servidor: valida novamente (segurança)
   - Economiza largura de banda

### Limitações Atuais

- ❌ **Sem otimização de imagens**
  - Imagens salvas no tamanho original
  - Pode salvar imagem 5MB quando 500KB bastaria

- ❌ **Sem limpeza automática**
  - Imagens não usadas ficam na pasta
  - Pasta pode crescer indefinidamente

- ❌ **Sem CDN**
  - Todas as imagens servidas do mesmo servidor
  - Pode ser lento para usuários distantes

---

## 🔮 Migrações Futuras

### Opção: Cloudinary

**Benefícios:**
- ✅ Otimização automática de imagens
- ✅ CDN global (rápido em todo mundo)
- ✅ Transformações (resize, crop, filtros)
- ✅ Backup automático
- ✅ Plano gratuito (25GB)

**Mudanças Necessárias:**
```typescript
// Apenas mudar o endpoint de upload
const response = await fetch('https://api.cloudinary.com/v1_1/.../upload', {
  method: 'POST',
  body: formData
})

// Resto do código permanece igual
```

### Opção: AWS S3

**Benefícios:**
- ✅ Escalável
- ✅ Confiável (99.999999999%)
- ✅ Integração com CloudFront (CDN)
- ✅ Versionamento

**Desvantagens:**
- ❌ Pago (barato, mas pago)
- ❌ Mais complexo de configurar

---

## ✅ Status Atual

- ✅ API de upload funcionando
- ✅ Upload de imagem de capa implementado
- ✅ Upload de imagens no TipTap implementado
- ✅ Drag & drop funcionando
- ✅ Múltiplas imagens suportadas
- ✅ Preview visual
- ✅ Validações de segurança
- ✅ Feedback visual (loading, erros)
- ✅ Build verificado

O sistema está **pronto para uso** e permite total flexibilidade para adicionar imagens sem precisar de URLs externas! 🎉

---

## 💡 Dicas para Autores

1. **Imagens Leves**
   - Comprima imagens antes de enviar (use TinyPNG, Squoosh, etc)
   - Ideal: < 200KB por imagem

2. **Formatos Recomendados**
   - Fotos: JPG (qualidade 80-85%)
   - Logos/ícones: PNG
   - Animações: GIF (use com moderação)
   - Moderno: WebP (menor tamanho, mesma qualidade)

3. **Dimensões**
   - Largura ideal: 800-1200px
   - Não envie 4K se não precisar

4. **Acessibilidade**
   - Sempre adicione texto alternativo (funcionalidade futura)
   - Descreva a imagem brevemente
