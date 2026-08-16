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

vi.mock('../../../dist/modules/registry.js', () => ({
  modulesRegistry: {
    database: {
      mongodb: {
        factory: () => ({
          meta: { key: 'mongodb' },
          docker: {},
          env: {}
        }),
        meta: {
          key: 'mongodb',
          name: 'MongoDB',
          description: '',
          category: 'database',
          enabledByDefault: true
        }
      }
    },

    transporter: {
      nats: {
        factory: () => ({
          meta: { key: 'nats' },
          docker: {},
          env: {}
        }),
        meta: {
          key: 'nats',
          name: 'NATS',
          description: '',
          category: 'transporter',
          enabledByDefault: true
        }
      }
    },

    plugin: {
      traefik: {
        factory: () => ({
          meta: { key: 'traefik' },
          docker: {},
          env: {}
        }),
        meta: {
          key: 'traefik',
          name: 'Traefik',
          description: '',
          category: 'plugin',
          enabledByDefault: false
        }
      },

      prometheus: {
        factory: () => ({
          meta: { key: 'prometheus' },
          docker: {},
          env: {}
        }),
        meta: {
          key: 'prometheus',
          name: 'Prometheus',
          description: '',
          category: 'plugin',
          enabledByDefault: false
        }
      }
    }
  }
}))

vi.mock(
  '../../../dist/modules/backend-services/ApiGatewayModule.js',
  () => ({
    ApiGatewayModule: vi.fn(({
      projectNameSanitized,
      needsTraefikLabels
    }) => ({
      meta: {
        key: `${projectNameSanitized}-api-gateway`,
        needsTraefikLabels
      },
      docker: {},
      env: {}
    }))
  })
)

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
      expectedError: 'Config file not found'
    },
    {
      name: 'config file contains invalid JSON',
      exists: true,
      readError: new AppError(
        'Invalid JSON',
        {
          code: 'FS_INVALID_JSON'
        }
      ),
      expectedError: 'Invalid JSON'
    },
    {
      name: 'config has invalid database key',
      exists: true,
      config: createInitConfig({
        database: 'unknown'
      }),
      expectedError: 'Invalid database key'
    }
  ]

  it.each(invalidConfigCases)('KO : should fail when $name', async ({
    exists,
    config,
    readError,
    expectedError
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

    const error = expectCommandFailure(result)

    expect(error.message).toContain(expectedError)
    expect(generate).not.toHaveBeenCalled()
  })
})
