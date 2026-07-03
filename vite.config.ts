import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the app works when served from a GitHub Pages sub-path
  // (https://<user>.github.io/<repo>/) as well as from a root domain.
  base: './',
  plugins: [react()],
})
