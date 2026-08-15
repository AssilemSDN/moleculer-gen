import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { readJsonFile } from '../../src/utils/fs-helpers.js'

import { runCli } from './cli.js'

export const createTempDir = async () => {
  return fs.mkdtemp(
    path.join(os.tmpdir(), 'moleculer-gen-')
  )
}

export const removeTempDir = async tempDir => {
  if (!tempDir) return

  await fs.rm(tempDir, {
    recursive: true,
    force: true
  })
}

export const writeTempConfig = async (
  tempDir,
  filename,
  config
) => {
  const configPath = path.join(tempDir, filename)

  await fs.writeFile(
    configPath,
    JSON.stringify(config, null, 2)
  )

  return configPath
}

export const createGeneratedProject = async (configPath) => {
  const tempDir = await createTempDir()

  try {
    const config = await readJsonFile(configPath)

    await runCli(
      ['init', configPath],
      { cwd: tempDir }
    )

    return {
      tempDir,
      projectDir: path.join(
        tempDir,
        config.projectNameSanitized
      ),
      config
    }
  } catch (error) {
    await removeTempDir(tempDir)
    throw error
  }
}
