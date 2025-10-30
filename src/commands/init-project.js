/*
  PATH  /src/commands/init-project.js
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
import { sanitizeName } from '../utils/common-helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

/**
 * Validate that a project config object has all required fields and valid module keys.
 */
export const validateConfig = (config) => {
  const requiredFields = ['projectName', 'database', 'transporter']
  for (const field of requiredFields) {
    if (!(field in config)) {
      throw new AppError(`Missing required config field: ${field}`, { code: 'INVALID_CONFIG' })
    }
  }
  if (!config.projectNameSanitized) {
    const projectNameSanitized = sanitizeName(config.projectName)
    config.projectNameSanitized = path.basename(projectNameSanitized)
  }
  if (!config.plugins) {
    config.plugins = []
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
 * Load and validate a project configuration from a JSON file.
 */
export const loadConfigFromFile = async (configFile) => {
  const configPath = path.resolve(process.cwd(), configFile)
  if (!(await exists(configPath))) {
    throw new AppError(`Config file not found: ${configPath}`, { code: 'CONFIG_NOT_FOUND' })
  }
  const content = await readFile(configPath)
  let config
  try {
    config = JSON.parse(content)
  } catch {
    throw new AppError(`Invalid JSON in config file: ${configPath}`, { code: 'INVALID_JSON' })
  }
  validateConfig(config)
  return config
}

/**
 * Command to initialize a Moleculer project.
 */
export const initProject = safeRun(async ({ dryRun = false, configFile } = {}) => {
  // 1. Get config
  const config = configFile ? await loadConfigFromFile(configFile) : await initPrompts()
  const { projectNameSanitized, database, transporter, plugins: selectedPlugins } = config
  // 2. Check if needing traefik labels
  const needsTraefikLabels = selectedPlugins.includes('traefik')
  // 3. Build modules
  const modulesToGenerate = [
    ApiGatewayModule({ projectNameSanitized, needsTraefikLabels }),
    databases[database](projectNameSanitized),
    transporters[transporter](projectNameSanitized),
    ...selectedPlugins
      .map(key => plugins[key])
      .filter(Boolean)
      .map(factory => factory(projectNameSanitized))
  ]
  // 4. Define options for generate
  const generateOptions = {
    answers: config,
    context: { database },
    modules: modulesToGenerate,
    templateDir: TEMPLATE_DIR,
    projectDir: path.join(process.cwd(), projectNameSanitized),
    options: { dryRun }
  }
  // 5. Generate
  await generate(generateOptions)
  return config
})
