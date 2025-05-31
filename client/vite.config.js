import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // target: 'https://real-estate-marketplace-jofn.onrender.com',
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },

  plugins: [react()],
});
