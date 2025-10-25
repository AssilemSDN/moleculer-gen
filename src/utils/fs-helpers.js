/*
  PATH  /src/core/utils/fs-helpers.js
*/
import fs from 'fs/promises'
import yaml from 'js-yaml'
import { AppError } from '../errors/AppError.js'

/**
 * Generic wrapper to handle FS errors
 */
const handleFsError = (fn, msg, code) => async (...args) => {
  try {
    return await fn(...args)
  } catch (err) {
    throw new AppError(`${msg}: ${args[0]}`, {
      code,
      details: err
    })
  }
}

/**
 * Create a directory recursively.
 * @param {string} dirPath - Path to create
 * @returns {Promise<boolean>} - Resolves true on success
 * @throws {AppError} FS_MKDIR_ERROR if creation fails
 */
export const mkdirp = handleFsError(
  async (dirPath) => {
    await fs.mkdir(dirPath, { recursive: true })
  },
  'Impossible to create the directory',
  'FS_MKDIR_ERROR'
)

/**
 * Copy a directory recursively to a destination.
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {object} [opts] - Optional fs.cp options
 * @returns {Promise<boolean>} - Resolves true on success
 * @throws {AppError} FS_COPYDIR_ERROR if copy fails
 */
export const copyDir = handleFsError(
  async (srcDir, destDir, opts = {}) => {
    await fs.cp(srcDir, destDir, { recursive: true, ...opts })
  },
  'Impossible to copy files into',
  'FS_COPYDIR_ERROR'
)

/**
 * Ensure a directory exists and is empty.
 * @param {string} dirPath
 * @returns {Promise<void>}
 * @throws {AppError} FS_DIR_NOT_EMPTY if directory exists and is not empty
 */
export const ensureEmptyDir = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath)
    if (files.length > 0) {
      throw new AppError(`${dirPath} is not empty`, {
        code: 'FS_DIR_NOT_EMPTY'
      })
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
}

/**
 * Write content to a file.
 * @param {string} filePath
 * @param {string} content
 * @param {object} [opts] - Optional fs.writeFile options
 * @returns {Promise<boolean>} - Resolves true on success
 * @throws {AppError} FS_WRITE_ERROR if writing fails
 */
export const writeFile = handleFsError(
  async (filePath, content, opts = {}) => {
    await fs.writeFile(filePath, content, opts)
  },
  'Impossible to write the file',
  'FS_WRITE_ERROR'
)

/**
 * Read a file as UTF-8 string.
 * @param {string} filePath
 * @param {object} [opts] - Optional fs.readFile options
 * @returns {Promise<string>} - File content
 * @throws {AppError} FS_READ_ERROR if reading fails
 */
export const readFile = handleFsError(
  async (filePath, opts = {}) => fs.readFile(filePath, { encoding: 'utf8', ...opts }),
  'Impossible to read the file',
  'FS_READ_ERROR'
)
/**
 * Check if a path exists.
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export const exists = async (path) => fs.access(path).then(() => true).catch(() => false)

/**
 * Write a YAML file.
 * @param {string} filePath
 * @param {any} data - Object to dump to YAML
 * @param {object} [opts] - Optional fs.writeFile options
 * @returns {Promise<boolean>} - Resolves true on success
 * @throws {AppError} FS_WRITE_ERROR if writing fails
 */
export const writeYAML = async (filePath, data, opts = {}) => {
  const content = yaml.dump(data, { noRefs: true, indent: 2 })
  return writeFile(filePath, content, opts)
}
