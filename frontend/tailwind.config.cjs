module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0b0f14',
        'panel': '#071018',
        'neon-blue': '#00e5ff',
        'neon-pink': '#ff4dff',
        'neon-green': '#7cffb2',
        'muted-cyan': '#6fe3e6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'neon-sm': '0 4px 24px rgba(0,229,255,0.07), 0 0 12px rgba(0,229,255,0.06)'
      }
    },
  },
  plugins: [],
}
