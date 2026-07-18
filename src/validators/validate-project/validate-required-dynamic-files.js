/*
  PATH /src/validators/validate-project/validate-required-dynamic-files.js
*/

import path from 'node:path'

import { logger } from '../../utils/logger.js'

import {
  isDirectory,
  isFile
} from '../../utils/fs-helpers.js'
import { ensurePathInside } from '../../utils/common-helpers.js'

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

  if (config.transporter) {
    requiredPaths.push({
      path: 'src/config/modules/transporter.config.js',
      type: 'file',
      severity: 'error'
    })
  }

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
 * DEPENDS ON: validateMoleculerConfig
 *
 * Validates dynamically required generated files and directories.
 *
 * @param {string} projectDir Project root directory.
 * @param {object} config Validated Moleculer Gen configuration.
 * @returns {Promise<{
 *   valid: boolean,
 *   errors: string[],
 *   warnings: string[],
 *   nbErrors: number,
 *   nbWarnings: number
 * }>}
 */
export const validateRequiredDynamicFiles = async (
  projectDir,
  config
) => {
  const errors = []
  const warnings = []

  const requiredPaths = buildRequiredGeneratedPaths(
    config ?? {}
  )

  for (const requiredPath of requiredPaths) {
    logger.info(
      `> Checking ${requiredPath.type}: ${requiredPath.path}`
    )

    let absolutePath
    try {
      absolutePath = ensurePathInside(
        projectDir,
        path.join(projectDir, requiredPath.path)
      )
    } catch (error) {
      errors.push(
        `Invalid generated path: ${requiredPath.path}`
      )
      continue
    }

    const hasExpectedType =
      requiredPath.type === 'file'
        ? await isFile(absolutePath)
        : await isDirectory(absolutePath)

    if (hasExpectedType) {
      continue
    }

    const message =
      'Path is missing or has the wrong type: ' +
      `${requiredPath.type}: ${requiredPath.path}`

    if (requiredPath.severity === 'warning') {
      warnings.push(message)
    } else {
      errors.push(message)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    nbErrors: errors.length,
    nbWarnings: warnings.length
  }
}
