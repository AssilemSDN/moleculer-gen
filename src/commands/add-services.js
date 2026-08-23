/*
  PATH /src/commands/add-services.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { AppError } from '../errors/AppError.js'
import { safeRun } from '../utils/safe-run.js'
import { logger } from '../utils/logger.js'
/* Helpers */
import { exists, readJsonFile } from '../utils/fs-helpers.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
/* Generate new services */
import { validateAddServicesConfig } from '../validators/config/validate-add-services-config.js'
import { addNewServiceToProject } from '../generators/add-service/add-new-service-to-project.js'

/* */
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
    invalidJsonCode: 'INVALID_SERVICES_CONFIG',
    label: 'Services config'
  })
  return validateAddServicesConfig(config)
}

/**
 * Add multiple services to an initialized project.
 */
export const addServices = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    if (!configFile) {
      throw new AppError(
        'Missing required configFile argument',
        { code: 'MISSING_CONFIG_FILE' }
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
        'projectNameSanitized is missing from project config',
        {
          code: 'PROJECT_NAME_SANITIZED_MISSING'
        }
      )
    }

    // 4. Load services configuration
    const config = await loadServicesConfigFromFile(configFile)
    if (config.services.length === 0) {
      throw new AppError(
        'Invalid services config: services must not be empty',
        { code: 'INVALID_SERVICES_CONFIG' }
      )
    }

    const created = []
    const skipped = []
    // 5. Add services sequentially
    for (const serviceConfig of config.services) {
      try {
        await addNewServiceToProject({
          projectNameSanitized,
          serviceConfig,
          templateDir: TEMPLATE_DIR,
          projectDir,
          moleculerGenConfig,
          dryRun
        })
        created.push(serviceConfig.serviceName)
        if (!dryRun) {
          logger.info(
            `✅ Service "${serviceConfig.serviceName}" created successfully`
          )
        }
      } catch (error) {
        if (skippableErrorCodes.has(error.code)) {
          skipped.push(serviceConfig.serviceName)
          logger.warn(
            `⏭️ Service "${serviceConfig.serviceName}" already exists, skipping`
          )
          continue
        }
        throw error
      }
    }

    const warnings = []
    if (created.length === 0 && skipped.length > 0) {
      warnings.push('No service was added. All services were skipped.')
    } else if (created.length > 0 && skipped.length > 0) {
      warnings.push(
        `Some services were skipped because they already exist: ${skipped.join(', ')}`
      )
    }

    return {
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
      warnings
    }
  }
)
