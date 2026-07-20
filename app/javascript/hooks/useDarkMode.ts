import { useEffect, useState } from 'react'

function readIsDark(): boolean {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const dark = readIsDark()
    applyDarkClass(dark)
    return dark
  })

  useEffect(() => {
    applyDarkClass(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  function toggleDarkMode() {
    setIsDark((prev) => !prev)
  }

  return { isDark, toggleDarkMode }
}
