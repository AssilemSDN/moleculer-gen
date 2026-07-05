import path from 'path'

import { AppError } from '../errors/AppError.js'

import { sanitizeName } from '../utils/common-helpers.js'

// Modules Factory
import { databases } from '../../dist/modules/databases/index.js'
import { transporters } from '../../dist/modules/transporters/index.js'
import { plugins } from '../../dist/modules/plugins/index.js'

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
      { code: 'INVALID_CONFIG' }
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
        { code: 'INVALID_CONFIG' }
      )
    }
  }

  if (!databases[config.database]) {
    throw new AppError(
      `Invalid database key: ${config.database}`,
      { code: 'INVALID_CONFIG' }
    )
  }

  if (!transporters[config.transporter]) {
    throw new AppError(
      `Invalid transporter key: ${config.transporter}`,
      { code: 'INVALID_CONFIG' }
    )
  }

  const pluginKeys = config.plugins ?? []

  if (!Array.isArray(pluginKeys)) {
    throw new AppError(
      'Invalid plugins config: must be an array',
      { code: 'INVALID_CONFIG' }
    )
  }

  for (const pluginKey of pluginKeys) {
    if (!plugins[pluginKey]) {
      throw new AppError(
        `Invalid plugin key: ${pluginKey}`,
        { code: 'INVALID_CONFIG' }
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
