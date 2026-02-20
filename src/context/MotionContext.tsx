import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface MotionContextType {
  reducedMotion: boolean
  toggleReducedMotion: () => void
}

const MotionContext = createContext<MotionContextType>({
  reducedMotion: false,
  toggleReducedMotion: () => {},
})

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('securology-reduced-motion')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('securology-reduced-motion', String(reducedMotion))
  }, [reducedMotion])

  const toggleReducedMotion = () => setReducedMotion((prev) => !prev)

  return (
    <MotionContext.Provider value={{ reducedMotion, toggleReducedMotion }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotion = () => useContext(MotionContext)
