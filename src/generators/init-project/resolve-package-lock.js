/*
 * PATH /src/generators/init-project/resolve-package-lock.js
 */
import { spawn } from 'node:child_process'

import { AppError } from '../../errors/AppError.js'
import { ErrorCodes } from '../../errors/error-codes.js'
import { logger } from '../../utils/logger.js'

const YARN_ARGS = [
  'yarn',
  'install',
  '--mode=update-lockfile'
]

/**
 * Spawn the package manager process used to resolve the project lockfile.
 *
 * Corepack is used to execute the Yarn version declared by the generated project's packageManager field.
 *
 * On Windows, command shims must be executed through cmd.exe.
 *
 * @param {string} projectDir - Project working directory
 * @returns {import('node:child_process').ChildProcess} Spawned process
 */
const spawnPackageManager = projectDir => {
  const options = {
    cwd: projectDir,
    stdio: ['ignore', 'pipe', 'pipe']
  }

  if (process.platform === 'win32') {
    return spawn(
      'cmd.exe',
      [
        '/d',
        '/s',
        '/c',
        `corepack ${YARN_ARGS.join(' ')}`
      ],
      {
        ...options,
        windowsHide: true
      }
    )
  }
  return spawn('corepack', YARN_ARGS, options)
}

/**
 * Resolve the project Yarn lockfile from the generated package.json.
 *
 * Yarn runs in update-lockfile mode so dependency resolution is performed without linking or installing
 * project dependencies.
 * @async
 * @param {string} projectDir - Generated project directory
 * @param {Function} [spawnProcess=spawnPackageManager] - Process factory
 * @returns {Promise<void>}
 * @throws {AppError} When the package manager cannot start or lockfile
 * resolution fails
 */
export const resolvePackageLock = async (
  projectDir,
  spawnProcess = spawnPackageManager
) => {
  logger.debug('Resolving project package lock:', {
    projectDir
  })

  await new Promise((resolve, reject) => {
    const child = spawnProcess(projectDir)

    let stdout = ''
    let stderr = ''
    let settled = false

    /**
     * Reject lockfile resolution once with a normalized application error.
     */
    const fail = message => {
      if (settled) return
      settled = true
      reject(
        new AppError(message, {
          code: ErrorCodes.PACKAGE_LOCK_RESOLUTION_FAILED
        })
      )
    }

    child.stdout?.on('data', chunk => {
      stdout += chunk.toString()
    })

    child.stderr?.on('data', chunk => {
      stderr += chunk.toString()
    })

    child.once('error', error => {
      fail(`Unable to start package lock resolution: ${error.message}`)
    })

    child.once('close', code => {
      if (settled) return
      if (code === 0) {
        settled = true
        logger.debug('Project package lock resolved successfully')
        resolve()
        return
      }
      const output = stderr.trim() || stdout.trim()
      fail(
        output
          ? `Unable to resolve project package lock: ${output}`
          : `Unable to resolve project package lock (exit code ${code})`
      )
    })
  })
}
