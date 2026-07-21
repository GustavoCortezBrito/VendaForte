'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image as ImageExtension } from '@tiptap/extension-image'
import { Link as LinkExtension } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Heading } from '@tiptap/extension-heading'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code
} from 'lucide-react'
import { useCallback, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        dropcursor: false, // Desabilitar do StarterKit
        gapcursor: false,  // Desabilitar do StarterKit
        paragraph: {
          HTMLAttributes: {
            class: 'min-h-[1.5em]',
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg shadow-lg max-w-full h-auto cursor-move hover:shadow-2xl transition-all my-4',
          style: 'max-width: 100%;',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 underline hover:text-red-700',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Dropcursor.configure({
        color: '#dc2626',
        width: 3,
      }),
      Gapcursor,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0]
          
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            
            // Fazer upload em background
            const formData = new FormData()
            formData.append('file', file)
            
            fetch('/api/upload', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              if (data.url) {
                // Substituir a imagem temporária pela URL real
                const images = view.dom.querySelectorAll('img')
                const lastImage = images[images.length - 1] as HTMLImageElement
                if (lastImage && lastImage.src.startsWith('data:')) {
                  lastImage.src = data.url
                }
              }
            })
            .catch(error => {
              console.error('Erro ao fazer upload:', error)
            })
            
            // Inserir preview temporário imediatamente
            const reader = new FileReader()
            reader.onload = (e) => {
              const url = e.target?.result as string
              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
              
              if (coordinates) {
                const node = schema.nodes.image?.create({ src: url })
                const transaction = view.state.tr.insert(coordinates.pos, node!)
                view.dispatch(transaction)
              }
            }
            reader.readAsDataURL(file)
            
            return true
          }
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Adicionar funcionalidade de resize para imagens após o editor carregar
  useEffect(() => {
    if (!editor) return

    const makeImagesResizable = () => {
      const images = document.querySelectorAll('.ProseMirror img')
      
      images.forEach((img: Element) => {
        const htmlImg = img as HTMLImageElement
        
        // Remover handlers antigos
        htmlImg.onmousedown = null
        
        // Adicionar handler de click para mostrar controles
        htmlImg.onclick = (e) => {
          e.stopPropagation()
          
          // Remover seleção anterior
          document.querySelectorAll('.ProseMirror img').forEach(i => {
            (i as HTMLElement).style.outline = ''
          })
          
          // Selecionar esta imagem
          htmlImg.style.outline = '3px solid #dc2626'
          htmlImg.style.outlineOffset = '2px'
        }
        
        // Adicionar resize via duplo-click
        htmlImg.ondblclick = (e) => {
          e.preventDefault()
          const newWidth = prompt('Largura da imagem (em pixels ou %):', htmlImg.style.width || '100%')
          if (newWidth) {
            htmlImg.style.width = newWidth
            htmlImg.style.maxWidth = '100%'
          }
        }
        
        // Adicionar cursor de arrastar
        htmlImg.style.cursor = 'move'
        htmlImg.draggable = true
      })
    }

    // Executar quando o conteúdo mudar
    const timer = setInterval(makeImagesResizable, 500)
    
    return () => clearInterval(timer)
  }, [editor])

  const addImage = useCallback(() => {
    // Abrir direto o seletor de arquivo
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          // Criar FormData
          const formData = new FormData()
          formData.append('file', file)
          
          // Fazer upload
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          if (!response.ok) {
            const error = await response.json()
            alert(error.error || 'Erro ao fazer upload')
            return
          }
          
          const data = await response.json()
          
          // Inserir imagem no editor
          editor?.chain().focus().setImage({ src: data.url }).run()
        } catch (error) {
          console.error('Erro ao fazer upload:', error)
          alert('Erro ao fazer upload da imagem')
        }
      }
    }
    
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL do link:', previousUrl)

    if (url === null) return

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Barra de Ferramentas */}
      <div className="border-b-2 border-gray-200 bg-gray-50 p-4 flex flex-wrap gap-2">
        {/* Títulos */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
            }`}
            title="Título 1"
            type="button"
          >
            <Heading1 size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
            }`}
            title="Título 2"
            type="button"
          >
            <Heading2 size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
            }`}
            title="Título 3"
            type="button"
          >
            <Heading3 size={20} />
          </button>
        </div>

        {/* Formatação de texto */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            title="Negrito"
            type="button"
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            title="Itálico"
            type="button"
          >
            <Italic size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('underline') ? 'bg-gray-300' : ''
            }`}
            title="Sublinhado"
            type="button"
          >
            <UnderlineIcon size={20} />
          </button>
        </div>

        {/* Listas */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
            title="Lista com marcadores"
            type="button"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300' : ''
            }`}
            title="Lista numerada"
            type="button"
          >
            <ListOrdered size={20} />
          </button>
        </div>

        {/* Alinhamento */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
            }`}
            title="Alinhar à esquerda"
            type="button"
          >
            <AlignLeft size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
            }`}
            title="Centralizar"
            type="button"
          >
            <AlignCenter size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
            }`}
            title="Alinhar à direita"
            type="button"
          >
            <AlignRight size={20} />
          </button>
        </div>

        {/* Outros */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-300' : ''
            }`}
            title="Citação"
            type="button"
          >
            <Quote size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-gray-300' : ''
            }`}
            title="Bloco de código"
            type="button"
          >
            <Code size={20} />
          </button>
        </div>

        {/* Mídia e Links */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('link') ? 'bg-gray-300' : ''
            }`}
            title="Inserir link"
            type="button"
          >
            <Link2 size={20} />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Inserir imagem (selecionar arquivo)"
            type="button"
          >
            <ImageIcon size={20} />
          </button>
        </div>

        {/* Desfazer/Refazer */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Desfazer"
            type="button"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Refazer"
            type="button"
          >
            <Redo size={20} />
          </button>
        </div>
      </div>

      {/* Área de Edição */}
      <EditorContent editor={editor} />
      
      {/* Dicas de Uso */}
      <div className="border-t-2 border-gray-200 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 font-bold text-xl">💡</div>
          <div>
            <p className="font-semibold mb-2">Dicas de uso:</p>
            <ul className="space-y-1.5 text-xs">
              <li>• <strong>Adicionar Imagem:</strong> Clique no ícone 📷 para selecionar arquivo do computador</li>
              <li>• <strong>Arrastar Imagem:</strong> Arraste arquivos de imagem direto do computador para o editor</li>
              <li>• <strong>Selecionar Imagem:</strong> Clique na imagem inserida (aparece borda vermelha)</li>
              <li>• <strong>Redimensionar:</strong> Duplo-clique na imagem e informe a largura (ex: 50%, 300px)</li>
              <li>• <strong>Mover Imagem:</strong> Arraste a imagem para outro local no texto</li>
              <li>• <strong>Múltiplas Imagens:</strong> Você pode adicionar quantas imagens quiser ao longo do texto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
