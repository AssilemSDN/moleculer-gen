/*
  PATH /src/commands/init-project.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { initPrompts } from '../prompts/init-prompts.js'
import { safeRun } from '../utils/safe-run.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
import { sanitizeName } from '../utils/common-helpers.js'

// Modules Factory
import { databases } from '../../dist/modules/databases/index.js'
import { transporters } from '../../dist/modules/transporters/index.js'
import { plugins } from '../../dist/modules/plugins/index.js'
import { ApiGatewayModule } from '../../dist/modules/backend-services/ApiGatewayModule.js'

// Generator
import { generate } from '../generators/init-project/generate.js'

// Error
import { AppError } from '../errors/AppError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

/**
 * Validate and normalize a project configuration.
 *
 * @param {object} config Project configuration.
 * @returns {object} Validated and normalized configuration.
 * @throws {AppError} If the configuration is invalid.
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new AppError(
      'Invalid project config: must be a JSON object',
      { code: 'INVALID_CONFIG' }
    )
  }

  const requiredFields = [
    'projectName',
    'database',
    'transporter'
  ]

  for (const field of requiredFields) {
    if (!(field in config)) {
      throw new AppError(
        `Missing required config field: ${field}`,
        { code: 'INVALID_CONFIG' }
      )
    }
  }

  if (!databases[config.database]) {
    throw new AppError(
      `Invalid database key: ${config.database}`,
      { code: 'INVALID_CONFIG' }
    )
  }

  if (!transporters[config.transporter]) {
    throw new AppError(
      `Invalid transporter key: ${config.transporter}`,
      { code: 'INVALID_CONFIG' }
    )
  }

  const pluginKeys = config.plugins ?? []

  if (!Array.isArray(pluginKeys)) {
    throw new AppError(
      'Invalid plugins config: must be an array',
      { code: 'INVALID_CONFIG' }
    )
  }

  for (const pluginKey of pluginKeys) {
    if (!plugins[pluginKey]) {
      throw new AppError(
        `Invalid plugin key: ${pluginKey}`,
        { code: 'INVALID_CONFIG' }
      )
    }
  }

  return {
    ...config,
    projectNameSanitized:
      config.projectNameSanitized ??
      path.basename(sanitizeName(config.projectName)),
    plugins: pluginKeys
  }
}

/**
 * Load and validate an initialization configuration from a JSON file.
 *
 * @param {string} configFile Path to the configuration file.
 * @returns {Promise<object>} Validated and normalized configuration.
 */
const loadInitConfigFromFile = async (configFile) => {
  const config = await loadJsonConfigFile(configFile, {
    invalidJsonCode: 'INVALID_JSON',
    label: 'Init config'
  })

  return validateConfig(config)
}

/**
 * Command to initialize a Moleculer project.
 */
export const initProject = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    // 1. Get config
    const config = configFile
      ? await loadInitConfigFromFile(configFile)
      : await initPrompts()

    const {
      projectNameSanitized,
      database,
      transporter,
      plugins: selectedPlugins
    } = config

    // 2. Check if Traefik labels are needed
    const needsTraefikLabels = selectedPlugins.includes('traefik')

    // 3. Build modules
    const modulesToGenerate = [
      ApiGatewayModule({
        projectNameSanitized,
        needsTraefikLabels
      }),

      databases[database](projectNameSanitized),

      transporters[transporter](projectNameSanitized),

      ...selectedPlugins
        .map(key => plugins[key])
        .filter(Boolean)
        .map(factory =>
          factory({
            projectNameSanitized,
            needsTraefikLabels
          })
        )
    ]

    // 4. Define generation options
    const generateOptions = {
      answers: config,
      dryRun,
      context: {
        database
      },
      modules: modulesToGenerate,
      templateDir: TEMPLATE_DIR,
      projectDir: path.join(
        process.cwd(),
        projectNameSanitized
      )
    }

    // 5. Generate
    await generate(generateOptions)
    return config
  }
)
