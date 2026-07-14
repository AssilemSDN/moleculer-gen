/*
  PATH /src/validators/project-validator.js
*/

import { AppError } from '../errors/AppError.js'
import { logger } from '../utils/logger.js'

import {
  validateMoleculerConfig
} from './validate-project/validate-moleculer-config.js'

import {
  validateRequiredDynamicFiles
} from './validate-project/validate-required-dynamic-files.js'

import {
  validateRequiredStaticFiles
} from './validate-project/validate-required-static-files.js'

import {
  runValidator
} from '../utils/validation-utils.js'

/**
 * Validates the structure of a Moleculer project.
 *
 * Fatal errors stop validation immediately.
 * Recoverable validation errors are accumulated so that all possible
 * issues can be reported in a single execution.
 *
 * @param {string} projectDir Project root directory.
 * @returns {Promise<{
 *   valid: boolean,
 *   errors: string[],
 *   warnings: string[],
 *   nbErrors: number,
 *   nbWarnings: number
 * }>}
 */
export const projectValidator = async (projectDir = process.cwd()) => {
  const checks = []
  const errors = []
  const warnings = []

  try {
    const result = await validateMoleculerConfig(projectDir)

    checks.push(...result.checks)
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  } catch (err) {
    // Unexpected errors must reach safeRun and be reported as internal errors.
    if (!(err instanceof AppError)) {
      throw err
    }
    // User error.
    errors.push({
      code: err.code,
      message: err.message,
      details: err.details ?? null
    })
  }

  logger.debug('Project validation result:', {
    valid: errors.length === 0,
    checks,
    errors,
    warnings
  })
export const projectValidator = async (
  projectDir = process.cwd()
) => {
  const errors = []
  const warnings = []

  const staticResult = await runValidator({
    name: 'Required static files and directories',
    validator: validateRequiredStaticFiles,
    args: [projectDir],
    formatError: error =>
      `Unable to validate required static files and directories: ${error.message}`
  })

  const configResult = await runValidator({
    name: 'Moleculer config.json structure',
    validator: validateMoleculerConfig,
    args: [projectDir],
    formatError: error =>
      `Unable to validate .moleculer-gen/config.json structure: ${error.message}`
  })

  const dynamicResult = await runValidator({
    name: 'Required generated files and directories',
    validator: validateRequiredDynamicFiles,
    args: [projectDir, configResult.config],
    formatError: error =>
      `Unable to validate required generated files and directories: ${error.message}`
  })

  errors.push(
    ...staticResult.errors,
    ...configResult.errors,
    ...dynamicResult.errors
  )
  warnings.push(
    ...staticResult.warnings,
    ...configResult.warnings,
    ...dynamicResult.warnings
  )

  if (errors.length > 0) {
    logger.error(
      `❌ ${errors.length} validation error(s) found in project structure.`
    )
  } else {
    logger.info(
      '✅ Project structure validation completed with no errors.'
    )
  }

  if (warnings.length > 0) {
    logger.warn(
      `⚠️ ${warnings.length} validation warning(s) found in project structure.`
    )
  }

  return {
    valid: errors.length === 0,
    checks,
    errors,
    warnings,
    nbErrors: errors.length,
    nbWarnings: warnings.length
  }
}
