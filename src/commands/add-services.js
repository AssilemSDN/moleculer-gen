/*
  PATH /src/commands/add-services.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { safeRun } from '../utils/safe-run.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
import { validateAddServicesConfig } from '../validators/config/validate-add-services-config.js'
import { AppError } from '../errors/AppError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

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

    const config = await loadServicesConfigFromFile(configFile)
    return config
  }
)
