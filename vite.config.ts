import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  // Served at the domain root (www.alephbeth.ai). Must be absolute: the
  // pre-rendered pages live in nested folders (/posts/<slug>/index.html) and a
  // relative base would resolve their asset URLs against the wrong directory.
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});
