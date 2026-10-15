import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({mode}) => {
  return {
    // Set base path for GitHub Pages deployment
    // Change 'Nibras' to your repository name
    base: mode === 'production' ? '/Nibras/' : '/',
    plugins: [react(), tailwindcss()],
    define: {
      // Only expose VITE_ prefixed environment variables to client
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
