/*
  PATH /src/validators/validate-project/validate-required-dynamic-files.js
*/

import path from 'path'

import { logger } from '../../utils/logger.js'

import {
  isDirectory,
  isFile
} from '../../utils/fs-helpers.js'

/**
 * Builds required paths from the validated Moleculer Gen configuration.
 *
 * Invalid configuration entries have already been excluded by
 * validateMoleculerConfig.
 *
 * @param {object} config Validated configuration.
 * @returns {{
 *   path: string,
 *   type: 'file' | 'directory',
 *   severity: 'error' | 'warning'
 * }[]}
 */
const buildRequiredGeneratedPaths = config => {
  const requiredPaths = []

  // Add required database files
  if (config.database) {
    requiredPaths.push(
      {
        path: 'src/config/modules/database.config.js',
        type: 'file',
        severity: 'error'
      },
      {
        path: 'src/mixins/db.mixin.js',
        type: 'file',
        severity: 'error'
      }
    )
  }

  // Add required transporter file
  if (config.transporter) {
    requiredPaths.push({
      path: 'src/config/modules/transporter.config.js',
      type: 'file',
      severity: 'error'
    })
  }

  // Add required service files and directories
  for (const service of Object.values(config.services ?? {})) {
    const serviceDirectoryPath = path.join(
      'src',
      'services',
      service.serviceDirectoryName
    )

    requiredPaths.push(
      {
        path: serviceDirectoryPath,
        type: 'directory',
        severity: 'error'
      },
      {
        path: path.join(
          serviceDirectoryPath,
          service.serviceFileName
        ),
        type: 'file',
        severity: 'error'
      }
    )
    // Add required model file if the service is a CRUD service (entity needed for database operations)
    if (service.isCrud) {
      requiredPaths.push({
        path: path.join(
          'src',
          'data',
          'model',
          service.modelFileName
        ),
        type: 'file',
        severity: 'error'
      })
    }
  }

  return requiredPaths
}

/**
 * DEPENDS ON : validateMoleculerConfig
 *
 * Validates dynamically required generated files and directories.
 *
 * Required paths are built only from configuration entries previously
 * validated by validateMoleculerConfig.
 *
 * @param {string} projectDir Project root directory.
 * @param {object} config Validated Moleculer Gen configuration.
 * @returns {Promise<{
 *   valid: boolean,
 *   errors: string[],
 *   warnings: string[]
 * }>}
 */
export const validateRequiredDynamicFiles = async (
  projectDir,
  config
) => {
  const errors = []
  const warnings = []

  const requiredPaths = buildRequiredGeneratedPaths(config)

  for (const requiredPath of requiredPaths) {
    logger.info(`> Checking ${requiredPath.type}: ${requiredPath.path}`)

    // 1. Check if the path is not outside the project
    const segments = requiredPath.path.split(/[\\/]+/)
    if (segments.includes('..')) {
      errors.push(
        `Path is outside the project: ${requiredPath.path}`
      )
      continue
    }

    // Here the absolute path is safe
    const absolutePath = path.join(
      projectDir,
      requiredPath.path
    )

    // 2. Check if the path exists and has the expected type (file or directory)
    const hasExpectedType = requiredPath.type === 'file'
      ? await isFile(absolutePath)
      : await isDirectory(absolutePath)
    if (hasExpectedType) {
      continue
    }

    // Here, path is missing or has the wrong type
    if (requiredPath.severity === 'warning') {
      logger.error(`Path is missing or has the wrong type : ${requiredPath.type}: ${requiredPath.path}`)
      warnings.push(
        `Path is missing or has the wrong type : ${requiredPath.type}: ${requiredPath.path}`
      )
    } else {
      errors.push(
        `Path is missing or has the wrong type : ${requiredPath.type}: ${requiredPath.path}`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
