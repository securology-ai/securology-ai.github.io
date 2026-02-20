import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { SceneId } from '../types'

interface HUDProps {
  activeScene: SceneId
}

export default function HUD({ activeScene }: HUDProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const sceneLabels: Record<SceneId, string> = {
    hero: 'SYS://HOME',
    services: 'SYS://SERVICES',
    contact: 'SYS://CONTACT',
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="mx-3 mb-3 md:mx-6 md:mb-4 px-4 py-2 flex items-center justify-between">
        {/* Left HUD label */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <motion.span
            key={activeScene}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[10px] text-brand-cyan/60 tracking-widest"
          >
            {sceneLabels[activeScene]}
          </motion.span>
          <div className="hidden md:block w-24 h-px bg-gradient-to-r from-brand-cyan/20 to-transparent scanline" />
        </div>

        {/* Right HUD */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-24 h-px bg-gradient-to-l from-brand-cyan/20 to-transparent" />
          <span className="font-mono text-[10px] text-brand-muted/40 tracking-wider">
            {time} UTC
          </span>
          <span className="font-mono text-[10px] text-brand-cyan/40">
            SECUROLOGY.AI
          </span>
        </div>
      </div>
    </div>
  )
}
