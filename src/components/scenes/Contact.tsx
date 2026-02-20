import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { MailIcon, LinkedInIcon, GitHubIcon, ArrowRightIcon } from '../ui/Icons'

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

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Option A: mailto fallback
    const subject = encodeURIComponent(`Consultation Request from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`
    )
    window.location.href = `mailto:hello@securology.ai?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  const inputClasses =
    'w-full bg-brand-surface/50 border border-brand-border/40 rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-cyan/40 focus:ring-1 focus:ring-brand-cyan/20 transition-colors'

  return (
    <div className="relative w-full h-full flex items-center">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="font-mono text-xs text-brand-cyan/60 tracking-widest uppercase">
                Get in Touch
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-white">
                Let's Secure
                <br />
                Your AI Future
              </h2>
              <p className="mt-4 text-brand-text/60 max-w-md text-sm leading-relaxed">
                Whether you're building with AI or defending against AI-powered threats,
                we'll help you move forward with confidence. Schedule a consultation
                to discuss your security posture.
              </p>
            </motion.div>

            {/* Contact info */}
            <motion.div variants={itemVariants} className="mt-8 space-y-4">
              <a
                href="mailto:hello@securology.ai"
                className="flex items-center gap-3 text-sm text-brand-text/70 hover:text-brand-cyan transition-colors group"
              >
                <span className="p-2 rounded-lg bg-brand-surface/50 border border-brand-border/30 text-brand-cyan group-hover:bg-brand-cyan/10 transition-colors">
                  <MailIcon className="w-4 h-4" />
                </span>
                hello@securology.ai
              </a>
            </motion.div>

            {/* Social */}
            <motion.div variants={itemVariants} className="mt-6 flex gap-3">
              <a
                href="#"
                className="p-2.5 rounded-lg bg-brand-surface/40 border border-brand-border/30 text-brand-muted hover:text-brand-cyan hover:border-brand-cyan/20 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-brand-surface/40 border border-brand-border/30 text-brand-muted hover:text-brand-cyan hover:border-brand-cyan/20 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="glass-panel border-glow p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-white">Email Client Opened</h3>
                  <p className="mt-2 text-sm text-brand-text/60">
                    Complete sending via your email client, or reach us at hello@securology.ai directly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm text-brand-cyan hover:text-brand-cyan-dim transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-muted mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Company name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-muted mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your security needs..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    icon={<ArrowRightIcon className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                  <p className="text-[10px] text-brand-muted/40 text-center">
                    Opens your default email client. No data stored on this site.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
