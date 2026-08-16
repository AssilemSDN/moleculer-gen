/*
  PATH  /tests/src/commands/init-project.test.js
*/
import path from 'path'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import { initProject } from '../../../src/commands/init-project.js'
import { initPrompts } from '../../../src/prompts/init-prompts.js'
import { generate } from '../../../src/generators/init-project/generate.js'

import { ApiGatewayModule } from '../../../dist/modules/backend-services/ApiGatewayModule.js'

import { createInitAnswers } from '../../helpers/config-factories.js'

import {
  expectCommandFailure,
  expectCommandSuccess,
  getGenerateCall,
  getGeneratedModuleKeys
} from './init-project-common.js'

vi.mock('../../../src/prompts/init-prompts.js', () => ({
  initPrompts: vi.fn()
}))

vi.mock(
  '../../../src/generators/init-project/generate.js',
  () => ({
    generate: vi.fn()
  })
)

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

describe('initProject - interactive', () => {
  const fakeCwd = '/fake/cwd'

  beforeEach(() => {
    vi.clearAllMocks()
    vi
      .spyOn(process, 'cwd')
      .mockReturnValue(fakeCwd)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const runInteractive = async (
    config,
    options = {}
  ) => {
    initPrompts.mockResolvedValue(config)
    return initProject(options)
  }

  const pluginCases = [
    {
      name: 'without plugins',
      plugins: [],
      expectedPlugins: [],
      excludedPlugins: [],
      needsTraefikLabels: false
    },
    {
      name: 'with unknown plugin',
      plugins: ['unknown-plugin'],
      expectedPlugins: [],
      excludedPlugins: ['unknown-plugin'],
      needsTraefikLabels: false
    },
    {
      name: 'with multiple plugins',
      plugins: [
        'traefik',
        'prometheus'
      ],
      expectedPlugins: [
        'traefik',
        'prometheus'
      ],
      excludedPlugins: [],
      needsTraefikLabels: true
    }
  ]

  it('OK : should generate project with selected modules and dry run', async () => {
    const answers = createInitAnswers({
      projectName: 'My Super Project YAY',
      plugins: ['traefik']
    })
    const result = await runInteractive(answers, { dryRun: true })
    expectCommandSuccess(result)

    const generateCall = getGenerateCall(generate)
    expect(generateCall.answers.projectNameSanitized).toBe('my-super-project-yay')
    expect(getGeneratedModuleKeys(generate)).toEqual(
      expect.arrayContaining([
        'mongodb',
        'nats',
        'traefik',
        'my-super-project-yay-api-gateway'
      ])
    )
    expect(generateCall.templateDir).toContain('templates')
    expect(generateCall.projectDir).toBe(path.join(fakeCwd, 'my-super-project-yay'))
    expect(generateCall.dryRun).toBe(true)
    expect(ApiGatewayModule).toHaveBeenCalledWith(
      expect.objectContaining({
        needsTraefikLabels: true
      })
    )
  })

  it.each(pluginCases)('OK : should initialize project $name', async (
    {
      plugins,
      expectedPlugins,
      excludedPlugins,
      needsTraefikLabels
    }) => {
    const answers = createInitAnswers({
      plugins
    })

    const result = await runInteractive(answers)
    expectCommandSuccess(result)

    const moduleKeys = getGeneratedModuleKeys(generate)
    expect(moduleKeys).toEqual(
      expect.arrayContaining([
        'mongodb',
        'nats',
        'project-api-gateway',
        ...expectedPlugins
      ])
    )

    for (const plugin of excludedPlugins) {
      expect(moduleKeys).not.toContain(plugin)
    }

    expect(ApiGatewayModule).toHaveBeenCalledWith(
      expect.objectContaining({
        needsTraefikLabels
      })
    )
  }
  )

  it('KO : should return handled error when prompts fail', async () => {
    initPrompts.mockRejectedValue(
      new Error('Prompt failed')
    )

    const result = await initProject({
      dryRun: true
    })

    const error =
        expectCommandFailure(result)

    expect(error.message).toBe(
      'Prompt failed'
    )

    expect(generate).not.toHaveBeenCalled()
  })
})
