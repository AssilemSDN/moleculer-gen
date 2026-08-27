import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import { runCommand } from '../../../src/utils/command-runner.js'
import {
  renderCommandResult,
  renderUnexpectedError
} from '../../../src/cli/renderer/render-command-result.js'

vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    debug: vi.fn()
  }
}))

vi.mock('../../../src/cli/renderer/render-command-result.js', () => ({
  renderCommandResult: vi.fn(),
  renderUnexpectedError: vi.fn()
}))

describe('runCommand', () => {
  let previousExitCode

  beforeEach(() => {
    previousExitCode = process.exitCode
    process.exitCode = undefined
    vi.resetAllMocks()
  })

  afterEach(() => {
    process.exitCode = previousExitCode
  })

  it('OK : Should execute and render successful command', async () => {
    const result = { success: true }
    const commandFn = vi.fn().mockResolvedValue(result)
    const options = { dryRun: true }
    await runCommand('init', commandFn, options, {
      successMessage: 'Project created'
    })
    expect(commandFn).toHaveBeenCalledWith(options)
    expect(renderCommandResult).toHaveBeenCalledWith({
      commandName: 'init',
      result,
      successMessage: 'Project created'
    })
    expect(process.exitCode).toBeUndefined()
  })

  it('KO : Should use command failure exit code', async () => {
    const commandFn = vi.fn().mockResolvedValue({
      success: false,
      exitCode: 1
    })
    await runCommand('validate', commandFn)
    expect(process.exitCode).toBe(1)
  })

  it('KO : Should default command failure exit code to 1', async () => {
    const commandFn = vi.fn().mockResolvedValue({
      success: false
    })
    await runCommand('validate', commandFn)
    expect(process.exitCode).toBe(1)
  })

  it('KO : Should render unexpected error and exit with code 2', async () => {
    const error = new Error('unexpected error !')
    const commandFn = vi.fn().mockRejectedValue(error)
    await runCommand('init', commandFn)
    expect(renderUnexpectedError).toHaveBeenCalledWith(
      'init',
      error
    )
    expect(process.exitCode).toBe(2)
  })
})
