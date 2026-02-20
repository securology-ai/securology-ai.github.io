import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import Button from '../ui/Button'
import { ArrowRightIcon, DownloadIcon, ShieldIcon, CloudIcon, AlertIcon } from '../ui/Icons'
import type { SceneId } from '../../types'

const AICore = lazy(() => import('../three/AICore'))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

interface HeroProps {
  onNavigate: (id: SceneId) => void
}

export default function Hero({ onNavigate }: HeroProps) {
  const bullets = [
    { icon: <ShieldIcon className="w-4 h-4" />, text: 'AI Risk & Governance' },
    { icon: <CloudIcon className="w-4 h-4" />, text: 'Cloud & Zero Trust' },
    { icon: <AlertIcon className="w-4 h-4" />, text: 'Incident Readiness' },
  ]

  return (
    <div className="relative w-full h-full flex items-center">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <AICore />
      </Suspense>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-brand-black/40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {/* Tag */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              AI-Era Cybersecurity Consultancy
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
          >
            <span className="text-brand-white">Cybersecurity for</span>
            <br />
            <span className="text-glow-cyan bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              the AI Era
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="mt-5 text-base md:text-lg text-brand-text/70 leading-relaxed max-w-xl"
          >
            Helping enterprises adopt AI securely — with governance frameworks,
            resilient architectures, and rapid risk reduction that keep pace
            with the threat landscape.
          </motion.p>

          {/* Bullets */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap gap-3"
          >
            {bullets.map((b) => (
              <span
                key={b.text}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-brand-text/80 bg-brand-surface/40 border border-brand-border/30"
              >
                <span className="text-brand-cyan">{b.icon}</span>
                {b.text}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              icon={<ArrowRightIcon className="w-4 h-4" />}
              onClick={() => onNavigate('contact')}
            >
              Book a Consultation
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => {
                /* placeholder PDF link */
                alert('PDF download placeholder — link your capabilities PDF here.')
              }}
            >
              Download Capabilities
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
