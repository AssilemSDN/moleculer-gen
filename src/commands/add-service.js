/*
  PATH  /src/commands/add-service.js
*/
import path from 'path'
import { fileURLToPath } from 'url'
import { safeRun } from '../utils/safe-run.js'
import { addServicePrompts } from '../prompts/add-service-prompts.js'
import { generateNewService } from '../generators/add/generate-new-service.js'
import { ensureEmptyDir, exists, readFile } from '../utils/fs-helpers.js'
import { AppError } from '../errors/AppError.js'
import { generateDefaultNames } from '../utils/common-helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

/**
 * Validates and normalizes a service configuration (configFile).
 * Fills in missing fields with default values.
 */
export const validateConfig = (config) => {
  // Required fields
  if (!config || typeof config !== 'object') {
    throw new AppError('Invalid service config: must be a JSON object', { code: 'INVALID_CONFIG' })
  }
  if (!config.serviceName || typeof config.serviceName !== 'string') {
    throw new AppError('Missing required field: serviceName', { code: 'INVALID_CONFIG' })
  }

  // Default values
  const defaults = generateDefaultNames(config.serviceName)
  const isCrud = !!config.isCrud
  const exposeApi = !!config.exposeApi

  // Normalized
  const normalized = {
    serviceName: config.serviceName,
    isCrud,
    exposeApi,
    serviceFileName: config.serviceFileName || defaults.serviceFileName,
    serviceDirectoryName: config.serviceDirectoryName || defaults.serviceDirectoryName
  }
  // Add required values for crud service
  if (isCrud) {
    normalized.modelFileName = config.modelFileName || defaults.modelFileName
    normalized.modelName = config.modelName || defaults.modelName
    normalized.modelVariableName = config.modelVariableName || defaults.modelVariableName
    normalized.collectionName = config.collectionName || defaults.collectionName
    normalized.schemaName = config.schemaName || defaults.schemaName
  }
  return normalized
}

/**
 * CLI command to generate a new Moleculer.js service within an initialized project.
 * Wrapped in `safeRun()` to handle errors gracefully and display user-friendly messages.
 * @async
 * @function addService
 * @param {Object} [options={}] - Optional configuration for the command.
 * @param {boolean} [options.dryRun=false] - If `true`, runs in simulation mode without writing files.
 * @throws {AppError} Throws an error if the project has not been initialized
 *                    (missing `.moleculer-gen/config.json`), or if directory validation fails.
 * @returns {Promise<Object>} Resolves with the `answers` object containing user inputs
 *                            (e.g. service name, CRUD settings, API exposure).
*/
export const addService = safeRun(async ({ dryRun = false, configFile } = {}) => {
  // 1- Ensure .moleculer-gen/ directory exists
  const projectDir = process.cwd()
  const moleculerGenConfigPath = path.join(projectDir, '.moleculer-gen/config.json')
  if (!(await exists(moleculerGenConfigPath))) {
    throw new AppError('The project does not seem initialized (.moleculer-gen folder or config.json missing)', {
      code: 'PROJECT_NOT_INITIALIZED'
    })
  }

  // 2- Read config
  const moleculerGenConfigContent = await readFile(moleculerGenConfigPath, 'utf-8')
  let moleculerGenConfig
  try {
    moleculerGenConfig = JSON.parse(moleculerGenConfigContent)
  } catch (err) {
    throw new AppError('Invalid JSON in .moleculer-gen/config.json', {
      code: 'INVALID_CONFIG_JSON'
    })
  }

  // 3- Extract projectNameSanitized
  const { projectNameSanitized } = moleculerGenConfig
  if (!projectNameSanitized) {
    throw new AppError('projectNameSanitized is missing in config.json', { code: 'PROJECT_NAME_SANITIZED_MISSING' })
  }

  // 4- Questions about the new service
  const answers = configFile
    ? await (async () => {
      const configPath = path.resolve(process.cwd(), configFile)
      if (!(await exists(configPath))) {
        throw new AppError(`Config file not found: ${configPath}`, { code: 'CONFIG_NOT_FOUND' })
      }
      const content = await readFile(configPath)
      let config
      try {
        config = JSON.parse(content)
      } catch {
        throw new AppError('Invalid JSON in service config file', { code: 'INVALID_SERVICE_CONFIG' })
      }
      const normalized = validateConfig(config)
      return normalized
    })()
    : await addServicePrompts()

  // 5- Ensure the service directory is empty
  const serviceDir = path.join(projectDir, `src/services/${answers.serviceDirectoryName}`)
  await ensureEmptyDir(serviceDir)

  // 6- Generate files and directories
  await generateNewService(projectNameSanitized, answers, TEMPLATE_DIR, projectDir, serviceDir, { dryRun })

  return answers
})
