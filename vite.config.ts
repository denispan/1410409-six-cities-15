/// <reference types='vitest' />
/// <reference types='vite/client' />

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import redirectAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/six-cities/',
  plugins: [react(), redirectAll()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
