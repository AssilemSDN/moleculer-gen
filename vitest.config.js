import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',

      reporter: [
        'text',
        'lcov'
      ],

      reportsDirectory: 'coverage/unit',

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
