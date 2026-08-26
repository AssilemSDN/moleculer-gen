/*
  PATH /src/utils/safe-run.js
*/
import { ExitCodes } from './exit-codes.js'

import {
  createCommandResult,
  addError
} from './command-result.js'

/**
 * Wraps an async command and ensures a consistent execution result.
 */
export const safeRun = (fn) => async (...args) => {
  const dryRun = args[0]?.dryRun ?? false

  try {
    return (
      await fn(...args) ??
      createCommandResult({ dryRun })
    )
  } catch (err) {
    const result = createCommandResult({ dryRun })
    const isAppError = err?.name === 'AppError'

    addError(result, {
      code:
        err?.code ??
        (isAppError ? 'APPLICATION_ERROR' : 'INTERNAL_ERROR'),

      message: isAppError
        ? err.message
        : 'An unexpected internal error occurred.',

      ...(err?.details && {
        details: err.details
      })
    })

    return {
      ...result,
      success: false,
      error: err,
      exitCode: isAppError
        ? ExitCodes.APPLICATION_ERROR.code
        : ExitCodes.INTERNAL_ERROR.code
    }
  }
}
