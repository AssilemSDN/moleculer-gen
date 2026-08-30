/*
 * PATH /src/errors/AppError.d.ts
 */

import type { ErrorCode } from './error-codes.js'

/**
 * Options accepted by AppError.
 */
export interface AppErrorOptions {
  /** Machine-readable application error code. */
  code?: ErrorCode
  /** Additional details useful for debugging. */
  details?: unknown
  /** Original error that caused this error. */
  cause?: unknown
}

/**
 * Application-specific error.
 */
export class AppError extends Error {
  name: 'AppError'
  code?: ErrorCode
  details: unknown

  constructor(
    message: string,
    options?: AppErrorOptions
  )
}