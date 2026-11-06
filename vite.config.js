import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localFilms } from './scripts/local-films.mjs';

export default defineConfig({
  plugins: [react(), localFilms()],
  base: './',
  build: { outDir: 'dist/client' },
});
