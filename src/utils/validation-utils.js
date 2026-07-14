import { logger } from './logger.js'

export const runValidator = async ({
  name,
  validator,
  args = [],
  fatalOnThrow = false,
  formatError = error =>
    `Unable to validate ${name}: ${error.message}`
}) => {
  logger.info(`Checking : ${name}...`)

  try {
    const result = await validator(...args)

    if (result.valid) {
      logger.info(
        `✅ ${name} validation completed with no errors.`
      )
    } else if (result.canContinue === true) {
      logger.warn(
        `⚠️ ${name} contains validation errors. Continuing with valid configuration entries.`
      )
    } else {
      logger.error(
        `❌ ${name} contains validation errors with no valid configuration entries. Cannot continue.`
      )
    }
    return result
  } catch (error) {
    logger.error(
      `❌ ${name} validation could not be completed.`
    )
    return normalizeValidationResult({
      ...result,
      valid: false,
      fatal: fatalOnThrow,
      executionFailed: true,
      errors: [
        formatError(error)
      ],
      warnings: []
    })
  }
}

const normalizeValidationResult = (
  result = {}
) => {
  return {
    errors: result.errors || [],
    warnings: result.warnings || [],
    nbErrors: result.errors?.length || 0,
    nbWarnings: result.warnings?.length || 0,
    valid: typeof result.valid === 'boolean'
      ? result.valid
      : result.errors?.length === 0
  }
}
