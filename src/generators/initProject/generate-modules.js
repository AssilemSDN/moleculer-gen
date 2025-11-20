/*
  PATH  /src/core/generator/generate-docker-compose-and-env.js
*/
import { writeFile, writeYAML } from '../../utils/fs-helpers.js'
import path from 'path'
import { renderTemplateToFile } from '../../utils/render-template.js'

const writeDockerService = async (service, serviceName, projectDir) => {
  const dockerServicePath = path.join(projectDir, `docker/services/${serviceName}.yaml`)
  const doc = {
    services: service
  }
  writeYAML(dockerServicePath, doc)
}

const writeFiles = async (templates, templateDir, projectDir) => {
  console.log(templates)
  templates?.map(template =>
    renderTemplateToFile(path.join(templateDir, template.templatePath), path.join(projectDir, template.outputPath), template.data))
}

/**
 * Generate `docker-compose.yml` and `.env.example` for a list of modules.
 * @async
 * @param {Array<ModuleDefinition>} modules - List of modules to include
 * @param {string} projectDir - Directory where files will be generated
 * @returns {Promise<void>}
 */
export const generateModules = async (modules, templateDir, projectDir) => {
  const envLines = []

  // Generate module files and build env content
  for (const module of modules) {
    const service = {
      [module.docker.serviceName]: {
        image: module.docker.image,
        container_name: module.docker.container_name,
        environment: module.docker.environment,
        networks: module.docker.networks,
        volumes: module.docker.volumes,
        ports: module.docker.ports,
        command: module.docker.command,
        depends_on: module.docker.depends_on,
        labels: module.docker.labels,
        env_file: module.docker.env_file,
        security_opt: module.docker.security_opt,
        restart: module.docker.restart
      }
    }
    writeDockerService(service, module.meta.key, projectDir)
    if (module.templates?.length) {
      writeFiles(module.templates, templateDir, projectDir)
    }
    const moduleEnvLines = Object.entries(module.env).map(([k, v]) => `${k}=${v}`)
    // Build .env file lines content
    envLines.push(`# ${module.meta.name}`)
    envLines.push(...moduleEnvLines)
    envLines.push('')
  }

  // --- Prepare files to generate

  const envContent = envLines.join('\n')
  const dockerComposeMinimalContent = {
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

  const envExamplePath = path.join(projectDir, '.env.example')
  const envDevPath = path.join(projectDir, '.env.dev')
  const composePath = path.join(projectDir, 'docker-compose.yaml')

  // --- Generate files

  // Write minimal docker compose
  writeYAML(composePath, dockerComposeMinimalContent)
  // Write env files
  writeFile(envExamplePath, envContent)
  writeFile(envDevPath, envContent)
}
