/*
  PATH  /tests/src/commands/init-project-config.test.js
*/
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initProject } from '../../../src/commands/init-project.js'
import { generate } from '../../../src/generators/init-project/generate.js'
import { AppError } from '../../../src/errors/AppError.js'

import * as fsHelpers from '../../../src/utils/fs-helpers.js'

import { ApiGatewayModule } from '../../../dist/modules/backend-services/ApiGatewayModule.js'

import { createInitConfig } from '../../helpers/config-factories.js'

import {
  expectCommandFailure,
  expectCommandSuccess,
  getGeneratedModuleKeys
} from './init-project-common.js'
import { ErrorCodes } from '../../../src/errors/error-codes.js'

vi.mock(
  '../../../src/generators/init-project/generate.js',
  () => ({
    generate: vi.fn()
  })
)

vi.mock('../../../src/utils/fs-helpers.js', () => ({
  exists: vi.fn(),
  readJsonFile: vi.fn()
}))

vi.mock('../../../dist/modules/registry.js', async () => {
  const {
    createModulesRegistry
  } = await import('./init-project-common.js')

  return {
    modulesRegistry: createModulesRegistry()
  }
})

vi.mock('../../../dist/modules/backend-services/ApiGatewayModule.js', async () => {
  const {
    createApiGatewayModule
  } = await import('./init-project-common.js')

  return {
    ApiGatewayModule: vi.fn(createApiGatewayModule)
  }
})

describe('initProject - config file', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const runWithConfig = async (config, filename = 'config.json') => {
    fsHelpers.exists.mockResolvedValue(true)
    fsHelpers.readJsonFile.mockResolvedValue(config)
    return initProject({
      configFile: filename
    })
  }

  const validConfigCases = [
    {
      name: 'minimal config',
      config: {
        projectName: 'My Project',
        database: 'mongodb',
        transporter: 'nats'
      },
      expectedProjectName: 'my-project',
      expectedPlugins: [],
      needsTraefikLabels: false
    },
    {
      name: 'config with plugins',
      config: createInitConfig({
        projectName: 'Super App',
        projectNameSanitized: 'super-app',
        plugins: ['traefik']
      }),
      expectedProjectName: 'super-app',
      expectedPlugins: ['traefik'],
      needsTraefikLabels: true
    }
  ]

  it.each(validConfigCases)('OK : should load $name', async ({
    config,
    expectedProjectName,
    expectedPlugins,
    needsTraefikLabels
  }) => {
    const result = await runWithConfig(config)

    const data = expectCommandSuccess(result)

    expect(data.projectNameSanitized).toBe(expectedProjectName)
    expect(data.plugins).toEqual(config.plugins ?? [])
    expect(getGeneratedModuleKeys(generate)).toEqual(
      expect.arrayContaining([
        'mongodb',
        'nats',
          `${expectedProjectName}-api-gateway`,
          ...expectedPlugins
      ])
    )

    expect(ApiGatewayModule).toHaveBeenCalledWith(
      expect.objectContaining({
        needsTraefikLabels
      })
    )
  })

  const invalidConfigCases = [
    {
      name: 'config file does not exist',
      exists: false,
      expectedError: 'Init config file not found',
      expectedCode: ErrorCodes.CONFIG_NOT_FOUND
    },
    {
      name: 'config file contains invalid JSON',
      exists: true,
      readError: new AppError(
        'Invalid JSON',
        {
          code: ErrorCodes.INVALID_JSON
        }
      ),
      expectedError: 'Invalid JSON',
      expectedCode: ErrorCodes.INVALID_JSON
    },
    {
      name: 'config has invalid database key',
      exists: true,
      config: createInitConfig({
        database: 'unknown'
      }),
      expectedError: 'Invalid database key',
      expectedCode: ErrorCodes.INVALID_CONFIG
    }
  ]

  it.each(invalidConfigCases)('KO : should fail when $name', async ({
    exists,
    config,
    readError,
    expectedError,
    expectedCode
  }) => {
    fsHelpers.exists.mockResolvedValue(exists)

    if (readError) {
      fsHelpers.readJsonFile.mockRejectedValue(readError)
    } else if (config) {
      fsHelpers.readJsonFile.mockResolvedValue(config)
    }

    const result = await initProject({
      configFile: 'config.json'
    })

    const error = expectCommandFailure(result, expectedCode)

    expect(error.message).toContain(expectedError)
    expect(generate).not.toHaveBeenCalled()
  })
})
