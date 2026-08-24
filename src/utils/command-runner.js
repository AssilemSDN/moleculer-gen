/*
  PATH /src/utils/command-runner.js
*/
import { logger } from './logger.js'

export const runCommand = async (commandName, commandFn, options) => {
  logger.debug(`Starting ${commandName}...`)

  try {
    const result = await commandFn(options)
    const warnings = result.warnings ?? []

    if (result.success) {
      for (const warning of warnings) {
        logger.warn(warning)
      }

      logger.newLine()
      if (warnings.length > 0) {
        logger.warn(`${commandName} completed with warnings.`)
      } else {
        logger.success(`${commandName} completed successfully!`)
      }

      if (result.data !== undefined) {
        logger.debug('Result:\n', result.data)
      }

      return
    }

    logger.newLine()
    logger.error(`${commandName} failed.`)
    process.exitCode ||= 1
  } catch (err) {
    logger.error(`Unexpected error during ${commandName}:`, err)
    process.exitCode ||= 1
  }
}
