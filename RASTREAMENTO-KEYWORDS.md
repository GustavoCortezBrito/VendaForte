# Rastreamento de Palavras-Chave - Google Analytics & Search Console

**Data:** 07/07/2026
**Status:** ✅ Palavras-chave implementadas

---

## 🎯 Palavras-Chave Alvo (Rastreamento)

As seguintes palavras-chave foram estrategicamente adicionadas ao site para rastreamento:

### Palavras-Chave Principais:
1. **Empilhadeira diesel**
2. **Empilhadeira elétrica**
3. **Transpaleteira**
4. **Paleteira**
5. **Empilhadeira autônoma**

### Palavras-Chave Secundárias:
- Transpaleteira elétrica
- Paleteira manual
- Empilhadeira elétrica industrial
- Empilhadeira diesel industrial

---

## 📍 Onde as Palavras-Chave Foram Implementadas

### 1. ✅ Metadados SEO (`app/metadata.ts`)

```typescript
Meta Description:
"Empilhadeiras em Chapecó-SC: venda, locação e manutenção. 
Empilhadeira elétrica, empilhadeira diesel, transpaleteira, 
paleteira e empilhadeira autônoma."

Keywords:
- empilhadeira diesel (1ª posição)
- empilhadeira elétrica (2ª posição)
- transpaleteira (3ª posição)
- paleteira (4ª posição)
- empilhadeira autônoma (5ª posição)
```

**Impacto:** Aparecerá nos resultados de busca do Google

---

### 2. ✅ Hero Section (`components/Hero.tsx`)

```html
Parágrafo principal:
"O Grupo Venda Forte oferece soluções completas em empilhadeiras 
e equipamentos industriais: empilhadeira elétrica, empilhadeira 
diesel, transpaleteira, paleteira e empilhadeira autônoma."
```

**Destaque:** Palavras em `<strong>` para ênfase SEO

---

### 3. ✅ About Section (`components/About.tsx`)

```html
"Trabalhamos com empilhadeira elétrica, empilhadeira diesel, 
transpaleteira, paleteira e empilhadeira autônoma, além de 
peças multimarcas."
```

---

### 4. ✅ Services Section (`components/Services.tsx`)

**Títulos dos Cards:**
- "Empilhadeira Elétrica"
- "Empilhadeira Diesel"
- "Transpaleteira e Paleteira"
- "Empilhadeira Autônoma"

**Descrições otimizadas:**
- Cada card menciona a palavra-chave 2-3 vezes naturalmente

---

### 5. ✅ FAQ Section (`components/FAQ.tsx`)

**Primeira pergunta:**
"Quais tipos de empilhadeiras e equipamentos vocês oferecem?"

**Resposta inclui todas as 5 palavras-chave:**
"Empilhadeira Elétrica, Empilhadeira Diesel, Transpaleteira 
Elétrica, Paleteira Manual e Empilhadeira Autônoma"

---

### 6. ✅ AI Context (`public/ai-context.json`)

**Schema estruturado para IAs:**
- Cada produto tem entrada separada com keywords
- Primeiras 5 palavras-chave no array principal
- Metadados específicos para cada equipamento

---

## 📊 Como Rastrear no Google Search Console

### Passo 1: Acessar Performance

1. Acesse: https://search.google.com/search-console
2. Selecione propriedade: `venda-forte.vercel.app`
3. Menu lateral: **Performance**

### Passo 2: Filtrar por Consulta

1. Clique em **+ Novo** (filtros)
2. Selecione **Consulta**
3. Escolha **Consulta contém**
4. Digite cada palavra-chave:
   - `empilhadeira diesel`
   - `empilhadeira elétrica`
   - `transpaleteira`
   - `paleteira`
   - `empilhadeira autônoma`

### Passo 3: Métricas Importantes

| Métrica | O que Significa | Meta |
|---------|-----------------|------|
| **Cliques** | Visitas vindas dessa palavra | 10+/mês |
| **Impressões** | Quantas vezes apareceu na busca | 100+/mês |
| **CTR** | Taxa de cliques | >3% |
| **Posição Média** | Ranking no Google | Top 10 (posição ≤10) |

### Passo 4: Criar Relatório Personalizado

1. Configure filtros para as 5 palavras-chave
2. Clique em **Exportar** > **Google Sheets**
3. Salve como: "Keywords Tracking - Venda Forte"
4. Atualize semanalmente

---

## 📈 Como Rastrear no Google Analytics 4

### Configuração Inicial

#### 1. Criar Eventos Personalizados

**No Google Analytics 4:**

1. Acesse: **Admin** > **Events** > **Create Event**
2. Crie evento: `keyword_search`

**Configuração do Evento:**
```
Event name: keyword_search
Parameter: keyword_type
```

#### 2. Dimensões Personalizadas

1. **Admin** > **Custom Definitions** > **Custom Dimensions**
2. Criar dimensão: `search_keyword`

**Configuração:**
- Dimension name: `search_keyword`
- Scope: Event
- Event parameter: `keyword_type`

---

### Rastreamento Automático (Landing Page)

O GA4 já rastreia automaticamente:

#### Site Search (se implementado):
- Queries de busca interna
- Termos pesquisados

#### Landing Pages:
- Páginas de entrada
- Origem do tráfego
- Palavras-chave do Google Ads

---

### Relatórios Personalizados GA4

#### Relatório 1: Landing Pages por Palavra-Chave

