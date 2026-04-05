/*
  PATH  /src/utils/command-runner.js
*/
import { logger } from './logger.js'

export const runCommand = async (commandName, commandFn, options) => {
  logger.info(`🚀 Starting ${commandName}...`)
  try {
    const result = await commandFn(options)
    if (result.success) {
      logger.info(`🎉 ${commandName} completed successfully!`)
      if (result.data !== undefined) logger.info('Result:\n', result.data)
    } else {
      logger.error(`❌ ${commandName} failed.`)
      process.exitCode ||= 1
    }
  } catch (err) {
    logger.error(`❌ Unexpected error during ${commandName}:`, err)
    process.exitCode ||= 1
  }
}
