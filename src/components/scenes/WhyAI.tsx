import { motion } from 'framer-motion'
import { DatabaseIcon, UserIcon, CheckCircleIcon, ZapIcon } from '../ui/Icons'

const threats = [
  {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Expanded Attack Surface',
    body: 'Every AI integration — from data pipelines and prompt interfaces to autonomous agents and third-party plugins — introduces new vectors that traditional security controls were never designed to cover.',
  },
  {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Faster Attacker Automation',
    body: 'Adversaries are already leveraging AI for reconnaissance, phishing, and exploit generation at speeds that outpace conventional detection and response.',
  },
  {
    icon: <ZapIcon className="w-5 h-5" />,
    title: 'Governance Gap',
    body: 'Most organizations lack the policies, controls, and monitoring needed to govern AI systems in production — leaving them exposed to regulatory risk, data leakage, and model misuse.',
  },
]

const principles = [
  {
    icon: <DatabaseIcon className="w-7 h-7" />,
    label: 'Protect Data',
    desc: 'Classify, encrypt, and control data flowing through AI systems at every stage.',
  },
  {
    icon: <UserIcon className="w-7 h-7" />,
    label: 'Control Identity',
    desc: 'Enforce least-privilege access for both humans and AI agents across all environments.',
  },
  {
    icon: <CheckCircleIcon className="w-7 h-7" />,
    label: 'Validate AI Outputs',
    desc: 'Monitor, test, and audit AI-generated outputs before they reach production or end users.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function WhyAI() {
  return (
    <div className="relative w-full h-full flex items-center">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-cyan/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className="font-mono text-xs text-brand-purple/60 tracking-widest uppercase">
            The Landscape
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-white">
            Why AI-Era Security
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Threat context */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {threats.map((t) => (
              <motion.div
                key={t.title}
                variants={itemVariants}
                className="glass-panel p-5 flex gap-4"
              >
                <div className="shrink-0 mt-0.5 text-brand-red/80">{t.icon}</div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-white">
                    {t.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-text/60">
                    {t.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Principles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.p
              variants={itemVariants}
              className="text-sm text-brand-text/60 mb-4 leading-relaxed"
            >
              Security in the AI era demands three foundational principles
              applied consistently across every layer of your technology stack.
            </motion.p>

            {principles.map((p) => (
              <motion.div
                key={p.label}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="glass-panel border-glow p-5 flex items-start gap-4 group cursor-default"
              >
                <div className="shrink-0 p-3 rounded-xl bg-brand-cyan/5 text-brand-cyan border border-brand-cyan/10 group-hover:bg-brand-cyan/10 transition-colors">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-brand-white group-hover:text-brand-cyan transition-colors">
                    {p.label}
                  </h3>
                  <p className="mt-1 text-xs text-brand-text/60 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
