import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './ui/Logo'
import Button from './ui/Button'
import { MenuIcon, XIcon } from './ui/Icons'
import { useMotion } from '../context/MotionContext'
import { NAV_ITEMS, type SceneId } from '../types'

interface NavigationProps {
  activeScene: SceneId
  onNavigate: (id: SceneId) => void
}

export default function Navigation({ activeScene, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { reducedMotion, toggleReducedMotion } = useMotion()

  const handleNav = useCallback(
    (id: SceneId) => {
      onNavigate(id)
      setMobileOpen(false)
    },
    [onNavigate]
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="glass-panel-strong mx-3 mt-3 md:mx-6 md:mt-4 px-4 md:px-6 py-3 flex items-center justify-between"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => handleNav('hero')}
          className="focus-visible:outline-2 focus-visible:outline-brand-cyan rounded"
          aria-label="Go to home"
        >
          <Logo />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                activeScene === item.id
                  ? 'text-brand-cyan'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
              aria-current={activeScene === item.id ? 'page' : undefined}
            >
              {item.label}
              {activeScene === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-px bg-brand-cyan"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Reduced motion toggle */}
          <button
            onClick={toggleReducedMotion}
            className="text-xs font-mono text-brand-muted hover:text-brand-text px-2 py-1 rounded border border-brand-border/50 hover:border-brand-border transition-colors"
            aria-label={reducedMotion ? 'Enable motion' : 'Reduce motion'}
            title={reducedMotion ? 'Enable motion' : 'Reduce motion'}
          >
            {reducedMotion ? '▣ Motion Off' : '▢ Motion On'}
          </button>

          {/* CTA - desktop */}
          <div className="hidden lg:block">
            <Button size="sm" onClick={() => handleNav('contact')}>
              Book a Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-brand-muted hover:text-brand-text"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-panel-strong mx-3 mt-1 p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeScene === item.id
                      ? 'text-brand-cyan bg-brand-cyan/5'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface/40'
                  }`}
                >
                  {item.shortLabel || item.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-brand-border/30">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleNav('contact')}
                >
                  Book a Consultation
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
