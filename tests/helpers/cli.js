import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, '../..')
const cliPath = path.join(repoRoot, 'bin', 'cli.js')

export const runCli = async (args, { cwd }) => {
  return execFileAsync(
    process.execPath,
    [cliPath, ...args],
    { cwd }
  )
}
