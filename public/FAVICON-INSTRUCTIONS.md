# Instruções para Gerar Favicons

Para ter favicons completos e de alta qualidade, você precisa gerar as seguintes imagens a partir do logo da empresa:

## Arquivos Necessários:

1. **favicon.ico** (32x32) - Favicon tradicional
2. **icon-192.png** (192x192) - Para PWA e Android
3. **icon-512.png** (512x512) - Para PWA e Android
4. **apple-touch-icon.png** (180x180) - Para iOS/Safari
5. **og-image.jpg** (1200x630) - Para Open Graph (Facebook, LinkedIn, etc)

## Como Gerar:

### Opção 1: Usar ferramenta online (Recomendado)
1. Acesse: https://realfavicongenerator.net/
2. Faça upload do logo da empresa (logo.png)
3. Configure as opções:
   - iOS: Use logo com fundo vermelho #dc2626
   - Android: Use logo com fundo vermelho #dc2626
   - Favicon: Use versão simplificada do logo
4. Gere e baixe todos os arquivos
5. Substitua os arquivos na pasta `/public`

### Opção 2: Usar Photoshop/Figma
1. Abra o logo em alta resolução
2. Crie versões redimensionadas:
   - 32x32 (favicon.ico)
   - 192x192 (icon-192.png)
   - 512x512 (icon-512.png)
   - 180x180 (apple-touch-icon.png)
3. Para og-image.jpg:
   - Tamanho: 1200x630px
   - Inclua: Logo + Texto "Empilhadeiras e Equipamentos Industriais"
   - Use cores da marca (vermelho #dc2626)
   - Fundo: Foto da sede ou equipamentos

### Opção 3: Linha de comando (ImageMagick)
```bash
# Instale ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Gere os diferentes tamanhos
convert logo.png -resize 32x32 favicon.ico
convert logo.png -resize 192x192 icon-192.png
convert logo.png -resize 512x512 icon-512.png
convert logo.png -resize 180x180 apple-touch-icon.png
```

## Verificação:

Após adicionar os arquivos, verifique:
1. https://realfavicongenerator.net/favicon_checker
2. Teste no navegador (Ctrl+F5 para limpar cache)
3. Teste compartilhamento no Facebook/LinkedIn
4. Teste em dispositivos móveis

## Notas:

- O arquivo `icon.svg` já está criado como fallback
- Mantenha as cores da marca (#dc2626 - vermelho)
- Use imagens de alta qualidade (PNG com transparência quando possível)
- O og-image.jpg deve ter proporção 1.91:1 (1200x630)
