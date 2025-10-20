/*
  PATH  /src/core/utils/fs-helpers.js
*/
import fs from 'fs/promises'
import yaml from 'js-yaml'
import { AppError } from '../errors/AppError.js'

/**
 * Create a directory recursively.
 * @param {string} dirPath - Path to create
 * @returns {Promise<boolean>} - Resolves true on success
 * @throws {AppError} FS_MKDIR_ERROR if creation fails
 */
export const mkdirp = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true })
    return true
  } catch (err) {
    throw new AppError(`Impossible to create the directory: ${dirPath}`, {
      code: 'FS_MKDIR_ERROR',
      details: err
    })
  }
}
/**
 * Copy a directory recursively to a destination.
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {object} [opts] - Optional fs.cp options
 * @returns {Promise<boolean>} - Resolves true on success
 * @throws {AppError} FS_COPYDIR_ERROR if copy fails
 */
export const copyDir = async (srcDir, destDir, opts = {}) => {
  try {
    await fs.cp(srcDir, destDir, { recursive: true, ...opts })
    return true
  } catch (err) {
    throw new AppError(`Impossible to copy files into ${destDir}`, {
      code: 'FS_COPYDIR_ERROR',
      details: err
    })
  }
}

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
export const writeFile = async (filePath, content, opts = {}) => {
  try {
    await fs.writeFile(filePath, content, opts)
    return true
  } catch (err) {
    throw new AppError(`Impossible to write the file: ${filePath}`, {
      code: 'FS_WRITE_ERROR',
      details: err
    })
  }
}

/**
 * Read a file as UTF-8 string.
 * @param {string} filePath
 * @param {object} [opts] - Optional fs.readFile options
 * @returns {Promise<string>} - File content
 * @throws {AppError} FS_READ_ERROR if reading fails
 */

export const readFile = async (filePath, opts = {}) => {
  try {
    return await fs.readFile(filePath, { encoding: 'utf8', ...opts })
  } catch (err) {
    throw new AppError(`Impossible to read the file: ${filePath}`, {
      code: 'FS_READ_ERROR',
      details: err
    })
  }
}

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
