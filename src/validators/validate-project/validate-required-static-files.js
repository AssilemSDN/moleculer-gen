/*
  PATH /src/validators/validate-project/validate-required-static-files.js
*/

import path from 'path'

import {
  isDirectory,
  isFile
} from '../../utils/fs-helpers.js'

const STATIC_BASE_REQUIRED_PATHS = [
  {
    path: 'package.json',
    type: 'file',
    severity: 'error'
  }
]

/**
 * Validates static required project files and directories. Can be done at the same time
 * as validateMoleculerConfig, since it does not depend on the configuration.
 *
 * @param {string} projectDir Project root directory.
 * @returns {Promise<{
 *   valid: boolean,
 *   errors: string[],
 *   warnings: string[]
 * }>}
 */
export const validateRequiredStaticFiles = async projectDir => {
  const errors = []
  const warnings = []

  for (const requiredPath of STATIC_BASE_REQUIRED_PATHS) {
    const absolutePath = path.join(
      projectDir,
      requiredPath.path
    )

    const existsWithExpectedType = requiredPath.type === 'file'
      ? await isFile(absolutePath)
      : await isDirectory(absolutePath)

    if (existsWithExpectedType) {
      continue
    }

    if (requiredPath.severity === 'warning') {
      warnings.push(`Missing expected ${requiredPath.type}: ${requiredPath.path}`)
    } else {
      errors.push(`Missing required ${requiredPath.type}: ${requiredPath.path}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
