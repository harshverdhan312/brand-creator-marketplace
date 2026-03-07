import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: run dev server on port 5137
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5137,
    strictPort: false
  },
})
