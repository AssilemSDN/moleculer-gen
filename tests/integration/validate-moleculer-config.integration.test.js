/*
  PATH /tests/integration/validate-moleculer-config.integration.test.js
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
  validateMoleculerConfig
} from '../../src/validators/validate-project/validate-moleculer-config.js'

const validConfig = {
  projectName: 'Test project',
  projectNameSanitized: 'test-project',
  database: 'mongodb',
  transporter: 'nats',
  plugins: [],
  services: {
    api: {
      serviceName: 'api',
      serviceDirectoryName: 'api',
      serviceFileName: 'api.service.js',
      isCrud: false,
      exposeApi: false
    }
  }
}

describe('validateMoleculerConfig', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'moleculer-gen-')
    )
  })

  afterEach(async () => {
    await fs.rm(tmpDir, {
      recursive: true,
      force: true
    })
  })

  const writeConfig = async config => {
    const configPath = path.join(
      tmpDir,
      '.moleculer-gen',
      'config.json'
    )

    await fs.mkdir(
      path.dirname(configPath),
      { recursive: true }
    )

    await fs.writeFile(
      configPath,
      JSON.stringify(config),
      'utf8'
    )
  }

  // Everything is valid, validation should pass
  it('should validate a valid Moleculer configuration', async () => {
    await writeConfig(validConfig)

    const result = await validateMoleculerConfig(tmpDir)

    expect(result.valid).toBe(true)
    expect(result.canContinue).toBe(true)
    expect(result.errors).toEqual([])
  })

  // Configuration file is required for validation
  it('should throw when the configuration file is missing', async () => {
    await expect(
      validateMoleculerConfig(tmpDir)
    ).rejects.toMatchObject({
      name: 'AppError',
      code: 'PROJECT_CONFIG_NOT_FOUND'
    })
  })

  // Invalid configuration should be reported, but validation should continue for valid entries
  it('should continue with valid entries when one service is invalid', async () => {
    await writeConfig({
      ...validConfig,
      services: {
        api: validConfig.services.api,
        brokenService: {
          serviceDirectoryName: 'broken',
          serviceFileName: 'broken.service.js',
          isCrud: false
        }
      }
    })

    const result = await validateMoleculerConfig(tmpDir)

    expect(result.valid).toBe(false)
    expect(result.canContinue).toBe(true)

    expect(result.errors).toContain(
      'Invalid .moleculer-gen/config.json: missing or invalid "services.brokenService.serviceName"'
    )

    expect(result.validatedConfig.services).toEqual({
      api: validConfig.services.api
    })
  })
})
