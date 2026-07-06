/*
  PATH /src/validators/config/validate-services-config.js
*/
import { AppError } from '../../errors/AppError.js'
import { validateServiceConfig } from './validate-service-config.js'

export const validateServicesConfig = (config) => {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new AppError(
      'Invalid services config: must be a JSON object',
      { code: 'INVALID_SERVICES_CONFIG' }
    )
  }

  if (!Array.isArray(config.services)) {
    throw new AppError(
      'Invalid services config: services must be an array',
      { code: 'INVALID_SERVICES_CONFIG' }
    )
  }

  return {
    ...config,
    services: config.services.map(validateServiceConfig)
  }
}
