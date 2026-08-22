import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fsHelpers from '../../../src/utils/fs-helpers.js'

import { addService } from '../../../src/commands/add-service.js'
import { addServicePrompts } from '../../../src/prompts/add-service-prompts.js'
import { AppError } from '../../../src/errors/AppError.js'

import { addNewServiceToProject } from '../../../src/generators/add-service/add-new-service-to-project.js'

vi.mock('../../../src/prompts/add-service-prompts.js', () => ({
  addServicePrompts: vi.fn()
}))

vi.mock('../../../src/generators/add-service/add-new-service-to-project.js', () => ({
  addNewServiceToProject: vi.fn()
}))

// --- Tests ---
describe('addService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  const expectSuccess = result => {
    expect(result).toEqual(expect.objectContaining({ success: true }))
  }

  const expectFailure = (result, code) => {
    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)

    if (code) {
      expect(result.error.code).toBe(code)
    }
  }

  describe('OK cases', () => {
    // ---------------------------
    // Happy path via prompts
    // ---------------------------
    it('OK : Should add a service via prompts', async () => {
      vi.spyOn(fsHelpers, 'exists').mockResolvedValue(true)

      vi.spyOn(fsHelpers, 'readJsonFile').mockResolvedValue({
        projectNameSanitized: 'my-app',
        services: {}
      })

      addServicePrompts.mockResolvedValue({
        serviceName: 'My Service',
        serviceDirectoryName: 'my-service-dir',
        isCrud: true,
        exposeApi: true
      })

      addNewServiceToProject.mockResolvedValue(undefined)

      const result = await addService({ dryRun: true })

      expectSuccess(result)
      expect(result.data.serviceName).toBe('My Service')

      expect(addNewServiceToProject).toHaveBeenCalledWith(
        expect.objectContaining({
          projectNameSanitized: 'my-app',
          serviceConfig: expect.objectContaining({
            serviceName: 'My Service',
            serviceDirectoryName: 'my-service-dir'
          }),
          templateDir: expect.any(String),
          projectDir: expect.any(String),
          dryRun: true
        })
      )
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

      addNewServiceToProject.mockResolvedValue(undefined)

      const result = await addService({ configFile: 'service.json', dryRun: true })

      expectSuccess(result)
      expect(result.data.serviceName).toBe('ServiceFromFile')
      expect(addNewServiceToProject).toHaveBeenCalled()
    })
  })

  describe('KO cases', () => {
    // ---------------------------
    // Project not initialized
    // ---------------------------
    it('KO : Should fail if project is not initialized', async () => {
      vi.spyOn(fsHelpers, 'exists').mockResolvedValue(false)

      const result = await addService()

      expectFailure(result, 'PROJECT_NOT_INITIALIZED')
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
})
