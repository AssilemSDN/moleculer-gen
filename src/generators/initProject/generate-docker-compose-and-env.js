/*
  PATH  /src/core/generator/generate-docker-compose-and-env.js
*/
import { writeFile, writeYAML } from '../../utils/fs-helpers.js'
import path from 'path'
import { ConvertModuleToDockerAndEnv } from './convert-module-to-docker-and-env.js'

/**
 * Generate `docker-compose.yml` and `.env.example` for a list of modules.
 * @async
 * @param {Array<ModuleDefinition>} modules - List of modules to include
 * @param {string} outputDir - Directory where files will be generated
 * @returns {Promise<void>}
 */
export const generateDockerComposeAndEnv = async (modules, outputDir) => {
  const services = {}
  const envLines = []

  for (const module of modules) {
    const { service, envLines: lines } = ConvertModuleToDockerAndEnv(module)
    Object.assign(services, service)
    envLines.push(`# ${module.meta.name}`)
    envLines.push(...lines)
    envLines.push('')
  }

  // --- write docker-compose.yml ---
  const dockerComposeDoc = {
    // version: '3.9',
    services,
    networks: {
      publique: {
        name: 'publique',
        driver: 'bridge'
      },
      backend: {
        name: 'backend',
        internal: true,
        driver: 'bridge'
      }
    },
    volumes: { mongodb_data: {} }
  }
  const envContent = envLines.join('\n')
  const envExamplePath = path.join(outputDir, '.env.example')
  const envDevPath = path.join(outputDir, '.env.dev')
  const composePath = path.join(outputDir, 'docker-compose.yml')

  await Promise.all([
    writeYAML(composePath, dockerComposeDoc),
    writeFile(envExamplePath, envContent),
    writeFile(envDevPath, envContent)
  ])
}
