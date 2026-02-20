import { motion } from 'framer-motion'
import {
  BrainIcon,
  LockIcon,
  CloudIcon,
  TargetIcon,
  EyeIcon,
  AlertIcon,
} from '../ui/Icons'

const services = [
  {
    icon: <BrainIcon className="w-6 h-6" />,
    title: 'AI Security & Governance',
    description:
      'Assess and mitigate risks across LLM deployments, data pipelines, and AI-powered products. Build policies for model use, data protection, and responsible AI adoption.',
  },
  {
    icon: <LockIcon className="w-6 h-6" />,
    title: 'Security Architecture',
    description:
      'Design and implement Zero Trust architectures, network segmentation, and identity-centric access controls tailored for modern hybrid environments.',
  },
  {
    icon: <CloudIcon className="w-6 h-6" />,
    title: 'Cloud Security',
    description:
      'Harden cloud posture across AWS, Azure, and GCP. Continuous posture management, configuration audits, and compliance alignment.',
  },
  {
    icon: <TargetIcon className="w-6 h-6" />,
    title: 'Offensive Security',
    description:
      'Penetration testing, red teaming, and AI-specific attack simulations to uncover exposures before adversaries do.',
  },
  {
    icon: <EyeIcon className="w-6 h-6" />,
    title: 'SOC Advisory & Detection',
    description:
      'Develop high-fidelity SIEM use cases, detection rules, and threat hunting programs that reduce noise and surface real threats.',
  },
  {
    icon: <AlertIcon className="w-6 h-6" />,
    title: 'Incident Response Readiness',
    description:
      'Build and test incident response playbooks, run tabletop exercises, and establish rapid containment procedures for AI-era threats.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Services() {
  return (
    <div className="relative w-full h-full flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-transparent to-brand-black/60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <span className="font-mono text-xs text-brand-cyan/60 tracking-widest uppercase">
            What We Do
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-white">
            Our Services
          </h2>
          <p className="mt-3 text-brand-text/60 max-w-xl">
            End-to-end cybersecurity consulting designed for organizations
            navigating AI adoption and evolving threats.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((svc) => (
            <motion.div
              key={svc.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-panel border-glow p-5 group cursor-default"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2.5 rounded-lg bg-brand-cyan/5 text-brand-cyan border border-brand-cyan/10 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/20 transition-colors">
                  {svc.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-white group-hover:text-brand-cyan transition-colors">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-text/60">
                    {svc.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
