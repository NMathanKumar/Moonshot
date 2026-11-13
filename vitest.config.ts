import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    // Unit tests only: exclude integration tests
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    exclude: ['tests/integration/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/integration/**'],
    },
  },
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
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@layouts/*': path.resolve(__dirname, './src/layouts/*'),
    },
  },
});
