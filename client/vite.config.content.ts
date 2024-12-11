
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false, // So that main build files don't get deleted
    rollupOptions: {
      input: {
        content: resolve(__dirname, './src/extension/content.tsx'),
        'content-wrapper': resolve(__dirname, './src/extension/content-wrapper.ts'),
      },
      output: {
        // Preserve name of entry files for chrome extension manifest reference.
        entryFileNames: `assets/[name].js`,
      },
    },
  },
});
