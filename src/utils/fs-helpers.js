/*
  PATH /src/utils/fs-helpers.js
*/
import fs from 'fs/promises'
import path from 'path'
import * as yaml from 'js-yaml'
import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'

/**
 * Generic wrapper to handle permissions errors.
 */
const handlePermissionErrors = (fn, msg) => async (...args) => {
  try {
    return await fn(...args)
  } catch (err) {
    if (err instanceof AppError) {
      throw err
    }
    if (err?.code === 'EACCES' || err?.code === 'EPERM') {
      throw new AppError(`${msg}: ${args[0]}`, {
        code: ErrorCodes.PERMISSION_DENIED,
        cause: err,
        details: {
          path: args[0]
        }
      })
    }
    throw err
  }
}

/**
 * Resolve a path and ensure it stays inside the allowed base directory.
 *
 * @param {string} baseDir Allowed base directory.
 * @param {string} targetPath Path to resolve inside the base directory.
 * @returns {string} Resolved absolute path.
 * @throws {AppError} If the resolved path escapes the base directory.
 */
export const resolvePathInside = (baseDir, targetPath) => {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(resolvedBase, targetPath)

  const relativePath = path.relative(
    resolvedBase,
    resolvedTarget
  )

  const escapesBase =
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)

  if (escapesBase) {
    throw new AppError(`Path escapes allowed directory: ${targetPath}`,
      {
        code: ErrorCodes.PATH_OUTSIDE_BASE_DIRECTORY,
        details: {
          baseDir: resolvedBase,
          targetPath,
          resolvedPath: resolvedTarget
        }
      }
    )
  }

  return resolvedTarget
}

/**
 * Create a directory recursively.
 * @param {string} dirPath - Path to create
 * @returns {Promise<void>}
 * @throws {AppError} PERMISSION_DENIED if creation is not permitted
 */
export const mkdirp = handlePermissionErrors(
  async (dirPath) => {
    await fs.mkdir(dirPath, { recursive: true })
  },
  'Impossible to create the directory'
)

/**
 * Copy a directory recursively to a destination.
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {object} [opts] - Optional fs.cp options
 * @returns {Promise<void>}
 * @throws {AppError} PERMISSION_DENIED if copy is not permitted
 */
export const copyDir = handlePermissionErrors(
  async (srcDir, destDir, opts = {}) => {
    await fs.cp(srcDir, destDir, { recursive: true, ...opts })
  },
  'Impossible to copy files from'
)

/**
 * Ensure a directory exists and is empty.
 * @param {string} dirPath
 * @returns {Promise<void>}
 * @throws {AppError} TARGET_DIRECTORY_NOT_EMPTY if directory exists and is not empty
 */
export const ensureEmptyDir = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath)
    if (files.length > 0) {
      throw new AppError(`Directory is not empty: ${dirPath}`, {
        code: ErrorCodes.TARGET_DIRECTORY_NOT_EMPTY
      })
    }
  } catch (err) {
    if (err instanceof AppError) {
      throw err
    }
    if (err?.code === 'ENOENT') {
      return
    }
    if (err?.code === 'EACCES' || err?.code === 'EPERM') {
      throw new AppError(`Impossible to read the directory: ${dirPath}`, {
        code: ErrorCodes.PERMISSION_DENIED,
        cause: err,
        details: {
          path: dirPath
        }
      })
    }
    throw err
  }
}

/**
 * Write content to a file.
 * @param {string} filePath
 * @param {string} content
 * @param {object} [opts] - Optional fs.writeFile options
 * @returns {Promise<void>}
 * @throws {AppError} PERMISSION_DENIED if writing is not permitted
 */
export const writeFile = handlePermissionErrors(
  async (filePath, content, opts = {}) => {
    await mkdirp(path.dirname(filePath))
    await fs.writeFile(filePath, content, opts)
  },
  'Impossible to write the file'
)

/**
 * Read a file as UTF-8 string.
 * @param {string} filePath
 * @param {object} [opts] - Optional fs.readFile options
 * @returns {Promise<string>} - File content
 * @throws {AppError} PERMISSION_DENIED if reading is not permitted
 */
export const readFile = handlePermissionErrors(
  async (filePath, opts = {}) => fs.readFile(filePath, { encoding: 'utf8', ...opts }),
  'Impossible to read the file'
)

/**
 * Check if a path exists.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export const exists = async filePath => {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false
    }

    if (
      error?.code === 'EACCES' ||
      error?.code === 'EPERM'
    ) {
      throw new AppError(
        `Impossible to access the path: ${filePath}`,
        {
          code: ErrorCodes.PERMISSION_DENIED,
          cause: error,
          details: {
            path: filePath
          }
        }
      )
    }

    throw error
  }
}

/**
 * Read a JSON file and parse its content.
 * @param {*} filePath
 * @returns the parsed JSON content
 * @throws {SyntaxError} If JSON parsing fails
 */
export const readJsonFile = async filePath => {
  const content = await readFile(filePath)
  try {
    return JSON.parse(content)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError(`Invalid JSON file: ${filePath}`, {
        code: ErrorCodes.INVALID_JSON,
        cause: error,
        details: {
          path: filePath
        }
      })
    }
    throw error
  }
}

/**
 * Read a YAML file and parse its content.
 * @param {string} filePath
 * @returns {Promise<any>} - Parsed YAML content
 * @throws {YAMLException} If YAML parsing fails
 */
export const readYAML = async filePath => {
  const content = await readFile(filePath)
  try {
    return yaml.load(content)
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      throw new AppError(`Invalid YAML file: ${filePath}`, {
        code: ErrorCodes.INVALID_YAML,
        cause: error,
        details: {
          path: filePath
        }
      })
    }
    throw error
  }
}

/**
 * Write a YAML file.
 * @param {string} filePath
 * @param {any} data - Object to dump to YAML
 * @param {object} [opts] - Optional fs.writeFile options
 * @returns {Promise<any>} - Resolves true on success
 * @throws {AppError} PERMISSION_DENIED if writing is not permitted
 */
export const writeYAML = async (filePath, data, opts = {}) => {
  const content = yaml.dump(data, { noRefs: true, indent: 2 })
  return writeFile(filePath, content, opts)
}
