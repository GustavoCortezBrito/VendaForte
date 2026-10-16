/**
 * Busca do blog: pura e sem dependências, então roda no navegador (sugestões e
 * página de resultados) e no servidor. Ignora maiúsculas e acentos, exige que
 * todos os termos apareçam e põe os acertos no título à frente dos demais.
 */
import { categoryOf, type BlogPostSummary } from './blog-format'

export type SearchEntry = Pick<BlogPostSummary, 'slug' | 'title' | 'description' | 'category' | 'tags' | 'date'>

/** Minúsculas e sem acentos. */
export const normalizeText = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export const queryTerms = (query: string) => normalizeText(query).split(/\s+/).filter(Boolean)

/** Pontuação de um post para os termos, ou 0 se algum termo não aparecer. */
function score(entry: SearchEntry, terms: string[]): number {
  const title = normalizeText(entry.title)
  const category = normalizeText(categoryOf(entry))
  const tags = normalizeText(entry.tags.join(' '))
  const description = normalizeText(entry.description)

  let total = 0
  for (const term of terms) {
    let found = 0
    if (title.includes(term)) found += title.startsWith(term) ? 7 : 5
    if (tags.includes(term)) found += 3
    if (category.includes(term)) found += 3
    if (description.includes(term)) found += 1
    if (found === 0) return 0
    total += found
  }
  return total
}

/** Posts que combinam com a busca, do mais ao menos relevante (empate: o mais novo). */
export function searchPosts<T extends SearchEntry>(entries: T[], query: string): T[] {
  const terms = queryTerms(query)
  if (terms.length === 0) return []

  return entries
    .map((entry) => ({ entry, points: score(entry, terms) }))
    .filter(({ points }) => points > 0)
    .sort((a, b) => b.points - a.points || new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime())
    .map(({ entry }) => entry)
}

/**
 * Trechos do texto onde algum termo aparece, já mesclados, para destacar.
 * Só funciona quando a normalização não muda o tamanho do texto (o caso de
 * texto em português já composto); do contrário não destaca nada.
 */
export function highlightRanges(text: string, terms: string[]): [number, number][] {
  const normalized = normalizeText(text)
  if (normalized.length !== text.length || terms.length === 0) return []

  const ranges: [number, number][] = []
  for (const term of terms) {
    let from = 0
    for (;;) {
      const at = normalized.indexOf(term, from)
      if (at === -1) break
      ranges.push([at, at + term.length])
      from = at + term.length
    }
  }

  ranges.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
    else merged.push([...range])
  }
  return merged
}
