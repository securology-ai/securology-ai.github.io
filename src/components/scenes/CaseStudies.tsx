import { motion } from 'framer-motion'
import { ShieldIcon, BrainIcon, EyeIcon } from '../ui/Icons'

const outcomes = [
  {
    icon: <ShieldIcon className="w-8 h-8" />,
    metric: '72%',
    label: 'Reduction in Cloud Misconfiguration Risk',
    description:
      'Implemented continuous posture management and automated remediation across a multi-cloud environment, significantly reducing exposure to common misconfigurations.',
    timeline: '8 weeks',
    color: 'cyan' as const,
  },
  {
    icon: <BrainIcon className="w-8 h-8" />,
    metric: '6 weeks',
    label: 'AI Governance Program Delivered',
    description:
      'Designed and deployed a comprehensive AI governance framework — including data classification policies, model risk assessments, and usage guidelines — for a financial services firm.',
    timeline: '6 weeks',
    color: 'purple' as const,
  },
  {
    icon: <EyeIcon className="w-8 h-8" />,
    metric: '3.5×',
    label: 'Detection Coverage Improvement',
    description:
      'Overhauled SIEM detection logic and built custom analytics rules, increasing actionable detection coverage for critical assets across on-prem and cloud workloads.',
    timeline: '12 weeks',
    color: 'cyan' as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function CaseStudies() {
  return (
    <div className="relative w-full h-full flex items-center">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-brand-cyan/60 tracking-widest uppercase">
              Outcomes
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-brand-muted border border-brand-border/40 bg-brand-surface/30">
              SAMPLE DATA
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white">
            Case Studies
          </h2>
          <p className="mt-3 text-brand-text/60 max-w-xl text-sm">
            Representative outcomes from engagements across regulated industries.
            Specific metrics are illustrative.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-5"
        >
          {outcomes.map((o) => (
            <motion.div
              key={o.label}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-panel border-glow p-6 flex flex-col group cursor-default"
            >
              {/* Icon */}
              <div
                className={`p-3 rounded-xl w-fit mb-5 border transition-colors ${
                  o.color === 'cyan'
                    ? 'bg-brand-cyan/5 text-brand-cyan border-brand-cyan/10 group-hover:bg-brand-cyan/10'
                    : 'bg-brand-purple/5 text-brand-purple border-brand-purple/10 group-hover:bg-brand-purple/10'
                }`}
              >
                {o.icon}
              </div>

              {/* Metric */}
              <div
                className={`text-3xl font-bold mb-1 ${
                  o.color === 'cyan' ? 'text-brand-cyan' : 'text-brand-purple'
                }`}
              >
                {o.metric}
              </div>
              <h3 className="text-sm font-semibold text-brand-white mb-3">
                {o.label}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-brand-text/55 flex-1">
                {o.description}
              </p>

              {/* Timeline */}
              <div className="mt-4 pt-3 border-t border-brand-border/20 flex items-center justify-between">
                <span className="font-mono text-[10px] text-brand-muted/50 uppercase tracking-wider">
                  Engagement
                </span>
                <span className="font-mono text-xs text-brand-text/50">
                  {o.timeline}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
