/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // These reference CSS custom properties so light/dark toggling works
          black:    'var(--color-bg-base)',
          surface:  'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          subtle:   'var(--color-border-subtle)',
          lime:     '#D4FF00',
          'lime-hover': '#c2eb00',
          'lime-muted': 'rgba(212, 255, 0, 0.12)',
          orange:   '#FF5500',
          'orange-muted': 'rgba(255, 85, 0, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(212, 255, 0, 0.25)',
        'glow-orange': '0 0 25px -5px rgba(255, 85, 0, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
