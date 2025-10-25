/*
  PATH  /src/core/commands/init-project.js
*/
import path from 'path'
import { fileURLToPath } from 'url'
import { initPrompts } from '../prompts/init-prompts.js'
import { safeRun } from '../utils/safe-run.js'
// Modules Factory
import { databases } from '../../dist/modules/databases/index.js'
import { transporters } from '../../dist/modules/transporters/index.js'
import { plugins } from '../../dist/modules/plugins/index.js'
import { ApiGatewayModule } from '../../dist/modules/backend-services/ApiGatewayModule.js'
// Generator
import { generate } from '../generators/initProject/generate.js'
import { exists, readFile } from '../utils/fs-helpers.js'
// Error
import { AppError } from '../errors/AppError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates/base')

/**
 * Validate that a project config object has all required fields and valid module keys.
 * @param {Object} config - Configuration object to validate
 * @param {string} config.projectName - Project name
 * @param {string} config.projectNameSanitized - Sanitized project name for filesystem usage
 * @param {string} config.database - Database key to use
 * @param {string} config.transporter - Transporter key to use
 * @param {string[]} config.plugins - Array of plugin keys
 * @throws {AppError} Throws if a required field is missing or an invalid module key is found
 * @returns {boolean} Returns true if config is valid
 */
const validateConfig = (config) => {
  const requiredFields = ['projectName', 'projectNameSanitized', 'database', 'transporter', 'plugins']
  for (const field of requiredFields) {
    if (!(field in config)) {
      throw new AppError(`Missing required config field: ${field}`, { code: 'INVALID_CONFIG' })
    }
  }
  if (!databases[config.database]) {
    throw new AppError(`Invalid database key: ${config.database}`, { code: 'INVALID_CONFIG' })
  }
  if (!transporters[config.transporter]) {
    throw new AppError(`Invalid transporter key: ${config.transporter}`, { code: 'INVALID_CONFIG' })
  }
  for (const pluginKey of config.plugins) {
    if (!plugins[pluginKey]) {
      throw new AppError(`Invalid plugin key: ${pluginKey}`, { code: 'INVALID_CONFIG' })
    }
  }
  return true
}

/**
 * Command to initialize a Moleculer project.
 * @async
 * @function initProject
 * @param {boolean} [options.dryRun=false] - If true, generates project files without writing them
 * @param {string} [options.configFile] - Path to a JSON config file for non-interactive project initialization
 * @throws {AppError} - Throws if the config file is missing or invalid, or required modules/plugins are invalid
 * @returns {Promise<Object>} - Resolves with the final project configuration (answers from prompts or config file)
 */
export const initProject = safeRun(async ({ dryRun = false, configFile } = {}) => {
  // 1- Ask prompts
  const answers = configFile
    ? await (async () => {
      const configPath = path.resolve(process.cwd(), configFile)
      if (!(await exists(configPath))) {
        throw new AppError(`Config file not found: ${configPath}`, { code: 'CONFIG_NOT_FOUND' })
      }
      const content = await readFile(configPath)
      const config = JSON.parse(content)
      validateConfig(config)
      return config
    })()
    : await initPrompts()
  const { projectNameSanitized, database, transporter, plugins: selectedPlugins } = answers

  // 2- Factory chosen modules
  const needsTraefikLabels = selectedPlugins.includes('traefik')
  const modulesToGenerate = [
    ApiGatewayModule({ projectNameSanitized, needsTraefikLabels }),
    databases[database](projectNameSanitized),
    transporters[transporter](projectNameSanitized),
    ...selectedPlugins
      .map(pluginKey => plugins[pluginKey])
      .filter(Boolean) // in case if a key doesn't exist
      .map(factory => factory(projectNameSanitized))
  ]

  // 3- Generate the project
  const projectDir = path.join(process.cwd(), projectNameSanitized)
  await generate(answers, { database }, modulesToGenerate, TEMPLATE_DIR, projectDir, { dryRun })

  return answers
})
