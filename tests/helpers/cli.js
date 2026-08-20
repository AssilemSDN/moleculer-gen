import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { cliPath } from './paths.js'

const execFileAsync = promisify(execFile)

export const runCli = async (args, { cwd }) => {
  return execFileAsync(
    process.execPath,
    [cliPath, ...args],
    { cwd }
  )
}

export const getCliFailure = async (args, { cwd }) => {
  try {
    await runCli(args, { cwd })
  } catch (error) {
    return {
      error,
      output: `${
        error.stdout ?? ''
      }${
        error.stderr ?? ''
      }`
    }
  }

  throw new Error(
    `Expected CLI command "${args.join(' ')}" to fail`
  )
}
