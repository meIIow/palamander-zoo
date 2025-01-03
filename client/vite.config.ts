import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        demo: resolve(__dirname, 'demo.html'),
        worker: resolve(__dirname, './src/extension/background.ts')
      },
      output: {
        // Preserve name of entry files for chrome extension manifest reference.
        entryFileNames: `assets/[name].js`,
      },
    },
  },
});
