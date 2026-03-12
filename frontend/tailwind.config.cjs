module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0e13',
        'panel': '#0d1219',
        'panel-light': '#131a24',
        'neon-blue': '#00e5ff',
        'neon-pink': '#ff4dff',
        'neon-green': '#39ff94',
        'muted-cyan': '#6fe3e6',
        'surface': '#111820',
        'surface-light': '#1a2332',
        'border-dim': 'rgba(0,229,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neon-sm': '0 4px 24px rgba(0,229,255,0.07), 0 0 12px rgba(0,229,255,0.06)',
        'neon-md': '0 8px 32px rgba(0,229,255,0.10), 0 0 20px rgba(0,229,255,0.05)',
        'neon-glow': '0 0 20px rgba(0,229,255,0.15), 0 0 60px rgba(0,229,255,0.05)',
        'neon-pink': '0 0 20px rgba(255,77,255,0.12), 0 0 60px rgba(255,77,255,0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,229,255,0.1), 0 0 20px rgba(0,229,255,0.05)' },
          '100%': { boxShadow: '0 0 10px rgba(0,229,255,0.2), 0 0 40px rgba(0,229,255,0.1)' },
        }
      }
    },
  },
  plugins: [],
}
