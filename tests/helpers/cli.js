import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { cliPath } from './paths'

const execFileAsync = promisify(execFile)

export const runCli = async (args, { cwd }) => {
  return execFileAsync(
    process.execPath,
    [cliPath, ...args],
    { cwd }
  )
}
