/*
  PATH  /src/core/commands/AppError.js
*/

/**
 * Custom error class for application-specific errors.
 * @class AppError
 * @extends Error
 * @param {string} message - Human-readable error message
 * @param {Object} [options]
 * @param {string} [options.code='APP_ERROR'] - Machine-readable error code
 * @param {any} [options.details=null] - Additional details for debugging
 */
export class AppError extends Error {
  constructor (message, { code = 'APP_ERROR', details = null } = {}) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}
