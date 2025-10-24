/*
  PATH  /src/core/generator/generate-package.json.js
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
      dev: 'moleculer-runner -E .env.dev --repl --hot --config ./src/config/moleculer.config.js ./src/services'
    },
    dependencies: {
      dotenv: '16.4.5',
      moleculer: '0.14.35',
      'moleculer-db': '0.8.28',
      'moleculer-db-adapter-mongoose': '0.10.0',
      'moleculer-repl': '0.7.4',
      'moleculer-web': '0.10.8',
      nats: '2.29.3',
      slugify: '1.6.6'
    },
    devDependencies: {
      standard: '17.1.2'
    }
  }
  if (database === 'mongodb') {
    pkg.dependencies.mongoose = '7.4.0'
  }
  await writeFile(path.join(outputDir, 'package.json'), JSON.stringify(pkg, null, 2))
}
