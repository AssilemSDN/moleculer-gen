import path from 'node:path'

import { AppError } from '../../errors/AppError.js'

import {
  isNonEmptyString,
  isObject,
  validateProjectName,
  validateSanitizedName
} from '../../utils/common-helpers.js'

/**
 *
 * @param {*} moleculerConfig
 * @param {*} validatedConfig
 * @param {*} errors
 */
export const checkValidatedFields = (moleculerConfig, validatedConfig, errors) => {
  // Check if projectName field is validated
  validatedConfig.projectName = captureValidation(
    () => validateProjectName(
      moleculerConfig.projectName
    ),
    errors
  )

  // Check if projectNameSanitized field is validated
  validatedConfig.projectNameSanitized =
    captureValidation(
      () => validateSanitizedName(
        'projectNameSanitized',
        moleculerConfig.projectNameSanitized
      ),
      errors
    )

  // Check if database field is validated and known by moleculer-gen
  if (!isNonEmptyString(moleculerConfig.database)) {
    errors.push(
      'Invalid .moleculer-gen/config.json: missing or invalid "database"'
    )
  } else {
    validatedConfig.database =
      moleculerConfig.database.trim()
  }

  // Check if transporter field is validated
  if (!isNonEmptyString(moleculerConfig.transporter)) {
    errors.push(
      'Invalid .moleculer-gen/config.json: missing or invalid "transporter"'
    )
  } else {
    validatedConfig.transporter =
      moleculerConfig.transporter.trim()
  }

  // Check is plugins field is validated
  if (
    moleculerConfig.plugins !== undefined &&
    !Array.isArray(moleculerConfig.plugins)
  ) {
    errors.push(
      'Invalid .moleculer-gen/config.json: "plugins" must be an array'
    )
  } else if (Array.isArray(moleculerConfig.plugins)) {
    for (
      const [pluginIndex, plugin] of
      moleculerConfig.plugins.entries()
    ) {
      if (!isNonEmptyString(plugin)) {
        errors.push(
          `Invalid .moleculer-gen/config.json: "plugins[${pluginIndex}]" must be a non-empty string`
        )

        continue
      }

      validatedConfig.plugins.push(plugin.trim())
    }
  }

  // Check if services field is validated
  if (!isObject(moleculerConfig.services)) {
    errors.push(
      'Invalid .moleculer-gen/config.json: "services" must be an object'
    )
  } else {
    for (
      const [serviceKey, service] of
      Object.entries(moleculerConfig.services)
    ) {
      const serviceResult =
        validateServiceStructure(
          serviceKey,
          service
        )

      errors.push(...serviceResult.errors)

      if (serviceResult.valid) {
        validatedConfig.services[serviceKey] =
          serviceResult.service
      }
    }
  }
}

/// //////////// Utils function ////////////

/**
 *
 * @param {*} validator
 * @param {*} errors
 * @returns
 */
const captureValidation = (
  validator,
  errors
) => {
  try {
    return validator()
  } catch (error) {
    errors.push(
      `Invalid .moleculer-gen/config.json: ${error.message}`
    )
    return undefined
  }
}

/**
 * Validates a file name without allowing path traversal.
 *
 * @param {string} fieldName
 * @param {unknown} value
 * @returns {string}
 * @throws {AppError} If the file name is invalid.
 */
const validateFileName = (fieldName, value) => {
  if (!isNonEmptyString(value)) {
    throw new AppError(
      `${fieldName} must be a non-empty string.`,
      { code: 'INVALID_FILE_NAME' }
    )
  }

  const fileName = value.trim()

  if (
    fileName === '.' ||
    fileName === '..' ||
    fileName.includes('/') ||
    fileName.includes('\\') ||
    path.basename(fileName) !== fileName
  ) {
    throw new AppError(
      `${fieldName} must be a file name without path separators.`,
      { code: 'INVALID_FILE_NAME' }
    )
  }

  return fileName
}

/**
 * Validates a service stored in .moleculer-gen/config.json.
 *
 * @param {string} serviceKey
 * @param {unknown} service
 * @returns {{
 *   valid: boolean,
 *   errors: string[],
 *   service?: object
 * }}
 */
const validateServiceStructure = (
  serviceKey,
  service
) => {
  const errors = []
  const serviceContext = `services.${serviceKey}`

  if (!isObject(service)) {
    errors.push(
      `Invalid .moleculer-gen/config.json: "${serviceContext}" must be an object`
    )

    return {
      valid: false,
      errors
    }
  }

  const validatedService = {
    ...service,
    serviceName: undefined,
    serviceDirectoryName: undefined,
    serviceFileName: undefined,
    modelFileName: undefined
  }

  if (!isNonEmptyString(service.serviceName)) {
    errors.push(
      `Invalid .moleculer-gen/config.json: missing or invalid "${serviceContext}.serviceName"`
    )
  } else {
    validatedService.serviceName =
      service.serviceName.trim()
  }

  try {
    validatedService.serviceDirectoryName =
      validateSanitizedName(
        `${serviceContext}.serviceDirectoryName`,
        service.serviceDirectoryName
      )
  } catch (error) {
    errors.push(
      `Invalid .moleculer-gen/config.json: ${error.message}`
    )
  }

  try {
    validatedService.serviceFileName =
      validateFileName(
        `${serviceContext}.serviceFileName`,
        service.serviceFileName
      )
  } catch (error) {
    errors.push(
      `Invalid .moleculer-gen/config.json: ${error.message}`
    )
  }

  if (typeof service.isCrud !== 'boolean') {
    errors.push(
      `Invalid .moleculer-gen/config.json: "${serviceContext}.isCrud" must be a boolean`
    )
  }

  if (
    service.exposeApi !== undefined &&
    typeof service.exposeApi !== 'boolean'
  ) {
    errors.push(
      `Invalid .moleculer-gen/config.json: "${serviceContext}.exposeApi" must be a boolean`
    )
  }

  if (service.isCrud === true) {
    try {
      validatedService.modelFileName =
        validateFileName(
          `${serviceContext}.modelFileName`,
          service.modelFileName
        )
    } catch (error) {
      errors.push(
        `Invalid .moleculer-gen/config.json: ${error.message}`
      )
    }
  } else {
    delete validatedService.modelFileName
  }

  return {
    valid: errors.length === 0,
    errors,
    service: validatedService
  }
}
