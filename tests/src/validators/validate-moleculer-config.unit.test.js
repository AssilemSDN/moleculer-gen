import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { validateMoleculerConfig } from '../../../src/validators/validate-moleculer-config.js'
import { writeFile } from '../../../src/utils/fs-helpers.js'

const writeJson = async (filePath, data) => {
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

const writeRaw = async (filePath, content) => {
  await writeFile(filePath, content)
}

describe('validateMoleculerConfig', () => {
  let tmpDir
  let configPath

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'moleculer-gen-config-'))
    configPath = path.join(tmpDir, '.moleculer-gen/config.json')
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('should validate a valid .moleculer-gen/config.json', async () => {
    const config = {
      projectName: 'My Project',
      projectNameSanitized: 'my-project',
      database: 'mongodb',
      transporter: 'nats',
      plugins: [],
      services: {}
    }

    await writeJson(configPath, config)

    const result = await validateMoleculerConfig(tmpDir)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
    expect(result.config).toEqual(config)
  })

  it('should throw CONFIG_NOT_FOUND when .moleculer-gen/config.json is missing', async () => {
    await expect(validateMoleculerConfig(tmpDir)).rejects.toMatchObject({
      name: 'AppError',
      code: 'CONFIG_NOT_FOUND'
    })
  })

  it('should throw FS_INVALID_JSON when .moleculer-gen/config.json is invalid JSON', async () => {
    await writeRaw(configPath, '{ invalid json')

    await expect(validateMoleculerConfig(tmpDir)).rejects.toMatchObject({
      name: 'AppError',
      code: 'FS_INVALID_JSON'
    })
  })

  it('should accumulate structure errors when config fields are invalid', async () => {
    await writeJson(configPath, {
      projectName: 123,
      projectNameSanitized: null,
      plugins: 'prometheus',
      services: null
    })

    const result = await validateMoleculerConfig(tmpDir)

    expect(result.valid).toBe(false)

    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Invalid .moleculer-gen/config.json: missing or invalid "projectName"',
        'Invalid .moleculer-gen/config.json: missing or invalid "projectNameSanitized"',
        'Invalid .moleculer-gen/config.json: missing or invalid "database"',
        'Invalid .moleculer-gen/config.json: missing or invalid "transporter"',
        'Invalid .moleculer-gen/config.json: "plugins" must be an array',
        'Invalid .moleculer-gen/config.json: "services" must be an object or an array'
      ])
    )

    expect(result.errors).toHaveLength(6)
  })

  it('should accept missing optional plugins and services', async () => {
    await writeJson(configPath, {
      projectName: 'My Project',
      projectNameSanitized: 'my-project',
      database: 'mongodb',
      transporter: 'nats'
    })

    const result = await validateMoleculerConfig(tmpDir)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('should reject config root when it is an array', async () => {
    await writeJson(configPath, [])

    await expect(validateMoleculerConfig(tmpDir)).rejects.toMatchObject({
      name: 'AppError',
      code: 'INVALID_CONFIG'
    })
  })
})
