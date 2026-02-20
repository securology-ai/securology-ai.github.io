export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#b388ff" />
          </linearGradient>
        </defs>
        {/* Shield */}
        <path
          d="M16 2L28 8V16C28 23 22 28 16 30C10 28 4 23 4 16V8L16 2Z"
          stroke="url(#logo-grad)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* AI text */}
        <text
          x="16"
          y="19"
          textAnchor="middle"
          fontFamily="monospace"
          fontWeight="bold"
          fontSize="9"
          fill="url(#logo-grad)"
        >
          AI
        </text>
      </svg>
      <span className="text-lg font-semibold tracking-tight">
        <span className="text-brand-white">Securology</span>
        <span className="text-brand-cyan">.ai</span>
      </span>
    </div>
  )
}
