import { sortFromSearch, type SortOrder } from '@/lib/blog-list'

/**
 * A ordem da lista mora no endereço (`?ordem=antigos`), que o `useSyncExternalStore`
 * lê. Assim o botão Voltar, os links compartilhados e uma página recarregada
 * mostram a mesma ordem. `pushState` não avisa ninguém, então quem troca o
 * endereço chama `notifySort` em seguida.
 */
const EVENT = 'blog:ordem'

export function subscribeSort(callback: () => void): () => void {
  window.addEventListener('popstate', callback)
  window.addEventListener(EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(EVENT, callback)
  }
}

export const getSortSnapshot = (): SortOrder => sortFromSearch(window.location.search)

/** No servidor e na primeira renderização do navegador vale a ordem padrão, que é a do HTML estático. */
export const getServerSort = (): SortOrder => 'recentes'

export const notifySort = (): void => {
  window.dispatchEvent(new Event(EVENT))
}
