/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Securology brand palette
        brand: {
          black: '#0a0a0f',
          charcoal: '#12121a',
          surface: '#1a1a2e',
          border: '#2a2a40',
          muted: '#6b7280',
          text: '#e0e0e8',
          white: '#f0f0f5',
          cyan: '#00e5ff',
          'cyan-dim': '#00b8d4',
          purple: '#b388ff',
          'purple-dim': '#7c4dff',
          green: '#00e676',
          red: '#ff5252',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(42,42,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,64,0.3) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
}
