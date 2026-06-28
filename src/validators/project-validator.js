/*
  PATH /src/validators/project-validator.js
*/

import { logger } from '../utils/logger.js'
import { validateMoleculerConfig } from './validate-moleculer-config.js'

/**
 * Validates the structure of a Moleculer project to ensure it adheres to expected conventions.
 * This includes checking for the presence of essential directories and files.
 *
 * WIP: This function may be expanded to include additional validation checks in the future.
 *
 * @param {string} projectDir - The root directory of the Moleculer project to validate.
 */
export const projectValidator = async (projectDir = process.cwd()) => {
  const errors = []
  const warnings = []

  logger.info('Checking .moleculer-gen/config.json...')

  try {
    const result = await validateMoleculerConfig(projectDir)

    errors.push(...result.errors)
    warnings.push(...result.warnings)
  } catch (err) {
    errors.push(err.message)
  }

  // Logging errors and warnings

  for (const error of errors) {
    logger.error(`${error}`)
  }

  for (const warning of warnings) {
    logger.warn(`${warning}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
