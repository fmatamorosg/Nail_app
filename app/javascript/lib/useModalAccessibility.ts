import { useEffect, useRef, type RefObject } from 'react'

export function useModalAccessibility(
  isOpen: boolean,
  onClose: () => void,
  initialFocusRef: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    initialFocusRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])
}