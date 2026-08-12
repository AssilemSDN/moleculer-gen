/*
 * PATH /src/generators/init-project/generate-package.json.js
 */
import path from 'path'
import { writeFile } from '../../utils/fs-helpers.js'

/**
 * Generate a `package.json` file for the new project.
 *
 * @async
 * @param {string} projectNameSanitized - Name of the project
 * @param {string} outputDir - Directory to write the package.json into
 * @param {Object} options - Additional options
 * @param {string} options.database - Key database chosen (e.g., 'mongodb')
 */
export const generatePackageJson = async (projectNameSanitized, outputDir, options) => {
  const { database } = options

  const pkg = {
    name: projectNameSanitized,
    version: '0.0.1',
    license: 'UNLICENSED',
    description: 'A simple Moleculer-based microservices with Docker Compose setup for development environment.',
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
      'moleculer-web': '0.11.0',
      nats: '2.29.3'
    },
    devDependencies: {
      standard: '17.1.2'
    },
    engines: {
      node: '>=24'
    },
    packageManager: 'yarn@4.18.0'
  }

  if (database === 'mongodb') {
    pkg.dependencies['moleculer-db-adapter-mongoose'] = '0.11.0'
    pkg.dependencies.mongoose = '8.24.1'
  }

  await writeFile(
    path.join(outputDir, 'package.json'),
    JSON.stringify(pkg, null, 2)
  )
}
