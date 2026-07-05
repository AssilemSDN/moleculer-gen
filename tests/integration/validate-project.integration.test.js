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
const configPath = path.join(
  repoRoot,
  'examples/config/init-project/demo.json'
)

describe('validate command integration', () => {
  let tempDir

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, {
        recursive: true,
        force: true
      })
    }
  })

  it('OK : should validate a generated project', async () => {
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'moleculer-gen-')
    )

    const config = JSON.parse(
      await fs.readFile(configPath, 'utf8')
    )

    // Generate a real project through the CLI
    await execFileAsync(
      process.execPath,
      [cliPath, 'init', configPath],
      {
        cwd: tempDir
      }
    )

    const projectDir = path.join(
      tempDir,
      config.projectNameSanitized
    )

    // Sanity check: init actually generated the project config
    await expect(
      fs.access(
        path.join(projectDir, '.moleculer-gen/config.json')
      )
    ).resolves.toBeUndefined()

    // Run the real validate command from the generated project
    await expect(
      execFileAsync(
        process.execPath,
        [cliPath, 'validate'],
        {
          cwd: projectDir
        }
      )
    ).resolves.toBeDefined()
  })
  it('KO : should fail when .moleculer-gen is missing', async () => {
    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'moleculer-gen-')
    )

    const config = JSON.parse(
      await fs.readFile(configPath, 'utf8')
    )

    await execFileAsync(
      process.execPath,
      [cliPath, 'init', configPath],
      {
        cwd: tempDir
      }
    )

    const projectDir = path.join(
      tempDir,
      config.projectNameSanitized
    )

    await fs.rm(
      path.join(projectDir, '.moleculer-gen'),
      {
        recursive: true,
        force: true
      }
    )

    try {
      await execFileAsync(
        process.execPath,
        [cliPath, 'validate'],
        {
          cwd: projectDir
        }
      )

      throw new Error('Expected validate command to fail')
    } catch (error) {
      const output = `${error.stdout ?? ''}${error.stderr ?? ''}`

      expect(error.code).not.toBe(0)
      expect(output).toContain(
        '.moleculer-gen/config.json'
      )
    }
  })
})
