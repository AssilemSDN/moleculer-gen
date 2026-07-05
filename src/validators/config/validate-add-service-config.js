import { generateDefaultNames } from '../utils/common-helpers.js'
import { AppError } from '../errors/AppError.js'
/**
 * Validate and normalize a service configuration.
 * Fills missing fields with default values.
 *
 * @param {object} config Service configuration.
 * @returns {object} Validated and normalized configuration.
 * @throws {AppError} If the configuration is invalid.
 */
export const validateAddServiceConfig = (config) => {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new AppError(
      'Invalid service config: must be a JSON object',
      { code: 'INVALID_CONFIG' }
    )
  }

  if (!config.serviceName || typeof config.serviceName !== 'string') {
    throw new AppError(
      'Missing required field: serviceName',
      { code: 'INVALID_CONFIG' }
    )
  }

  // Default values
  const defaults = generateDefaultNames(config.serviceName)

  const isCrud = !!config.isCrud
  const exposeApi = !!config.exposeApi

  // Normalized values
  const normalized = {
    serviceName: config.serviceName,
    isCrud,
    exposeApi,
    serviceFileName:
      config.serviceFileName ||
      defaults.serviceFileName,
    serviceDirectoryName:
      config.serviceDirectoryName ||
      defaults.serviceDirectoryName
  }

  // Add required values for CRUD services
  if (isCrud) {
    normalized.modelFileName =
      config.modelFileName ||
      defaults.modelFileName

    normalized.modelName =
      config.modelName ||
      defaults.modelName

    normalized.modelVariableName =
      config.modelVariableName ||
      defaults.modelVariableName

    normalized.collectionName =
      config.collectionName ||
      defaults.collectionName

    normalized.schemaName =
      config.schemaName ||
      defaults.schemaName
  }

  return normalized
}
