import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { validateRequiredDynamicFiles } from '../../../src/validators/validate-project/validate-required-dynamic-files.js'

const writeFile = async (filePath, content = '') => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
}

describe('validateRequiredDynamicFiles', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'moleculer-gen-'))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('should validate generated service, database, and transporter files', async () => {
    const config = {
      database: 'mongodb',
      transporter: 'nats',
      services: {
        api: {
          serviceDirectoryName: 'api',
          serviceFileName: 'api.service.js',
          isCrud: false
        }
      }
    }

    await writeFile(path.join(tmpDir, 'src/config/modules/database.config.js'))
    await writeFile(path.join(tmpDir, 'src/mixins/db.mixin.js'))
    await writeFile(path.join(tmpDir, 'src/config/modules/transporter.config.js'))
    await writeFile(path.join(tmpDir, 'src/services/api/api.service.js'))

    const result = await validateRequiredDynamicFiles(tmpDir, config)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })

  it('should return an error when a required generated file is missing', async () => {
    const config = {
      database: 'mongodb',
      transporter: 'nats',
      services: {
        api: {
          serviceDirectoryName: 'api',
          serviceFileName: 'api.service.js',
          isCrud: false
        }
      }
    }

    const result = await validateRequiredDynamicFiles(tmpDir, config)

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Path is missing or has the wrong type : file: src/config/modules/database.config.js',
        'Path is missing or has the wrong type : file: src/config/modules/transporter.config.js',
        'Path is missing or has the wrong type : directory: src/services/api',
        'Path is missing or has the wrong type : file: src/services/api/api.service.js'
      ])
    )
  })

  it('should reject paths outside the project when service names include traversal segments', async () => {
    const config = {
      database: 'mongodb',
      transporter: 'nats',
      services: {
        api: {
          serviceDirectoryName: '../evil',
          serviceFileName: 'api.service.js',
          isCrud: false
        }
      }
    }

    const result = await validateRequiredDynamicFiles(tmpDir, config)

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Path is outside the project: src/services/../evil'
      ])
    )
    expect(result.errors).not.toEqual(
      expect.arrayContaining([
        'Path is missing or has the wrong type : file: src/config/modules/database.config.js'
      ])
    )
  })
})
