/*
 * PATH /src/generators/init-project/resolve-package-lock.js
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { AppError } from '../../errors/AppError.js'
import { ErrorCodes } from '../../errors/error-codes.js'
import { logger } from '../../utils/logger.js'

const require = createRequire(import.meta.url)

const YARN_ARGS = [
  'yarn',
  'install',
  '--mode=update-lockfile'
]

/**
 * Resolve the Corepack CLI bundled with moleculer-gen.
 *
 * Corepack is installed as a runtime dependency so lockfile generation does not depend on a globally
 * installed Corepack binary or on the Node.js distribution providing one.
 *
 * @returns {string} Absolute path to the Corepack CLI entry point
 */
const resolveCorepackBin = () => {
  const packagePath = require.resolve('corepack/package.json')
  return join(
    dirname(packagePath),
    'dist',
    'corepack.js'
  )
}

/**
 * Spawn the package manager process used to resolve the project lockfile.
 *
 * The bundled Corepack CLI is executed with the current Node.js runtime. Corepack then executes the Yarn version
 * declared by the generated project's packageManager field.
 *
 * Executing the JavaScript entry point directly avoids relying on PATH,
 * platform-specific command shims, or a globally installed Corepack binary.
 *
 * @param {string} projectDir - Project working directory
 * @returns {import('node:child_process').ChildProcess} Spawned process
 */
const spawnPackageManager = projectDir => {
  const corepackBin = resolveCorepackBin()
  return spawn(
    process.execPath,
    [
      corepackBin,
      ...YARN_ARGS
    ],
    {
      cwd: projectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    }
  )
}

/**
 * Resolve the project Yarn lockfile from the generated package.json.
 *
 * Yarn runs in update-lockfile mode so dependency resolution is performed  without linking or installing
 * project dependencies.
 *
 * @async
 * @param {string} projectDir - Generated project directory
 * @param {Function} [spawnProcess=spawnPackageManager] - Process factory
 * @returns {Promise<void>}
 * @throws {AppError} When the package manager cannot start or lockfile resolution fails
 */
export const resolvePackageLock = async (
  projectDir,
  spawnProcess = spawnPackageManager
) => {
  logger.debug('Resolving project package lock:', {
    projectDir
  })
  await new Promise((resolve, reject) => {
    let child
    /**
     * Reject lockfile resolution with a normalized application error.
     */
    const fail = message => {
      reject(
        new AppError(message, {
          code: ErrorCodes.PACKAGE_LOCK_RESOLUTION_FAILED
        })
      )
    }
    try {
      child = spawnProcess(projectDir)
    } catch (error) {
      fail(`Unable to start package lock resolution: ${error.message}`)
      return
    }

    let stdout = ''
    let stderr = ''
    let settled = false
    /**
     * Reject lockfile resolution once.
     */
    const failOnce = message => {
      if (settled) return
      settled = true
      fail(message)
    }

    child.stdout?.on('data', chunk => {
      stdout += chunk.toString()
    })

    child.stderr?.on('data', chunk => {
      stderr += chunk.toString()
    })

    child.once('error', error => {
      failOnce(`Unable to start package lock resolution: ${error.message}`)
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
      failOnce(
        output
          ? `Unable to resolve project package lock: ${output}`
          : `Unable to resolve project package lock (exit code ${code})`
      )
    })
  })
}
