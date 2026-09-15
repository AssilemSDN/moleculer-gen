import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',

    coverage: {
      provider: 'v8',

      reporter: [
        'text',
        'lcov'
      ],

      include: [
        'src/**/*.{js,ts}'
      ],

      exclude: [
        'tests/**',
        'src/modules/**',
        'node_modules',
        '**/*.d.ts'
      ]
    }
  }
})
