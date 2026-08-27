import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  createCommandResult,
  addPlannedChange,
  addCheck,
  addWarning,
  addError,
  addNextStep
} from '../../../src/utils/command-result.js'

describe('commandResult', () => {
  it('OK : Should create an empty successful result', () => {
    expect(createCommandResult({ dryRun: true })).toEqual({
      success: true,
      dryRun: true,
      plannedChanges: [],
      checks: [],
      warnings: [],
      errors: [],
      nextSteps: [],
      data: {}
    })
  })

  it('OK : Should append result entries', () => {
    const result = createCommandResult()
    addCheck(result, 'check')
    addWarning(result, 'warning')
    addError(result, 'error')
    addNextStep(result, 'next')
    expect(result).toEqual(expect.objectContaining({
      checks: ['check'],
      warnings: ['warning'],
      errors: ['error'],
      nextSteps: ['next']
    }))
  })

  it('OK : Should add planned changes with project-relative paths', () => {
    const result = createCommandResult()
    const projectDir = path.resolve('project')
    addPlannedChange(result, {
      type: 'create',
      target: 'README.md'
    })
    addPlannedChange(result, {
      type: 'create',
      target: path.join(projectDir, 'src', 'service.js')
    }, { projectDir })
    expect(result.plannedChanges).toEqual([
      { type: 'create', target: 'README.md' },
      { type: 'create', target: 'src/service.js' }
    ])
  })
})
