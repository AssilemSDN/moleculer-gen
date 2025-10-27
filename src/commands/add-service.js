/*
  PATH  /src/commands/add-service.js
*/
import path from 'path'
import { safeRun } from '../utils/safe-run.js'
import { addServicePrompts } from '../prompts/add-service-prompts.js'
import { generateNewService } from '../generators/add/generate-new-service.js'
import { ensureEmptyDir, exists, readFile } from '../utils/fs-helpers.js'
import { fileURLToPath } from 'url'
import { AppError } from '../errors/AppError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

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
export const addService = safeRun(async ({ dryRun = false } = {}) => {
  // 1- Ensure .moleculer-gen/ directory exists
  const projectDir = process.cwd()
  const configPath = path.join(projectDir, '.moleculer-gen/config.json')
  if (!(await exists(configPath))) {
    throw new AppError('The project does not seem initialized (.moleculer-gen folder or config.json missing)', {
      code: 'PROJECT_NOT_INITIALIZED'
    })
  }

  // 2- Read config
  const configContent = await readFile(configPath, 'utf-8')
  let config
  try {
    config = JSON.parse(configContent)
  } catch (err) {
    throw new AppError('Invalid JSON in .moleculer-gen/config.json', {
      code: 'INVALID_CONFIG_JSON'
    })
  }

  // 3- Extract projectNameSanitized
  const { projectNameSanitized } = config
  if (!projectNameSanitized) {
    throw new AppError('projectNameSanitized is missing in config.json', { code: 'PROJECT_NAME_SANITIZED_MISSING' })
  }

  // 2- Questions about the new service
  const answers = await addServicePrompts()

  // 3- Ensure the service directory is empty
  const serviceDir = path.join(projectDir, `src/services/${answers.serviceDirectoryName}`)
  await ensureEmptyDir(serviceDir)

  // 4- Generate files and directories
  await generateNewService(projectNameSanitized, answers, TEMPLATE_DIR, projectDir, serviceDir, { dryRun })

  return answers
})
