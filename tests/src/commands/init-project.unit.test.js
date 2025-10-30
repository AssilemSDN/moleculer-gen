/*
  PATH  /tests/src/commands/init-project.test.js
*/
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import { ApiGatewayModule } from '../../../dist/modules/backend-services/ApiGatewayModule.js'
import { logger } from '../../../src/utils/logger.js'
import * as fsHelpers from '../../../src/utils/fs-helpers.js'

// ---- Global mocks ----
vi.mock('../../../src/prompts/init-prompts.js', () => ({
  initPrompts: vi.fn()
}))

vi.mock('../../../src/generators/initProject/generate.js', () => ({
  generate: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('../../../dist/modules/databases/index.js', () => ({
  databases: { mongodb: () => ({ meta: { key: 'mongodb' }, docker: {}, env: {} }) }
}))

vi.mock('../../../dist/modules/transporters/index.js', () => ({
  transporters: { nats: () => ({ meta: { key: 'nats' }, docker: {}, env: {} }) }
}))

vi.mock('../../../dist/modules/plugins/index.js', () => ({
  plugins: {
    traefik: () => ({ meta: { key: 'traefik' }, docker: {}, env: {} }),
    prometheus: () => ({ meta: { key: 'prometheus' }, docker: {}, env: {} })
  }
}))

vi.mock('../../../dist/modules/backend-services/ApiGatewayModule.js', () => ({
  ApiGatewayModule: vi.fn(({ projectNameSanitized, needsTraefikLabels }) => ({
    meta: { key: `${projectNameSanitized}-api-gateway`, needsTraefikLabels },
    docker: {},
    env: {}
  }))
}))

vi.spyOn(logger, 'info').mockImplementation(() => {})

describe('initProject', () => {
  let cwdSpy, initPrompts, generate
  const fakeCwd = '/fake/cwd'

  beforeEach(async () => {
    vi.clearAllMocks()
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(fakeCwd)
    ;({ initPrompts } = await import('../../../src/prompts/init-prompts.js'))
    ;({ generate } = await import('../../../src/generators/initProject/generate.js'))

    vi.spyOn(fsHelpers, 'exists')
    vi.spyOn(fsHelpers, 'readFile')
  })

  afterEach(() => {
    cwdSpy.mockRestore()
    vi.restoreAllMocks()
  })

  const expectSuccess = result => {
    expect(result).toEqual(expect.objectContaining({ success: true }))
  }

  const expectFailure = result => {
    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  }

  // ================================
  // == INTERACTIVE MODE (PROMPTS) ==
  // ================================
  describe('interactive mode (via prompts)', () => {
    it('✅ should generate project with selected modules and dry run', async () => {
      initPrompts.mockResolvedValue({
        projectName: 'My Super Project YAY',
        projectNameSanitized: 'my-super-project-yay',
        database: 'mongodb',
        transporter: 'nats',
        plugins: ['traefik']
      })
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ dryRun: true })
      expectSuccess(result)

      const generateCall = generate.mock.calls[0][0]
      expect(generateCall.answers.projectNameSanitized).toBe('my-super-project-yay')
      expect(generateCall.modules.map(m => m.meta.key)).toEqual(
        expect.arrayContaining(['mongodb', 'nats', 'traefik', 'my-super-project-yay-api-gateway'])
      )
      expect(generateCall.templateDir).toContain('templates')
      expect(generateCall.projectDir).toBe(path.join(fakeCwd, 'my-super-project-yay'))
      expect(generateCall.options.dryRun).toBe(true)

      expect(ApiGatewayModule).toHaveBeenCalledWith(
        expect.objectContaining({ needsTraefikLabels: true })
      )
    })

    it('⚠️ should ignore unknown plugins', async () => {
      initPrompts.mockResolvedValue({
        projectName: 'Test Project',
        projectNameSanitized: 'test-project',
        database: 'mongodb',
        transporter: 'nats',
        plugins: ['unknown-plugin']
      })
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject()
      expectSuccess(result)

      const generateCall = generate.mock.calls[0][0]
      const keys = generateCall.modules.map(m => m.meta.key)
      expect(keys).toEqual(expect.arrayContaining(['mongodb', 'nats', 'test-project-api-gateway']))
      expect(keys).not.toContain('unknown-plugin')
    })

    it('✅ should handle multiple plugins correctly', async () => {
      initPrompts.mockResolvedValue({
        projectName: 'Multi Plugin',
        projectNameSanitized: 'multi-plugin',
        database: 'mongodb',
        transporter: 'nats',
        plugins: ['traefik', 'prometheus']
      })
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject()
      expectSuccess(result)

      const generateCall = generate.mock.calls[0][0]
      const keys = generateCall.modules.map(m => m.meta.key)
      expect(keys).toEqual(
        expect.arrayContaining(['mongodb', 'nats', 'traefik', 'prometheus', 'multi-plugin-api-gateway'])
      )
    })

    it('💥 should return a handled error when prompts fail', async () => {
      initPrompts.mockRejectedValue(new Error('Prompt failed'))
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ dryRun: true })
      expectFailure(result)
      expect(result.error.message).toBe('Prompt failed')
    })

    it('✅ should work when no plugin is selected', async () => {
      initPrompts.mockResolvedValue({
        projectName: 'Bare Project',
        projectNameSanitized: 'bare-project',
        database: 'mongodb',
        transporter: 'nats',
        plugins: []
      })
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject()
      expectSuccess(result)

      const generateCall = generate.mock.calls[0][0]
      const keys = generateCall.modules.map(m => m.meta.key)
      expect(keys).toEqual(expect.arrayContaining(['mongodb', 'nats', 'bare-project-api-gateway']))
      expect(ApiGatewayModule).toHaveBeenCalledWith(
        expect.objectContaining({ projectNameSanitized: 'bare-project', needsTraefikLabels: false })
      )
    })
  })

  // ========================================
  // == NON-INTERACTIVE MODE (CONFIG FILE) ==
  // ========================================
  describe('non-interactive mode (via configFile)', () => {
    it('✅ should load minimal config file correctly', async () => {
      fsHelpers.exists.mockResolvedValue(true)
      fsHelpers.readFile.mockResolvedValue(JSON.stringify({
        projectName: 'My Project',
        database: 'mongodb',
        transporter: 'nats'
      }))
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ configFile: 'test.json' })
      expectSuccess(result)
      expect(result.data.projectNameSanitized).toBe('my-project')
    })

    it('💥 should fail if config file does not exist', async () => {
      fsHelpers.exists.mockResolvedValue(false)
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ configFile: 'missing.json' })
      expectFailure(result)
      expect(result.error.message).toMatch(/Config file not found/)
    })

    it('💥 should fail if config file contains invalid JSON', async () => {
      fsHelpers.exists.mockResolvedValue(true)
      fsHelpers.readFile.mockResolvedValue('{ invalid json ')
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ configFile: 'invalid.json' })
      expectFailure(result)
      expect(result.error.message).toMatch(/Invalid JSON/)
    })

    it('💥 should fail if config file has an invalid database key', async () => {
      fsHelpers.exists.mockResolvedValue(true)
      fsHelpers.readFile.mockResolvedValue(JSON.stringify({
        projectName: 'Bad DB',
        database: 'unknown',
        transporter: 'nats'
      }))
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ configFile: 'bad-db.json' })
      expectFailure(result)
      expect(result.error.message).toMatch(/Invalid database key/)
    })

    it('✅ should load config file with plugins correctly', async () => {
      fsHelpers.exists.mockResolvedValue(true)
      fsHelpers.readFile.mockResolvedValue(JSON.stringify({
        projectName: 'super-app',
        projectNameSanitized: 'super-app',
        database: 'mongodb',
        transporter: 'nats',
        plugins: ['traefik']
      }))
      const { initProject } = await import('../../../src/commands/init-project.js')
      const result = await initProject({ configFile: 'plugins.json' })
      expectSuccess(result)

      const generateCall = generate.mock.calls[0][0]
      const keys = generateCall.modules.map(m => m.meta.key)
      expect(keys).toContain('traefik')
      expect(ApiGatewayModule).toHaveBeenCalledWith(
        expect.objectContaining({ needsTraefikLabels: true })
      )
    })
  })
})
