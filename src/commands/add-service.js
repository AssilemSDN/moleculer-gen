/*
  PATH /src/commands/add-service.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { safeRun } from '../utils/safe-run.js'
import { addServicePrompts } from '../prompts/add-service-prompts.js'
import { generateNewService } from '../generators/add/generate-new-service.js'

import {
  ensureEmptyDir,
  exists,
  readJsonFile
} from '../utils/fs-helpers.js'

import { generateDefaultNames } from '../utils/common-helpers.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
import { AppError } from '../errors/AppError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

/**
 * Validate and normalize a service configuration.
 * Fills missing fields with default values.
 *
 * @param {object} config Service configuration.
 * @returns {object} Validated and normalized configuration.
 * @throws {AppError} If the configuration is invalid.
 */
export const validateConfig = (config) => {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new AppError(
      'Invalid service config: must be a JSON object',
      { code: 'INVALID_CONFIG' }
    )
  }

  if (!config.serviceName || typeof config.serviceName !== 'string') {
    throw new AppError(
      'Missing required field: serviceName',
      { code: 'INVALID_CONFIG' }
    )
  }

  // Default values
  const defaults = generateDefaultNames(config.serviceName)

  const isCrud = !!config.isCrud
  const exposeApi = !!config.exposeApi

  // Normalized values
  const normalized = {
    serviceName: config.serviceName,
    isCrud,
    exposeApi,
    serviceFileName:
      config.serviceFileName ||
      defaults.serviceFileName,
    serviceDirectoryName:
      config.serviceDirectoryName ||
      defaults.serviceDirectoryName
  }

  // Add required values for CRUD services
  if (isCrud) {
    normalized.modelFileName =
      config.modelFileName ||
      defaults.modelFileName

    normalized.modelName =
      config.modelName ||
      defaults.modelName

    normalized.modelVariableName =
      config.modelVariableName ||
      defaults.modelVariableName

    normalized.collectionName =
      config.collectionName ||
      defaults.collectionName

    normalized.schemaName =
      config.schemaName ||
      defaults.schemaName
  }

  return normalized
}

/**
 * Load and validate a service configuration from a JSON file.
 *
 * @param {string} configFile Path to the configuration file.
 * @returns {Promise<object>} Validated and normalized configuration.
 */
export const loadServiceConfigFromFile = async (configFile) => {
  const config = await loadJsonConfigFile(configFile, {
    invalidJsonCode: 'INVALID_SERVICE_CONFIG',
    label: 'Service config'
  })

  return validateConfig(config)
}

/**
 * CLI command to generate a new Moleculer.js service
 * within an initialized project.
 *
 * @param {object} [options={}] Command options.
 * @param {boolean} [options.dryRun=false] Run without writing files.
 * @param {string} [options.configFile] Optional service config file.
 * @returns {Promise<object>} Generated service configuration.
 */
export const addService = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    const projectDir = process.cwd()

    const moleculerGenConfigPath = path.join(
      projectDir,
      '.moleculer-gen/config.json'
    )

    // 1. Ensure the project is initialized
    if (!(await exists(moleculerGenConfigPath))) {
      throw new AppError(
        'The project does not seem initialized (.moleculer-gen folder or config.json missing)',
        {
          code: 'PROJECT_NOT_INITIALIZED'
        }
      )
    }

    // 2. Read Moleculer Gen project config
    const moleculerGenConfig = await readJsonFile(
      moleculerGenConfigPath
    )

    // 3. Extract project name
    const { projectNameSanitized } = moleculerGenConfig

    if (!projectNameSanitized) {
      throw new AppError(
        'projectNameSanitized is missing in config.json',
        {
          code: 'PROJECT_NAME_SANITIZED_MISSING'
        }
      )
    }

    // 4. Get service configuration
    const answers = configFile
      ? await loadServiceConfigFromFile(configFile)
      : await addServicePrompts()

    // 5. Ensure the target service directory is empty
    const serviceDir = path.join(
      projectDir,
      'src/services',
      answers.serviceDirectoryName
    )

    await ensureEmptyDir(serviceDir)

    // 6. Generate service files
    await generateNewService(
      projectNameSanitized,
      answers,
      TEMPLATE_DIR,
      projectDir,
      serviceDir,
      { dryRun }
    )
    return answers
  }
)
