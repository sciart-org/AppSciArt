import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/support/setup.js'],
    env: { NODE_ENV: 'testing' },
    server: { deps: { external: [/\/backend\/src\//] } },
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000
  }
})
