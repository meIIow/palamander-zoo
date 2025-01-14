
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './../dist',
    emptyOutDir: false, // so that non-content script build files (added first) don't get deleted
    rollupOptions: {
      input: {
        content: resolve(__dirname, './extension/content.tsx'),
        'content-wrapper': resolve(__dirname, './extension/content-wrapper.ts'),
      },
      output: {
        // Preserve name of entry files for chrome extension manifest reference.
        assetFileNames: `assets/[name].css`, // hack to give CSS a consistent, un-hashed name.
        entryFileNames: `assets/[name].js`,
      },
    },
  },
  publicDir: './../public'
});
