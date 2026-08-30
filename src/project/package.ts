/*
 * PATH /src/project/package.ts
 */
import type { PackageContribution } from '../modules/types.js'

export interface BaseProjectPackage extends PackageContribution {
  version: string
  license: string
  description: string
  scripts: Record<string, string>
  engines: Record<string, string>
  packageManager: string
}

export const basePackage = {
  version: '0.0.1',
  license: 'UNLICENSED',

  description:
    'A simple Moleculer-based microservices with Docker Compose setup for development environment.',

  scripts: {
    repl: 'moleculer-runner -E .env.dev --repl --hot --config ./src/config/moleculer.repl.config.js ./src/services',
    audit: 'yarn npm audit --all --recursive --severity high',
    lint: 'standard "src/**/*.js"'
  },

  dependencies: {
    deepmerge: '4.3.1',
    dotenv: '17.4.2',
    moleculer: '0.15.1',
    'moleculer-db': '0.9.0',
    'moleculer-repl': '0.8.0',
    'moleculer-web': '0.11.0'
  },

  devDependencies: {
    standard: '17.1.2'
  },

  engines: {
    node: '>=24'
  },

  packageManager: 'yarn@4.18.0'
} satisfies BaseProjectPackage