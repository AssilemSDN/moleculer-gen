import { describe, expect, it } from 'vitest'

import { safeRun } from '../../../src/utils/safe-run.js'
import { ExitCodes } from '../../../src/utils/exit-codes.js'
import { AppError } from '../../../src/errors/AppError.js'
import { ErrorCodes } from '../../../src/errors/error-codes.js'

describe('safeRun', () => {
  describe('OK cases', () => {
    it('OK : Should return command result', async () => {
      const expected = { success: true, data: { value: 42 } }
      const result = await safeRun(async () => expected)()
      expect(result).toBe(expected)
    })

    it('OK : Should create default result and preserve dry-run', async () => {
      const result = await safeRun(async () => undefined)({ dryRun: true })
      expect(result).toEqual(expect.objectContaining({
        success: true,
        dryRun: true
      }))
    })
  })

  describe('KO cases', () => {
    it('KO : Should expose handled AppError', async () => {
      const error = new AppError('Invalid config', {
        code: ErrorCodes.INVALID_CONFIG,
        details: { field: 'services' }
      })

      const result = await safeRun(async () => { throw error })()
      expect(result.success).toBe(false)
      expect(result.error).toBe(error)
      expect(result.exitCode).toBe(ExitCodes.APPLICATION_ERROR.code)
      expect(result.errors).toContainEqual({
        code: ErrorCodes.INVALID_CONFIG,
        message: 'Invalid config',
        details: { field: 'services' }
      })
    })

    it('KO : Should hide unexpected internal error', async () => {
      const error = new Error('Sensitive details')
      error.name = 'AppError'

      const result = await safeRun(async () => { throw error })()
      expect(result.success).toBe(false)
      expect(result.error).toBe(error)
      expect(result.exitCode).toBe(ExitCodes.INTERNAL_ERROR.code)
      expect(result.errors).toContainEqual({
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'An unexpected internal error occurred.'
      })
    })
  })
})
