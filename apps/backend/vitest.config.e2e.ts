import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
  },
  resolve: {
    alias: {
      '@common': resolve(__dirname, './src/common'),
      '@modules': resolve(__dirname, './src/modules'),
      '@data': resolve(__dirname, './data'),
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
