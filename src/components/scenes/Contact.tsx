import { motion } from 'framer-motion'
import { MailIcon } from '../ui/Icons'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Contact() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-purple/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Label */}
          <motion.div variants={itemVariants}>
            <span className="font-mono text-xs text-brand-cyan/60 tracking-widest uppercase">
              Get in Touch
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="mt-3 text-3xl md:text-5xl font-bold text-brand-white leading-tight"
          >
            Let's Secure
            <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              Your AI Future
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="mt-5 text-brand-text/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto"
          >
            Whether you're adopting AI or defending against AI-powered threats,
            we'll help you move forward with confidence. Reach out to start the conversation.
          </motion.p>

          {/* Email CTA */}
          <motion.div variants={itemVariants} className="mt-10">
            <a
              href="mailto:contact@securology.ai"
              className="inline-flex items-center gap-3 glass-panel border-glow px-8 py-4 rounded-xl text-brand-cyan hover:bg-brand-cyan/10 transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] group"
            >
              <span className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 group-hover:bg-brand-cyan/20 transition-colors">
                <MailIcon className="w-5 h-5" />
              </span>
              <span className="text-base md:text-lg font-medium tracking-wide">
                contact@securology.ai
              </span>
            </a>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-cyan/30" />
            <span className="font-mono text-[10px] text-brand-muted/40 tracking-widest uppercase">
              Securology.ai
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-cyan/30" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
