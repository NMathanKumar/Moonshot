import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@components/*': path.resolve(__dirname, './src/components/*'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hooks/*': path.resolve(__dirname, './src/hooks/*'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@styles/*': path.resolve(__dirname, './src/styles/*'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@assets/*': path.resolve(__dirname, './src/assets/*'),
      '@services': path.resolve(__dirname, './src/services'),
      '@services/*': path.resolve(__dirname, './src/services/*'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@routes/*': path.resolve(__dirname, './src/routes/*'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@pages/*': path.resolve(__dirname, './src/pages/*'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@utils/*': path.resolve(__dirname, './src/utils/*'),
    },
  },
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    middlewareMode: false,
  },
  optimizeDeps: {
    // Suppress Vite plugin analysis warnings for aws-amplify subexports
    // This is a known compatibility issue with aws-amplify v6 and doesn't affect functionality
    exclude: [],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
});
