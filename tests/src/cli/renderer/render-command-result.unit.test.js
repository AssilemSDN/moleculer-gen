import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  renderCommandResult,
  renderUnexpectedError
} from '../../../../src/cli/renderer/render-command-result.js'
import { logger } from '../../../../src/utils/logger.js'

vi.mock('../../../../src/utils/logger.js', () => ({
  logger: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    plain: vi.fn(),
    newLine: vi.fn(),
    debug: vi.fn()
  }
}))

beforeEach(() => {
  vi.resetAllMocks()
})

describe('renderCommandResult', () => {
  describe('OK cases', () => {
    it('OK : Should render checks, warnings, success and next steps', () => {
      const result = {
        success: true,
        dryRun: false,
        checks: ['Config valid'],
        warnings: [{ message: 'Deprecated option' }],
        errors: [],
        plannedChanges: [],
        nextSteps: [
          { type: 'command', value: 'npm install' },
          { type: 'text', value: 'Read README' }
        ],
        data: { serviceName: 'users' }
      }
      renderCommandResult({
        commandName: 'add-service',
        result,
        successMessage: data => `Added ${data.serviceName}`
      })
      expect(logger.success).toHaveBeenCalledWith('Config valid')
      expect(logger.warn).toHaveBeenCalledWith('Deprecated option')
      expect(logger.success).toHaveBeenCalledWith('Added users')
      expect(logger.plain).toHaveBeenCalledWith('  $ npm install')
      expect(logger.plain).toHaveBeenCalledWith('  Read README')
    })

    it('OK : Should render and group dry-run changes', () => {
      const result = {
        success: true,
        dryRun: true,
        plannedChanges: [
          { type: 'create', target: 'a.js' },
          { type: 'create', target: 'a.js' },
          { target: 'b.js' }
        ]
      }
      renderCommandResult({
        commandName: 'init',
        result
      })
      expect(logger.info).toHaveBeenCalledWith(
        'Dry run — no files will be modified'
      )
      expect(logger.plain).toHaveBeenCalledWith(
        expect.stringContaining('a.js x2')
      )
      expect(logger.plain).toHaveBeenCalledWith(
        expect.stringContaining('b.js')
      )
      expect(logger.success).toHaveBeenCalledWith(
        'init completed — 3 planned changes'
      )
    })
  })

  describe('KO cases', () => {
    it('KO : Should render command errors', () => {
      const error = new Error('boom')
      const result = {
        success: false,
        errors: [{ message: 'Invalid config' }],
        nextSteps: [],
        error
      }
      renderCommandResult({
        commandName: 'validate',
        result
      })
      expect(logger.error).toHaveBeenCalledWith('Invalid config')
      expect(logger.debug).toHaveBeenCalledWith(
        'Raw error: ',
        error
      )
      expect(logger.success).not.toHaveBeenCalled()
    })

    it('KO : Should render fallback error when result has no errors', () => {
      renderCommandResult({
        commandName: 'validate',
        result: {
          success: false
        }
      })
      expect(logger.error).toHaveBeenCalledWith(
        'An unexpected internal error occurred.'
      )
      expect(logger.success).not.toHaveBeenCalled()
    })
  })

  describe('KO unexpected error cases', () => {
    it('KO : Should render unexpected internal error', () => {
      const error = new Error('boom')
      renderUnexpectedError('init', error)
      expect(logger.error).toHaveBeenCalledWith(
        'An unexpected internal error occurred.'
      )
      expect(logger.debug).toHaveBeenCalledWith(
        'Unexpected error during init:',
        error
      )
    })
  })
})
