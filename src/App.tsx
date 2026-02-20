import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MotionProvider } from './context/MotionContext'
import Navigation from './components/Navigation'
import HUD from './components/HUD'
import Hero from './components/scenes/Hero'
import Services from './components/scenes/Services'
import Contact from './components/scenes/Contact'
import { NAV_ITEMS, type SceneId } from './types'

/* Scene transition variants */
const sceneVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: 'blur(8px)',
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
}

function SceneRenderer({
  scene,
  onNavigate,
}: {
  scene: SceneId
  onNavigate: (id: SceneId) => void
}) {
  switch (scene) {
    case 'hero':
      return <Hero onNavigate={onNavigate} />
    case 'services':
      return <Services />
    case 'contact':
      return <Contact />
  }
}

function AppInner() {
  const [activeScene, setActiveScene] = useState<SceneId>('hero')

  const navigate = useCallback((id: SceneId) => {
    setActiveScene(id)
  }, [])

  /* Keyboard navigation: arrow keys or 1-3 */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ids = NAV_ITEMS.map((n) => n.id)
      const idx = ids.indexOf(activeScene)

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = ids[(idx + 1) % ids.length]
        setActiveScene(next)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = ids[(idx - 1 + ids.length) % ids.length]
        setActiveScene(prev)
      } else if (e.key >= '1' && e.key <= '3') {
        const target = ids[parseInt(e.key) - 1]
        if (target) setActiveScene(target)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeScene])

  /* Prevent scrolling */
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    document.addEventListener('wheel', prevent, { passive: false })
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => {
      document.removeEventListener('wheel', prevent)
      document.removeEventListener('touchmove', prevent)
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-black">
      {/* Navigation */}
      <Navigation activeScene={activeScene} onNavigate={navigate} />

      {/* Scene container */}
      <main className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <SceneRenderer scene={activeScene} onNavigate={navigate} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HUD status bar */}
      <HUD activeScene={activeScene} />
    </div>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <AppInner />
    </MotionProvider>
  )
}
