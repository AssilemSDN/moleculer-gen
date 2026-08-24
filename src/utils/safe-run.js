/*
  PATH /src/utils/safe-run.js
*/
import { ExitCodes } from './exit-codes.js'
import { logger } from './logger.js'

/**
 * Wraps an async function and ensures consistent return format.
 */
export const safeRun = (fn) => async (...args) => {
  try {
    const result = await fn(...args)

    if (
      result &&
      typeof result === 'object' &&
      !Array.isArray(result)
    ) {
      const {
        warning,
        warnings = [],
        ...data
      } = result

      const normalizedWarnings = [
        ...(warning ? [warning] : []),
        ...(Array.isArray(warnings) ? warnings : [warnings])
      ].filter(Boolean)

      return {
        success: true,
        warnings: normalizedWarnings,
        data
      }
    }

    return {
      success: true,
      warnings: [],
      data: result
    }
  } catch (err) {
    if (err.name === 'AppError') {
      logger.error(err.message)
      if (err.details) logger.debug('Details:', err.details)
      process.exitCode = ExitCodes.USER_ERROR.code
    } else {
      logger.error('An unexpected internal error occurred.')
      logger.info('Run again with --debug for more details.')
      logger.debug('Internal error:', err)
      process.exitCode = ExitCodes.INTERNAL_ERROR.code
    }

    return {
      success: false,
      error: err
    }
  }
}
