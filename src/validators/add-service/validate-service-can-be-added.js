/*
  PATH /src/validators/project/validate-service-can-be-added.js
*/
import path from 'path'

import {
  exists,
  resolvePathInside
} from '../../utils/fs-helpers.js'

import { AppError } from '../../errors/AppError.js'

export const validateServiceNameAvailable = ({
  serviceName,
  moleculerGenConfig
}) => {
  const existingServices =
    moleculerGenConfig.services ?? {}

  const existingService =
    existingServices[serviceName]

  if (
    existingService !== undefined &&
    existingService !== null
  ) {
    throw new AppError(
      `Service "${serviceName}" already declared in .moleculer-gen/config.json`,
      { code: 'SERVICE_ALREADY_EXISTS' }
    )
  }
}

export const validateServiceCanBeAdded = async ({
  projectDir,
  serviceConfig,
  moleculerGenConfig
}) => {
  // Check if service already declared in moleculer-gen config
  validateServiceNameAvailable({
    serviceName: serviceConfig.serviceName,
    moleculerGenConfig
  })

  // Check if service directory already exists
  const servicesDir = path.join(
    projectDir,
    'src',
    'services'
  )

  const serviceDir = resolvePathInside(
    servicesDir,
    serviceConfig.serviceDirectoryName
  )

  if (await exists(serviceDir)) {
    throw new AppError(
      `Service directory already exists: ${serviceDir}`,
      { code: 'SERVICE_ALREADY_EXISTS' }
    )
  }

  // Check if docker service file already exists
  const dockerServicesDir = path.join(
    projectDir,
    'docker',
    'services'
  )

  const dockerServicePath = resolvePathInside(
    dockerServicesDir,
    `${serviceConfig.serviceDirectoryName}.yaml`
  )

  if (await exists(dockerServicePath)) {
    throw new AppError(
      `Docker service YAML already exists: ${dockerServicePath}`,
      { code: 'DOCKER_SERVICE_ALREADY_EXISTS' }
    )
  }

  // Check if model file already exists (if service is CRUD)
  if (serviceConfig.isCrud) {
    const modelsDir = path.join(
      projectDir,
      'src',
      'data',
      'model'
    )

    const modelPath = resolvePathInside(
      modelsDir,
      serviceConfig.modelFileName
    )

    if (await exists(modelPath)) {
      throw new AppError(
        `Model file already exists: ${modelPath}`,
        { code: 'MODEL_ALREADY_EXISTS' }
      )
    }
  }
}
