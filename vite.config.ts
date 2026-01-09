import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'es2022', // Updated to support top-level await
    minify: 'esbuild',
    sourcemap: true,
  },
  define: {
    // Discord Activities require globalThis
    global: 'globalThis',
  },
})
