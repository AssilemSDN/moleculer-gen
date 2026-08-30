import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import {
  getCliFailure,
  runCli
} from '../helpers/cli.js'
import {
  createGeneratedProject,
  removeTempDir
} from '../helpers/temp-project.js'
import { repoRoot } from '../helpers/paths.js'

const configPath = path.join(
  repoRoot,
  'examples/config/init-project/minimal.json'
)

describe('validate command integration', { timeout: 30_000 }, () => {
  let tempDir

  afterEach(async () => {
    await removeTempDir(tempDir)
    tempDir = undefined
  })

  const setupProject = async () => {
    const generatedProject = await createGeneratedProject(
      configPath
    )
    tempDir = generatedProject.tempDir
    return generatedProject
  }

  const runValidate = projectDir => {
    return runCli(
      ['validate'],
      { cwd: projectDir }
    )
  }

  const getGeneratorConfigPath = projectDir => {
    return path.join(
      projectDir,
      '.moleculer-gen/config.json'
    )
  }

  const getGeneratorDirectoryPath = projectDir => {
    return path.join(
      projectDir,
      '.moleculer-gen'
    )
  }

  it('OK : should validate a generated project', async () => {
    const { projectDir } = await setupProject()

    const packageJson = JSON.parse(
      await fs.readFile(
        path.join(projectDir, 'package.json'),
        'utf8'
      )
    )

    const yarnLock = await fs.readFile(
      path.join(projectDir, 'yarn.lock'),
      'utf8'
    )

    expect(yarnLock).toContain(
      `"${packageJson.name}@workspace:.":`
    )
    await expect(
      fs.access(
        getGeneratorConfigPath(projectDir)
      )
    ).resolves.toBeUndefined()

    await expect(
      runValidate(projectDir)
    ).resolves.toBeDefined()
  })

  it('KO : should fail when .moleculer-gen is missing', async () => {
    const { projectDir } = await setupProject()

    await fs.rm(
      getGeneratorDirectoryPath(projectDir),
      {
        recursive: true,
        force: true
      }
    )

    const { error, output } = await getCliFailure(
      ['validate'],
      { cwd: projectDir }
    )

    expect(error.code).not.toBe(0)
    expect(output).toContain(
      '.moleculer-gen/config.json'
    )
  })
})
