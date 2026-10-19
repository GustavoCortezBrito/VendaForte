'use client'

import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'

/** Pixels de movimento a partir dos quais o gesto vira arrasto (antes disso é clique). */
const THRESHOLD = 6

/**
 * Arrastar com o mouse para rolar um contêiner na horizontal, como no toque.
 * No celular a rolagem já é nativa, então só o mouse é tratado. O clique que o
 * navegador dispara ao soltar depois de um arrasto é descartado, para não abrir
 * o cartão em que o gesto terminou.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const state = useRef({ active: false, moved: false, startX: 0, startLeft: 0 })
  const [dragging, setDragging] = useState(false)

  const end = () => {
    state.current.active = false
    setDragging(false)
  }

  const handlers = {
    onPointerDown(event: PointerEvent<T>) {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      state.current = { active: true, moved: false, startX: event.clientX, startLeft: event.currentTarget.scrollLeft }
    },
    onPointerMove(event: PointerEvent<T>) {
      const current = state.current
      if (!current.active) return
      const dx = event.clientX - current.startX
      if (!current.moved && Math.abs(dx) > THRESHOLD) {
        current.moved = true
        setDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      if (current.moved) event.currentTarget.scrollLeft = current.startLeft - dx
    },
    onPointerUp: end,
    onPointerCancel: end,
    onClickCapture(event: MouseEvent<T>) {
      if (!state.current.moved) return
      event.preventDefault()
      event.stopPropagation()
      state.current.moved = false
    },
    // Links e imagens são arrastáveis por padrão no navegador, o que roubaria o gesto
    onDragStart(event: MouseEvent<T>) {
      event.preventDefault()
    },
  }

  return { ref, dragging, handlers }
}
