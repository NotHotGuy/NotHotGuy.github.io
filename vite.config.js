import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2022',
    // three.js / R3F / shadergradient only load through a dynamic import
    // (ShaderStage → ShaderField), so they land in their own lazy chunk.
    chunkSizeWarningLimit: 1400,
  },
})
