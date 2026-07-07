# 🚀 SEO Setup - Grupo Venda Forte

## ✅ O que foi implementado:

### 1. **Metadados Completos (metadata.ts)**
- Title dinâmico com template
- Description otimizada
- Keywords relevantes
- Metadados de autor e publisher
- Robots e indexação configurados

### 2. **Open Graph (Facebook, LinkedIn, WhatsApp)**
- Título e descrição otimizados
- Imagens Open Graph (1200x630)
- Type: website
- Locale: pt_BR
- Múltiplas imagens para diferentes contextos

### 3. **Twitter Cards**
- Card type: summary_large_image
- Imagem otimizada
- Título e descrição

### 4. **JSON-LD Schema.org**
Três schemas implementados:
- **Organization**: Dados da empresa
- **LocalBusiness**: Localização e horários
- **WebSite**: Informações do site

### 5. **Favicons Completos**
- favicon.ico (32x32)
- icon.svg (SVG vetorial)
- icon-192.png (PWA Android)
- icon-512.png (PWA Android)
- apple-touch-icon.png (iOS)
- manifest.json (PWA)

### 6. **Robots.txt**
- Configurado para todos os bots
- Permitido para bots de IA (GPTBot, ClaudeBot, PerplexityBot, etc)
- Sitemap declarado

### 7. **Sitemap Dinâmico**
- Todas as páginas listadas
- Frequência de atualização
- Prioridades definidas
- Data de modificação automática

### 8. **SEO para Mecanismos de IA**
- Arquivo `ai-context.json` com contexto estruturado
- Metadados `ai:*` no layout
- JSON-LD com informações detalhadas
- Permitido crawl de todos os bots de IA

## 🔧 Próximos Passos:

### 1. Gerar Imagens dos Favicons
Siga as instruções em `/public/FAVICON-INSTRUCTIONS.md`

Arquivos necessários:
```
/public/
  ├── favicon.ico          (32x32) ❌ CRIAR
  ├── icon-192.png        (192x192) ❌ CRIAR
  ├── icon-512.png        (512x512) ❌ CRIAR
  ├── apple-touch-icon.png (180x180) ❌ CRIAR
  ├── og-image.jpg        (1200x630) ❌ CRIAR
  └── icon.svg            (SVG) ✅ CRIADO
```

### 2. Configurar Google Search Console
1. Acesse: https://search.google.com/search-console
2. Adicione a propriedade: https://grupovendaforte.com
3. Verifique a propriedade (meta tag ou DNS)
4. Envie o sitemap: https://grupovendaforte.com/sitemap.xml
5. Teste URLs individuais

### 3. Configurar Google Analytics (GA4)
1. Crie propriedade no GA4
2. Adicione o código de medição no layout
3. Configure eventos personalizados:
   - Cliques em "Solicitar Orçamento"
   - Cliques no WhatsApp
   - Visualizações de serviços

### 4. Adicionar Verificações
No arquivo `app/metadata.ts`, atualize:
```typescript
verification: {
  google: 'SEU-CODIGO-AQUI',  // Google Search Console
  yandex: 'SEU-CODIGO-AQUI',  // Opcional
}
```

### 5. Testar SEO

