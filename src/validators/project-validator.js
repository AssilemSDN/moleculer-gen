/*
  PATH /src/validators/project-validator.js
*/

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
 * Fatal errors stop dependent validations.
 * Recoverable validation errors are accumulated.
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

  let dynamicResult = {
    valid: true,
    errors: [],
    warnings: [],
    nbErrors: 0,
    nbWarnings: 0
  }

  const canValidateDynamicFiles =
    configResult.validatedConfig &&
    (
      configResult.valid === true ||
      configResult.canContinue === true
    )

  if (canValidateDynamicFiles) {
    dynamicResult = await runValidator({
      name: 'Required generated files and directories',
      validator: validateRequiredDynamicFiles,
      args: [
        projectDir,
        configResult.validatedConfig
      ],
      formatError: error =>
        `Unable to validate required generated files and directories: ${error.message}`
    })
  } else {
    logger.warn(
      '⚠️ Required generated files and directories validation skipped. ' +
      'No usable validated configuration is available.'
    )
  }

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

  for (const error of errors) {
    logger.error(`error: ${error}`)
  }

  for (const warning of warnings) {
    logger.warn(`warning: ${warning}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    nbErrors: errors.length,
    nbWarnings: warnings.length
  }
}
