/*
  PATH /src/commands/add-services.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { AppError } from '../errors/AppError.js'

import { safeRun } from '../utils/safe-run.js'
import {
  createCommandResult,
  addPlannedChange,
  addWarning
} from '../utils/command-result.js'
/* Helpers */
import { exists, readJsonFile } from '../utils/fs-helpers.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
/* Generate new services */
import { validateAddServicesConfig } from '../validators/config/validate-add-services-config.js'
import { addNewServiceToProject } from '../generators/add-service/add-new-service-to-project.js'
import { ErrorCodes } from '../errors/error-codes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

const skippableErrorCodes = new Set([
  'SERVICE_ALREADY_EXISTS',
  'MODEL_ALREADY_EXISTS',
  'DOCKER_SERVICE_ALREADY_EXISTS'
])

/**
 * Load and validate multiple service configurations from a JSON file.
 *
 * @param {string} configFile Path to the configuration file.
 * @returns {Promise<object>} Validated and normalized configuration.
 */
const loadServicesConfigFromFile = async (configFile) => {
  const config = await loadJsonConfigFile(configFile, {
    configType: 'Services config'
  })
  return validateAddServicesConfig(config)
}

/**
 * Add multiple services to an initialized project.
 */
export const addServices = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    const result = createCommandResult({ dryRun })

    if (!configFile) {
      throw new AppError(
        'Missing required configFile argument',
        {
          code: ErrorCodes.MISSING_REQUIRED_OPTION
        }
      )
    }

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
        'projectNameSanitized is missing from project config',
        {
          code: ErrorCodes.INVALID_CONFIG
        }
      )
    }

    // 4. Load services configuration
    const config = await loadServicesConfigFromFile(configFile)
    if (config.services.length === 0) {
      throw new AppError(
        'Invalid services config: services must not be empty',
        {
          code: ErrorCodes.INVALID_CONFIG
        }
      )
    }

    const created = []
    const skipped = []
    // 5. Add services sequentially
    for (const serviceConfig of config.services) {
      const { serviceName } = serviceConfig
      try {
        const serviceResult = await addNewServiceToProject({
          projectNameSanitized,
          serviceConfig,
          templateDir: TEMPLATE_DIR,
          projectDir,
          moleculerGenConfig,
          dryRun
        })

        created.push(serviceName)

        for (const plannedChange of serviceResult.plannedChanges) {
          addPlannedChange(result, {
            ...plannedChange,
            service: serviceName
          }, { projectDir })
        }
      } catch (error) {
        if (skippableErrorCodes.has(error.code)) {
          skipped.push({
            serviceName,
            code: error.code,
            message: error.message
          })
          continue
        }
        throw error
      }
    }

    // 6. Add non-blocking warnings
    if (created.length === 0 && skipped.length > 0) {
      addWarning(result, {
        code: 'ALL_SERVICES_SKIPPED',
        message: 'All services were skipped',
        services: skipped
      })
    } else if (skipped.length > 0) {
      addWarning(result, {
        code: 'SERVICES_SKIPPED',
        message: `Skipped services: ${skipped}
          .map(({ serviceName }) => serviceName)
          .join(', ')}`,
        services: skipped
      })
    }

    // 7. Expose command data
    result.data = {
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped
    }
    return result
  }
)
