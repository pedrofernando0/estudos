import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.js'],
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['psicanalise/progresso/tracking.js']
    }
  }
});
