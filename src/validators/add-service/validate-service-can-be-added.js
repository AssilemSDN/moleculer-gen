/*
  PATH /src/validators/project/validate-service-can-be-added.js
*/
import path from 'path'

import { exists } from '../../utils/fs-helpers.js'
import { AppError } from '../../errors/AppError.js'

export const validateServiceCanBeAdded = async ({
  projectDir,
  serviceConfig,
  moleculerGenConfig
}) => {
  // Check if service already declared in moleculer-gen config
  const existingService = moleculerGenConfig.services[serviceConfig.serviceName]

  if (existingService !== undefined && existingService !== null) {
    throw new AppError(
      `Service "${serviceConfig.serviceName}" already declared in .moleculer-gen/config.json`,
      { code: 'SERVICE_ALREADY_EXISTS' }
    )
  }

  // Check if service directory already exists
  const serviceDir = path.join(
    projectDir,
    'src',
    'services',
    serviceConfig.serviceDirectoryName
  )

  if (await exists(serviceDir)) {
    throw new AppError(
      `Service directory already exists: ${serviceDir}`,
      { code: 'SERVICE_ALREADY_EXISTS' }
    )
  }

  // Check if docker service file already exists
  const dockerServicePath = path.join(
    projectDir,
    'docker',
    'services',
    `${serviceConfig.serviceName}.yaml`
  )

  if (await exists(dockerServicePath)) {
    throw new AppError(
      `Docker service file already exists: ${dockerServicePath}`,
      { code: 'SERVICE_ALREADY_EXISTS' }
    )
  }

  // Check if model file already exists (if service is CRUD)
  if (serviceConfig.isCrud) {
    const modelPath = path.join(
      projectDir,
      'src',
      'data',
      'model',
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
