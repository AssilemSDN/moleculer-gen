/*
  PATH  /src/core/utils/safe-run.js
*/
import { ExitCodes } from './exit-codes.js'
import { logger } from './logger.js'

/**
 * Wraps an async function and ensures consistent return format.
 */
export const safeRun = (fn) => async (...args) => {
  try {
    const result = await fn(...args)
    return {
      success: true,
      data: result
    }
  } catch (err) {
    if (err.name === 'AppError') {
      logger.error(err.message)
      if (err.details) logger.debug('Details:', err.details)
      process.exitCode = ExitCodes.USER_ERROR.code
    } else {
      logger.error('An internal error happened', err.message || err)
      logger.debug(err)
      process.exitCode = ExitCodes.INTERNAL_ERROR.code
    }
    return {
      success: false,
      error: err
    }
  }
}
