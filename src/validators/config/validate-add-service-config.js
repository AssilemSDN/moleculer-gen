import { generateDefaultNames } from '../../utils/common-helpers.js'
import { AppError } from '../../errors/AppError.js'
import { addServiceConfigSchema } from '../../schemas/add-service-config.schema.js'

/**
 * Validate and normalize a service configuration.
 * Fills missing fields with default values.
 *
 * @param {object} config Service configuration.
 * @returns {object} Validated and normalized configuration.
 * @throws {AppError} If the configuration is invalid.
 */
export const validateAddServiceConfig = (config) => {
  const result = addServiceConfigSchema.safeParse(config)

  if (!result.success) {
    throw new AppError('Invalid service config',
      {
        code: 'INVALID_CONFIG',
        cause: result.error
      }
    )
  }

  const parsedConfig = result.data

  // Default values
  const defaults = generateDefaultNames(parsedConfig.serviceName)

  const isCrud = parsedConfig.isCrud ?? false
  const exposeApi = parsedConfig.exposeApi ?? false

  // Normalized values
  const normalized = {
    serviceName: parsedConfig.serviceName,
    isCrud,
    exposeApi,
    serviceFileName:
      parsedConfig.serviceFileName ??
      defaults.serviceFileName,
    serviceDirectoryName:
      parsedConfig.serviceDirectoryName ??
      defaults.serviceDirectoryName
  }

  // Add required values for CRUD services
  if (isCrud) {
    normalized.modelFileName =
      parsedConfig.modelFileName ??
      defaults.modelFileName

    normalized.modelName =
      parsedConfig.modelName ??
      defaults.modelName

    normalized.modelVariableName =
      parsedConfig.modelVariableName ??
      defaults.modelVariableName

    normalized.collectionName =
      parsedConfig.collectionName ??
      defaults.collectionName

    normalized.schemaName =
      parsedConfig.schemaName ??
      defaults.schemaName
  }

  return normalized
}