1. **Explorar** > **Análise de Exploração em Branco**
2. **Dimensões:**
   - Landing Page
   - Source/Medium
   - Session Campaign
3. **Métricas:**
   - Sessions
   - Conversions
   - Engagement Rate
4. **Filtros:**
   - Landing Page contém: `/` (homepage)

---

#### Relatório 2: Conversões por Origem

**Objetivo:** Ver quais palavras-chave geram mais leads

1. **Explorar** > **Análise de Funil**
2. **Etapas:**
   - Visita à página
   - Clique em "Solicitar Orçamento"
   - Envio de formulário (se implementado)
3. **Segmentos:**
   - Por origem (Organic Search)
   - Por Landing Page

---

## 🔍 Google Ads (Opcional)

Se quiser resultados mais rápidos enquanto o SEO orgânico melhora:

### Campanha de Search Ads

**Palavras-Chave Exatas:**
```
[empilhadeira diesel]
[empilhadeira elétrica]
[transpaleteira]
[paleteira]
[empilhadeira autônoma]
```

**Palavras-Chave de Correspondência Ampla:**
```
+empilhadeira +diesel +chapecó
+empilhadeira +elétrica +venda
+transpaleteira +elétrica +preço
+paleteira +manual +comprar
+empilhadeira +autônoma +brasil
```

**Budget Sugerido:**
- R$ 50-100/dia
- CPC esperado: R$ 2-5
- Cliques/dia: 10-50

---

## 📋 Checklist de Monitoramento

### Semanal:
- [ ] Verificar posição no Google para cada palavra-chave
- [ ] Analisar impressões e cliques no Search Console
- [ ] Identificar novas consultas relacionadas

### Quinzenal:
- [ ] Exportar relatório GSC para planilha
- [ ] Comparar evolução de posições
- [ ] Ajustar conteúdo se necessário

### Mensal:
- [ ] Análise completa GA4
- [ ] Identificar landing pages com melhor conversão
- [ ] Criar conteúdo adicional para palavras com baixo desempenho

---

## 🎯 Metas de Performance (30 dias)

| Palavra-Chave | Posição Inicial | Meta Posição | Impressões Meta |
|---------------|-----------------|--------------|-----------------|
| empilhadeira diesel | 100+ | 50 | 100+ |
| empilhadeira elétrica | 100+ | 50 | 100+ |
| transpaleteira | 100+ | 60 | 80+ |
| paleteira | 100+ | 70 | 60+ |
| empilhadeira autônoma | 100+ | 80 | 40+ |

---

## 🎯 Metas de Performance (90 dias)

| Palavra-Chave | Meta Posição | Impressões | Cliques |
|---------------|--------------|------------|---------|
| empilhadeira diesel | 20-30 | 500+ | 25+ |
| empilhadeira elétrica | 20-30 | 500+ | 25+ |
| transpaleteira | 30-40 | 300+ | 15+ |
| paleteira | 30-40 | 300+ | 15+ |
| empilhadeira autônoma | 40-50 | 200+ | 10+ |

---

## 📊 Como Pesquisar Manualmente

### Busca no Google (Modo Anônimo):

1. Abra navegador em modo anônimo/privado
2. Busque cada termo:
   - "empilhadeira diesel chapecó"
   - "empilhadeira elétrica santa catarina"
   - "transpaleteira venda"
   - "paleteira manual"
   - "empilhadeira autônoma brasil"

3. Anote em que posição seu site aparece

### Ferramentas Gratuitas:

- **Google Search Console** (oficial)
- **Google Analytics 4** (oficial)
- **Ubersuggest** (3 buscas/dia grátis)
- **Google Trends** (tendências)

---

## 🚀 Próximas Ações

### Imediato:
1. ✅ Deploy do código (feito)
2. ⏳ Aguardar indexação Google (24-48h)
3. 📊 Configurar Google Analytics 4
4. 🔍 Submeter sitemap no Search Console

### Curto Prazo (7 dias):
1. Verificar primeiras impressões GSC
2. Criar conteúdo adicional (blog posts):
   - "Guia Completo: Empilhadeira Elétrica vs Diesel"
   - "Como Escolher uma Transpaleteira"
   - "Paleteira Manual ou Elétrica?"
   - "Empilhadeira Autônoma: Vale a Pena?"

### Médio Prazo (30 dias):
1. Análise de desempenho das 5 keywords
2. Otimização de landing pages específicas
3. Criação de páginas dedicadas por produto:
   - `/empilhadeira-diesel`
   - `/empilhadeira-eletrica`
   - `/transpaleteira`
   - `/paleteira`
   - `/empilhadeira-autonoma`

---

## 📝 Template de Relatório Semanal

```
SEMANA: [DD/MM - DD/MM]

PALAVRAS-CHAVE:
1. Empilhadeira Diesel
   - Posição: XX
   - Impressões: XX
   - Cliques: XX
   - CTR: X.X%

2. Empilhadeira Elétrica
   - Posição: XX
   - Impressões: XX
   - Cliques: XX
   - CTR: X.X%

[repetir para outras keywords]

AÇÕES NECESSÁRIAS:
- [ ] Ação 1
- [ ] Ação 2

OBSERVAÇÕES:
[notas importantes]
```

---

**Conclusão:** Todas as 5 palavras-chave foram implementadas estrategicamente. Agora é monitorar semanalmente e ajustar conforme necessário! 🎯
