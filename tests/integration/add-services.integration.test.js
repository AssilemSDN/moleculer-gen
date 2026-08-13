/*
  PATH /tests/integration/add-services.integration.test.js
*/
import { afterEach, describe, expect, it } from 'vitest'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, '../..')
const cliPath = path.join(repoRoot, 'bin/cli.js')

const initConfigPath = path.join(
  repoRoot,
  'examples/config/init-project/demo.json'
)

const addServicesConfigPath = path.join(
  repoRoot,
  'examples/config/add-services/demo.json'
)

describe('add-services command integration', () => {
  let tempDir

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, {
        recursive: true,
        force: true
      })
    }
  })

  it('OK : should add multiple services from config and skip them when already existing', async () => {
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'moleculer-gen-')
    )

    const initConfig = JSON.parse(
      await fs.readFile(initConfigPath, 'utf8')
    )

    await execFileAsync(
      process.execPath,
      [cliPath, 'init', initConfigPath],
      {
        cwd: tempDir
      }
    )

    const projectDir = path.join(
      tempDir,
      initConfig.projectNameSanitized
    )

    await execFileAsync(
      process.execPath,
      [cliPath, 'add-services', addServicesConfigPath],
      {
        cwd: projectDir
      }
    )

    await expect(
      fs.access(path.join(projectDir, 'src/services/articles'))
    ).resolves.toBeUndefined()

    await expect(
      fs.access(path.join(projectDir, 'src/services/categories'))
    ).resolves.toBeUndefined()

    await expect(
      fs.access(path.join(projectDir, 'docker/services/articles.yaml'))
    ).resolves.toBeUndefined()

    await expect(
      fs.access(path.join(projectDir, 'docker/services/categories.yaml'))
    ).resolves.toBeUndefined()

    await expect(
      fs.access(path.join(projectDir, 'src/data/model/article.model.js'))
    ).resolves.toBeUndefined()

    await expect(
      fs.access(path.join(projectDir, 'src/data/model/category.model.js'))
    ).resolves.toBeUndefined()

    const secondRun = await execFileAsync(
      process.execPath,
      [cliPath, 'add-services', addServicesConfigPath],
      {
        cwd: projectDir
      }
    )

    const output = `${secondRun.stdout ?? ''}${secondRun.stderr ?? ''}`

    expect(output).toContain(
      'Service "articles" already exists, skipping'
    )

    expect(output).toContain(
      'Service "categories" already exists, skipping'
    )

    expect(output).toContain(
      'No service was added. All services were skipped.'
    )

    expect(output).toContain(
      'completed with warnings'
    )
  })

  it('KO : should reject path traversal in serviceFileName', async () => {
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'moleculer-gen-')
    )

    const initConfig = JSON.parse(
      await fs.readFile(initConfigPath, 'utf8')
    )

    await execFileAsync(
      process.execPath,
      [cliPath, 'init', initConfigPath],
      {
        cwd: tempDir
      }
    )

    const projectDir = path.join(
      tempDir,
      initConfig.projectNameSanitized
    )

    const maliciousConfigPath = path.join(
      tempDir,
      'malicious-add-services.json'
    )

    const maliciousConfig = [
      {
        serviceName: 'users',
        serviceDirectoryName: 'users',
        serviceFileName: '../../../users.service.js',
        isCrud: false,
        exposeApi: false
      }
    ]

    await fs.writeFile(
      maliciousConfigPath,
      JSON.stringify(maliciousConfig, null, 2)
    )

    await expect(
      execFileAsync(
        process.execPath,
        [cliPath, 'add-services', maliciousConfigPath],
        {
          cwd: projectDir
        }
      )
    ).rejects.toBeDefined()

    const escapedFilePath = path.resolve(
      projectDir,
      'src',
      'services',
      'users',
      '../../../users.service.js'
    )

    await expect(
      fs.access(escapedFilePath)
    ).rejects.toThrow()
  })
})
