/*
  PATH  /tests/src/commands/init-project.unit.test.js
*/
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import { initProject } from '../../../src/commands/init-project.js'
import { logger } from '../../../src/utils/logger.js'
import { ApiGatewayModule } from '../../../dist/modules/backend-services/ApiGatewayModule.js'

// ---- Mocks ----
vi.mock('../../../src/prompts/init-prompts.js', () => ({
  initPrompts: vi.fn()
}))
vi.mock('../../../src/generators/initProject/generate.js', () => ({
  generate: vi.fn().mockResolvedValue(undefined)
}))

vi.spyOn(logger, 'info').mockImplementation(() => {})

// ---- Modules mocks ----
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

// ---- tests initProject ----
describe('initProject (unit test)', () => {
  let cwdSpy, initPrompts, generate
  const fakeCwd = '/fake/cwd'

  beforeEach(async () => {
    vi.clearAllMocks()
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(fakeCwd)
    ;({ initPrompts } = await import('../../../src/prompts/init-prompts.js'))
    ;({ generate } = await import('../../../src/generators/initProject/generate.js'))
  })

  afterEach(() => cwdSpy.mockRestore())

  const expectSuccess = result => {
    expect(result).toEqual(
      expect.objectContaining({
        success: true
      })
    )
  }

  const expectFailure = result => {
    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  }
  // ---- test 1 ----
  it('✅ should generate project with selected modules and dry run', async () => {
    initPrompts.mockResolvedValue({
      projectName: 'My Super Project YAY',
      projectNameSanitized: 'my-super-project-yay',
      database: 'mongodb',
      transporter: 'nats',
      plugins: ['traefik']
    })

    const result = await initProject({ dryRun: true })
    expectSuccess(result)

    const [answers, , modules, templateDir, projectDir, opts] = generate.mock.calls[0]
    expect(answers.projectNameSanitized).toBe('my-super-project-yay')
    expect(modules.map(m => m.meta.key)).toEqual(
      expect.arrayContaining(['mongodb', 'nats', 'traefik', 'my-super-project-yay-api-gateway'])
    )
    expect(templateDir).toContain('templates')
    expect(projectDir).toBe(path.join(fakeCwd, 'my-super-project-yay'))
    expect(opts.dryRun).toBe(true)
    expect(ApiGatewayModule).toHaveBeenCalledWith(
      expect.objectContaining({ needsTraefikLabels: true })
    )
  })
  // ---- test 2 ----
  it('⚠️ should ignore unknown plugins', async () => {
    initPrompts.mockResolvedValue({
      projectName: 'Test Project',
      projectNameSanitized: 'test-project',
      database: 'mongodb',
      transporter: 'nats',
      plugins: ['unknown-plugin']
    })

    const result = await initProject()
    expectSuccess(result)

    const keys = generate.mock.calls[0][2].map(m => m.meta.key)
    expect(keys).toEqual(expect.arrayContaining(['mongodb', 'nats', 'test-project-api-gateway']))
    expect(keys).not.toContain('unknown-plugin')
  })
  // ---- test 3 ----
  it('✅ should handle multiple plugins correctly', async () => {
    initPrompts.mockResolvedValue({
      projectName: 'Multi Plugin',
      projectNameSanitized: 'multi-plugin',
      database: 'mongodb',
      transporter: 'nats',
      plugins: ['traefik', 'prometheus']
    })

    const result = await initProject()
    expectSuccess(result)

    const keys = generate.mock.calls[0][2].map(m => m.meta.key)
    expect(keys).toEqual(
      expect.arrayContaining(['mongodb', 'nats', 'traefik', 'prometheus', 'multi-plugin-api-gateway'])
    )
  })
  // ---- test 4 ----
  it('💥 should return safe error when prompts fail', async () => {
    initPrompts.mockRejectedValue(new Error('Prompt failed'))
    const result = await initProject({ dryRun: true })
    expectFailure(result)
    expect(result.error.message).toBe('Prompt failed')
  })
  // ---- test 5 ----
  it('✅ should work when no plugin selected', async () => {
    initPrompts.mockResolvedValue({
      projectName: 'Bare Project',
      projectNameSanitized: 'bare-project',
      database: 'mongodb',
      transporter: 'nats',
      plugins: []
    })

    const result = await initProject()
    expectSuccess(result)

    const keys = generate.mock.calls[0][2].map(m => m.meta.key)
    expect(keys).toEqual(
      expect.arrayContaining(['mongodb', 'nats', 'bare-project-api-gateway'])
    )
    expect(ApiGatewayModule).toHaveBeenCalledWith(
      expect.objectContaining({ projectNameSanitized: 'bare-project', needsTraefikLabels: false })
    )
  })
})
