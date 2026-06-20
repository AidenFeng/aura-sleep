import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On GitHub Pages the site is served from /<repo-name>/, so Vite's `base`
// must match. We set it via the BASE env var in the deploy workflow.
const base = process.env.BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
});
