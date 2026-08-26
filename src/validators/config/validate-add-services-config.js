/*
  PATH /src/validators/config/validate-add-services-config.js
*/
import { AppError } from '../../errors/AppError.js'
import { ErrorCodes } from '../../errors/error-codes.js'
import { validateAddServiceConfig } from './validate-add-service-config.js'

export const validateAddServicesConfig = (config) => {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new AppError(
      'Invalid services config: must be a JSON object',
      { code: ErrorCodes.INVALID_CONFIG }
    )
  }

  if (!Array.isArray(config.services)) {
    throw new AppError(
      'Invalid services config: services must be an array',
      { code: ErrorCodes.INVALID_CONFIG }
    )
  }
  return {
    ...config,
    services: config.services.map(validateAddServiceConfig)
  }
}
