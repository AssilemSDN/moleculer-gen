import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fsHelpers from '../../../src/utils/fs-helpers.js'

import { addService } from '../../../src/commands/add-service.js'
import { addServicePrompts } from '../../../src/prompts/add-service-prompts.js'
import { generateNewService } from '../../../src/generators/add/generate-new-service.js'
import { AppError } from '../../../src/errors/AppError.js'

vi.mock('../../../src/prompts/add-service-prompts.js', () => ({
  addServicePrompts: vi.fn()
}))

vi.mock('../../../src/generators/add/generate-new-service.js', () => ({
  generateNewService: vi.fn()
}))

// --- Tests ---
describe('addService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const expectSuccess = result => {
    expect(result).toEqual(expect.objectContaining({ success: true }))
  }

  const expectFailure = result => {
    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  }

  // ---------------------------
  // Happy path
  // ---------------------------
  it('OK : Should add a service via prompts', async () => {
    vi.spyOn(fsHelpers, 'exists').mockResolvedValue(true)

    vi.spyOn(fsHelpers, 'readJsonFile').mockResolvedValue({
      projectNameSanitized: 'my-app'
    })

    vi.spyOn(fsHelpers, 'ensureEmptyDir').mockResolvedValue(undefined)

    addServicePrompts.mockResolvedValue({
      serviceName: 'My Service',
      serviceDirectoryName: 'my-service-dir',
      isCrud: true,
      exposeApi: true
    })

    generateNewService.mockResolvedValue(undefined)

    const result = await addService({ dryRun: true })

    expectSuccess(result)
    expect(result.data.serviceName).toBe('My Service')

    expect(generateNewService).toHaveBeenCalledWith(
      'my-app',
      expect.objectContaining({
        serviceName: 'My Service',
        serviceDirectoryName: 'my-service-dir'
      }),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ dryRun: true })
    )
  })
  // ---------------------------
  // Project not initialized
  // ---------------------------
  it('KO : Should fail if project is not initialized', async () => {
    vi.spyOn(fsHelpers, 'exists').mockResolvedValue(false)

    const result = await addService()

    expectFailure(result, 'PROJECT_NOT_INITIALIZED')
  })

  // ---------------------------
  // Service config file provided
  // ---------------------------
  it('OK : Should load configFile instead of prompting', async () => {
    vi.spyOn(fsHelpers, 'exists')
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(true))

    vi.spyOn(fsHelpers, 'readJsonFile')
      .mockResolvedValueOnce({ projectNameSanitized: 'my-app' })
      .mockResolvedValueOnce({
        serviceName: 'ServiceFromFile',
        isCrud: false
      })
    vi.spyOn(fsHelpers, 'ensureEmptyDir').mockResolvedValue(undefined)

    generateNewService.mockResolvedValue(undefined)

    const result = await addService({ configFile: 'service.json', dryRun: true })

    expectSuccess(result)
    expect(result.data.serviceName).toBe('ServiceFromFile')
    expect(generateNewService).toHaveBeenCalled()
  })

  // ---------------------------
  // Invalid service config file
  // ---------------------------
  it('KO : Should fail on invalid service config', async () => {
    vi.spyOn(fsHelpers, 'exists')
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(true))
    vi.spyOn(fsHelpers, 'readJsonFile')
      .mockResolvedValueOnce({ projectNameSanitized: 'my-app' })
      .mockRejectedValueOnce(
        new AppError('Invalid JSON', {
          code: 'FS_INVALID_JSON'
        })
      )

    const result = await addService({ configFile: 'service.json' })

    expectFailure(result, 'INVALID_SERVICE_CONFIG')
  })
})
