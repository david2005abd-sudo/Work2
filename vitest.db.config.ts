import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/db/**/*.test.ts'],
    testTimeout: 20_000,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
