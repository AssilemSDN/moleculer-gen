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
        `⚠️ ${name} contains validation errors. Continuing with valid entries.`
      )
    } else if (result.canContinue === false) {
      logger.error(
        `❌ ${name} contains validation errors. Dependent validations cannot continue.`
      )
    } else {
      logger.error(
        `❌ ${name} contains ${result.nbErrors} validation error(s).`
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

const normalizeMessages = messages =>
  Array.isArray(messages)
    ? messages.filter(Boolean)
    : messages
      ? [messages]
      : []

const normalizeValidationResult = (
  result = {}
) => {
  return {
    errors: normalizeMessages(result.errors),
    warnings: normalizeMessages(result.warnings),
    nbErrors: result.errors?.length || 0,
    nbWarnings: result.warnings?.length || 0,
    valid: typeof result.valid === 'boolean'
      ? result.valid
      : result.errors?.length === 0
  }
}
