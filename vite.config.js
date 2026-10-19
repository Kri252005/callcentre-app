import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { pool: 'threads', environment: 'jsdom', globals: true, setupFiles: './src/test/setup.js' },
});
