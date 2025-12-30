import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: path.resolve(__dirname, 'src'), 
    include: ['**/*.spec.ts'],  
    coverage: {
      reporter: ['text', 'lcov'],
    },
    alias: {
      core: path.resolve(__dirname, '../core/src'),
    },
  },
});