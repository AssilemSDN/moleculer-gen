import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fsHelpers from '../../../src/utils/fs-helpers.js'
import * as commonHelpers from '../../../src/utils/common-helpers.js'

import { addService } from '../../../src/commands/add-service.js'
import { addServicePrompts } from '../../../src/prompts/add-service-prompts.js'
import { generateNewService } from '../../../src/generators/add/generate-new-service.js'

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

  it('✅ should add a service via prompts', async () => {
    vi.spyOn(fsHelpers, 'exists').mockResolvedValue(true)
    vi.spyOn(fsHelpers, 'readFile').mockResolvedValue(JSON.stringify({ projectNameSanitized: 'my-app' }))
    vi.spyOn(fsHelpers, 'ensureEmptyDir').mockResolvedValue(undefined)
    vi.spyOn(commonHelpers, 'generateDefaultNames').mockReturnValue({
      serviceFileName: 'my-service',
      serviceDirectoryName: 'my-service-dir',
      modelFileName: 'my-model.js',
      modelName: 'MyModel',
      modelVariableName: 'myModel',
      collectionName: 'my_models',
      schemaName: 'MySchema'
    })

    addServicePrompts.mockResolvedValue({
      serviceName: 'My Service',
      isCrud: true,
      exposeApi: true
    })

    generateNewService.mockResolvedValue(undefined)

    const result = await addService({ dryRun: true })

    expectSuccess(result)
    expect(result.data.serviceName).toBe('My Service')
    expect(generateNewService).toHaveBeenCalledWith(
      'my-app',
      expect.objectContaining({ serviceName: 'My Service' }),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ dryRun: true })
    )
  })

  it('💥 should fail if project is not initialized', async () => {
    vi.spyOn(fsHelpers, 'exists').mockResolvedValue(false)

    const result = await addService()

    expectFailure(result, 'PROJECT_NOT_INITIALIZED')
  })

  it('✅ should load configFile instead of prompting', async () => {
    vi.spyOn(fsHelpers, 'exists')
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(true))

    vi.spyOn(fsHelpers, 'readFile')
      .mockImplementationOnce(() => Promise.resolve(JSON.stringify({ projectNameSanitized: 'my-app' })))
      .mockImplementationOnce(() => Promise.resolve(JSON.stringify({ serviceName: 'ServiceFromFile', isCrud: false })))

    vi.spyOn(fsHelpers, 'ensureEmptyDir').mockResolvedValue(undefined)
    vi.spyOn(commonHelpers, 'generateDefaultNames').mockReturnValue({
      serviceFileName: 'service-from-file',
      serviceDirectoryName: 'service-from-file-dir'
    })

    generateNewService.mockResolvedValue(undefined)

    const result = await addService({ configFile: 'service.json', dryRun: true })

    expectSuccess(result)
    expect(result.data.serviceName).toBe('ServiceFromFile')
    expect(generateNewService).toHaveBeenCalled()
  })

  it('💥 should fail on invalid service config', async () => {
    vi.spyOn(fsHelpers, 'exists')
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(true))

    vi.spyOn(fsHelpers, 'readFile')
      .mockImplementationOnce(() => Promise.resolve(JSON.stringify({ projectNameSanitized: 'my-app' })))
      .mockImplementationOnce(() => Promise.resolve('{ invalid json }'))

    const result = await addService({ configFile: 'service.json' })

    expectFailure(result, 'INVALID_SERVICE_CONFIG')
  })
})
