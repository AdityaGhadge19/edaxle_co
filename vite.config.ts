import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/edaxle_co/', // 👈 actual GitHub repo name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
