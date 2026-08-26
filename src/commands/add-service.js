/*
  PATH /src/commands/add-service.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { safeRun } from '../utils/safe-run.js'
import {
  createCommandResult,
  addPlannedChange
} from '../utils/command-result.js'
import { addServicePrompts } from '../prompts/add-service-prompts.js'
import { addNewServiceToProject } from '../generators/add-service/add-new-service-to-project.js'
import { validateServiceNameAvailable } from '../validators/add-service/validate-service-can-be-added.js'

import { AppError } from '../errors/AppError.js'

import {
  exists,
  readJsonFile
} from '../utils/fs-helpers.js'

import { loadJsonConfigFile } from '../utils/config-helpers.js'
import { validateAddServiceConfig } from '../validators/config/validate-add-service-config.js'
import { ErrorCodes } from '../errors/error-codes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

/**
 * Load and validate a service configuration from a JSON file.
 *
 * @param {string} configFile Path to the configuration file.
 * @returns {Promise<object>} Validated and normalized configuration.
 */
export const loadServiceConfigFromFile = async (configFile) => {
  const config = await loadJsonConfigFile(configFile, {
    invalidJsonCode: ErrorCodes.INVALID_CONFIG,
    label: 'Service config'
  })
  return validateAddServiceConfig(config)
}

/**
 * CLI command to generate a new Moleculer.js service
 * within an initialized project.
 *
 * @param {object} [options={}] Command options.
 * @param {boolean} [options.dryRun=false] Run without writing files.
 * @param {string} [options.configFile] Optional service config file.
 * @returns {Promise<object>} Command result.
 */
export const addService = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    const result = createCommandResult({ dryRun })

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
          code: ErrorCodes.PROJECT_NOT_INITIALIZED
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
          code: ErrorCodes.INVALID_CONFIG
        }
      )
    }

    // 4. Get service configuration
    const answers = configFile
      ? await loadServiceConfigFromFile(configFile)
      : await addServicePrompts({
        validateService: serviceName =>
          validateServiceNameAvailable({
            serviceName,
            moleculerGenConfig
          })
      })

    const serviceResult = await addNewServiceToProject({
      projectNameSanitized,
      serviceConfig: answers,
      templateDir: TEMPLATE_DIR,
      projectDir,
      moleculerGenConfig,
      dryRun
    })

    for (const plannedChange of serviceResult.plannedChanges) {
      addPlannedChange(result, plannedChange, { projectDir })
    }

    result.data = serviceResult.serviceConfig

    return result
  }
)