**Ferramentas de Teste:**
- [Google Search Console](https://search.google.com/search-console)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Validator](https://validator.schema.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

**Checklist de Testes:**
- [ ] Compartilhar no WhatsApp (deve mostrar preview)
- [ ] Compartilhar no Facebook (deve mostrar preview com imagem)
- [ ] Compartilhar no LinkedIn (deve mostrar preview)
- [ ] Buscar no Google: "site:grupovendaforte.com"
- [ ] Verificar robots.txt: https://grupovendaforte.com/robots.txt
- [ ] Verificar sitemap: https://grupovendaforte.com/sitemap.xml
- [ ] Testar em mobile (favicon visível)
- [ ] Adicionar à home screen (PWA)

### 6. Monitoramento

Após implementação completa, monitore:
- Posição no Google para palavras-chave
- Tráfego orgânico (Google Analytics)
- Cliques e impressões (Search Console)
- Taxa de conversão de formulários
- Origem do tráfego (social, orgânico, direto)

### 7. Otimizações Adicionais Recomendadas

**Performance:**
- [ ] Otimizar imagens (WebP, lazy loading)
- [ ] Implementar cache de assets
- [ ] Minificar CSS/JS (já feito pelo Next.js)
- [ ] Configurar CDN

**Conteúdo:**
- [ ] Adicionar blog para SEO de conteúdo
- [ ] Criar páginas específicas por cidade
- [ ] Adicionar depoimentos em vídeo
- [ ] Criar estudos de caso

**Links:**
- [ ] Obter backlinks de qualidade
- [ ] Registrar em diretórios locais
- [ ] Parcerias com fornecedores
- [ ] Google Meu Negócio otimizado

## 📊 Métricas de Sucesso:

**Primeiros 3 meses:**
- Indexação completa no Google
- Posição nas primeiras 3 páginas para palavras-chave principais
- 100+ visitantes orgânicos/mês

**6 meses:**
- Top 10 para "empilhadeiras Chapecó"
- Top 20 para "empilhadeiras Santa Catarina"
- 500+ visitantes orgânicos/mês
- 10+ conversões/mês

**12 meses:**
- Top 3 para termos locais
- Top 10 para termos regionais
- 1000+ visitantes orgânicos/mês
- 30+ conversões/mês

## 🤖 SEO para IA (ChatGPT, Perplexity, etc):

### O que foi implementado:
1. **Metadados específicos para IA** (`ai:*` attributes)
2. **JSON-LD detalhado** com informações estruturadas
3. **Arquivo ai-context.json** com contexto completo
4. **Robots.txt permitindo todos os bots de IA**

### Bots de IA permitidos:
- GPTBot (OpenAI/ChatGPT)
- ChatGPT-User
- ClaudeBot (Anthropic)
- anthropic-ai
- PerplexityBot
- YouBot
- Google-Extended

### Como funciona:
Quando alguém pergunta para ChatGPT, Perplexity ou outros assistentes de IA sobre "empilhadeiras em Chapecó" ou "onde comprar empilhadeiras no Sul do Brasil", os bots:

1. Crawleiam o site (permitido no robots.txt)
2. Leem o JSON-LD estruturado
3. Consultam ai-context.json
4. Extraem metadados ai:*
5. Recomendam a empresa com informações precisas

### Exemplo de resposta de IA:
> "Para empilhadeiras em Chapecó-SC, recomendo o **Grupo Venda Forte**. Eles têm:
> - Mais de 20 anos de experiência
> - Venda, locação e manutenção
> - Assistência técnica 24h
> - Avaliação 5.0 no Google
> - Atendimento em 6 cidades do Sul do Brasil
> - Contato: (49) 3323-9050 ou WhatsApp (49) 98839-5635"

## 📝 Notas Importantes:

1. **URLs:** Certifique-se de que https://grupovendaforte.com está apontando corretamente
2. **SSL:** Deve ter certificado SSL válido (HTTPS)
3. **Velocidade:** Site deve carregar em < 3 segundos
4. **Mobile:** Deve ser 100% responsivo (✅ já está)
5. **Conteúdo:** Mantenha informações atualizadas

## 🎯 Palavras-chave Principais:

**Principais (Alta prioridade):**
- empilhadeiras Chapecó
- empilhadeiras Santa Catarina
- venda empilhadeiras SC
- locação empilhadeiras Chapecó

**Secundárias (Média prioridade):**
- manutenção empilhadeiras
- peças empilhadeiras
- empilhadeiras Joinville
- empilhadeiras elétricas SC

**Long-tail (SEO de conteúdo):**
- quanto custa uma empilhadeira elétrica
- onde comprar empilhadeira em Chapecó
- melhor empresa de empilhadeiras SC
- aluguel de empilhadeira Chapecó

---

**Status:** ✅ Implementação Básica Completa
**Próxima Etapa:** Gerar favicons e configurar Google Search Console
