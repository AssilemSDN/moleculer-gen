/*
  PATH /tests/integration/init-project-validation.integration.test.js
*/

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest'

import fs from 'fs/promises'
import os from 'os'
import path from 'path'

import {
  initProject
} from '../../src/commands/init-project.js'

import {
  validateProject
} from '../../src/commands/validate-project.js'

describe('init project validation', () => {
  let tmpDir
  let originalCwd

  beforeEach(async () => {
    originalCwd = process.cwd()

    tmpDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'moleculer-gen-')
    )

    process.chdir(tmpDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)

    await fs.rm(tmpDir, {
      recursive: true,
      force: true
    })
  })

  it('should generate a valid project', async () => {
    const projectName = 'test-project'

    const configPath = path.join(
      tmpDir,
      'config.json'
    )

    await fs.writeFile(
      configPath,
      JSON.stringify({
        projectName,
        projectNameSanitized: projectName,
        database: 'mongodb',
        transporter: 'nats',
        plugins: []
      }),
      'utf8'
    )

    const initResult = await initProject({
      configFile: configPath
    })

    expect(initResult.success).toBe(true)

    process.chdir(
      path.join(tmpDir, projectName)
    )

    const validationResult = await validateProject()

    expect(validationResult.success).toBe(true)
    expect(validationResult.data.valid).toBe(true)
    expect(validationResult.data.nbErrors).toBe(0)
  })
})
