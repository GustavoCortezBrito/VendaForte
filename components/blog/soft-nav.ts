import type { MouseEvent } from 'react'

/**
 * Clique "normal" em um link: com Ctrl, Cmd, Shift, Alt ou botão do meio a
 * pessoa quer abrir em outra aba, então o navegador segue o link sozinho.
 */
export function isPlainClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

/**
 * Troca o endereço sem recarregar. O Next acompanha `history.pushState` e
 * atualiza `usePathname`, então a listagem se refaz no lugar, sem voltar ao
 * topo, e o botão Voltar do navegador continua funcionando.
 */
export function softNavigate(href: string): void {
  window.history.pushState(null, '', href)
}
