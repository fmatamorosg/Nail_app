import { useEffect, type RefObject } from 'react'

export function useModalAccessibility(
  isOpen: boolean,
  onClose: () => void,
  initialFocusRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    initialFocusRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialFocusRef])
}
