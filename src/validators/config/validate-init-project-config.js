import path from 'path'

import { AppError } from '../../errors/AppError.js'
import { sanitizeName } from '../../utils/common-helpers.js'

import { modulesRegistry } from '../../../dist/modules/registry.js'
import { ErrorCodes } from '../../errors/error-codes.js'

/**
 * Validate and normalize a project configuration.
 *
 * @param {object} config Project configuration.
 * @returns {object} Validated and normalized configuration.
 * @throws {AppError} If the configuration is invalid.
 */
export const validateInitProjectConfig = (config) => {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new AppError(
      'Invalid project config: must be a JSON object',
      { code: ErrorCodes.INVALID_CONFIG }
    )
  }

  const requiredFields = [
    'projectName',
    'database',
    'transporter'
  ]

  for (const field of requiredFields) {
    if (!(field in config)) {
      throw new AppError(
        `Missing required config field: ${field}`,
        { code: ErrorCodes.INVALID_CONFIG }
      )
    }
  }

  if (!Object.hasOwn(modulesRegistry.database, config.database)) {
    throw new AppError(
      `Invalid database key: ${config.database}`,
      { code: ErrorCodes.INVALID_CONFIG }
    )
  }

  if (!Object.hasOwn(modulesRegistry.transporter, config.transporter)) {
    throw new AppError(
      `Invalid transporter key: ${config.transporter}`,
      { code: ErrorCodes.INVALID_CONFIG }
    )
  }

  const pluginKeys = config.plugins ?? []

  if (!Array.isArray(pluginKeys)) {
    throw new AppError(
      'Invalid plugins config: must be an array',
      { code: ErrorCodes.INVALID_CONFIG }
    )
  }

  for (const pluginKey of pluginKeys) {
    if (!Object.hasOwn(modulesRegistry.plugin, pluginKey)) {
      throw new AppError(
        `Invalid plugin key: ${pluginKey}`,
        { code: ErrorCodes.INVALID_CONFIG }
      )
    }
  }

  return {
    ...config,
    projectNameSanitized:
      config.projectNameSanitized ??
      path.basename(sanitizeName(config.projectName)),
    plugins: pluginKeys
  }
}
