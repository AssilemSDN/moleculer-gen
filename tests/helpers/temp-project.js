import path from 'path'

import { readJsonFile } from '../../src/utils/fs-helpers.js'

import { runCli } from './cli.js'
import { createTempDir } from './temp-dir.js'

export async function createGeneratedProject (configPath) {
  const tempDir = await createTempDir()
  const config = await readJsonFile(configPath)

  await runCli(['init', configPath], {
    cwd: tempDir
  })

  return {
    tempDir,
    projectDir: path.join(
      tempDir,
      config.projectNameSanitized
    ),
    config
  }
}
