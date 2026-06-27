/*
  PATH /src/generators/init-project/generate-modules.js
*/
import { writeFile, writeYAML } from '../../utils/fs-helpers.js'
import path from 'path'
import { renderTemplateToFile } from '../../utils/render-template.js'
import merge from 'lodash/merge.js'
import { buildDockerService } from '../../utils/docker-helpers.js'

const writeDockerService = async (service, serviceName, projectDir) => {
  const dockerServicePath = path.join(projectDir, `docker/services/${serviceName}.yaml`)
  const doc = {
    services: service
  }
  await writeYAML(dockerServicePath, doc)
}

const writeTemplateFiles = async (templates = [], templateDir, projectDir) => {
  if (!templates.length) return

  await Promise.all(templates.map(template =>
    renderTemplateToFile(
      path.join(templateDir, 'dynamic', template.templatePath),
      path.join(projectDir, template.outputPath),
      template.data ?? {}
    )
  ))
}
/**
 * Generate `docker-compose.yml` and `.env.example` for a list of modules.
 * @async
 * @param {Array<ModuleDefinition>} modules - List of modules to include
 * @param {string} projectDir - Directory where files will be generated
 * @returns {Promise<void>}
 */
export const generateModules = async (templateDir, projectDir, modules) => {
  let dockerComposeMinimalContent = {
    // version: '3.9',
    services: {},
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
    volumes: { db_data: {} }
  }

  const envLines = []
  const promises = []

  for (const module of modules) {
    // --- Extract module docker service
    const service = buildDockerService(module.docker)
    promises.push(writeDockerService(service, path.basename(module.meta.key), projectDir))

    // --- Merge global docker config needed by the module
    if (module.docker.global) {
      dockerComposeMinimalContent = merge(dockerComposeMinimalContent, module.docker.global)
    }

    // --- Specified module templates
    if (module.templates?.length) {
      promises.push(writeTemplateFiles(module.templates, templateDir, projectDir))
    }

    const moduleEnvLines = Object.entries(module.env).map(([k, v]) => `${k}=${v}`)
    // Build .env file lines content
    envLines.push(`# ${module.meta.name}`)
    envLines.push(...moduleEnvLines)
    envLines.push('')
  }

  // --- Prepare files to generate

  const envContent = envLines.join('\n')

  const envExamplePath = path.join(projectDir, '.env.example')
  const envDevPath = path.join(projectDir, '.env.dev')
  const composePath = path.join(projectDir, 'docker-compose.yaml')

  // --- Generate files
  promises.push(
    writeYAML(composePath, dockerComposeMinimalContent),
    writeFile(envExamplePath, envContent),
    writeFile(envDevPath, envContent)
  )

  await Promise.all(promises)
}
