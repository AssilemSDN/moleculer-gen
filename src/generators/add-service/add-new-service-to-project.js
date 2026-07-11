/*
  PATH /src/generators/add-service/add-new-service-to-project.js
*/
import path from 'path'
import { exists } from '../../utils/fs-helpers.js'
import { generateNewService } from './generate-new-service.js'
import { AppError } from '../../errors/AppError.js'

export const addNewServiceToProject = async ({
  projectNameSanitized,
  serviceConfig,
  templateDir,
  projectDir,
  dryRun = false
}) => {
  const serviceDir = path.join(
    projectDir,
    'src/services',
    serviceConfig.serviceDirectoryName
  )

  if (await exists(serviceDir)) {
    throw new AppError(
      `Service directory already exists: ${serviceDir}`,
      {
        code: 'SERVICE_ALREADY_EXISTS'
      }
    )
  }

  const dockerServicePath = path.join(
    projectDir,
    'docker',
    'services',
    `${serviceConfig.serviceDirectoryName}.yaml`
  )

  if (await exists(dockerServicePath)) {
    throw new AppError(
      `Docker service already exists: ${dockerServicePath}`,
      {
        code: 'SERVICE_ALREADY_EXISTS'
      }
    )
  }

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
        `Model already exists: ${modelPath}`,
        {
          code: 'MODEL_ALREADY_EXISTS'
        }
      )
    }
  }

  await generateNewService(
    projectNameSanitized,
    serviceConfig,
    templateDir,
    projectDir,
    serviceDir,
    { dryRun }
  )

  return serviceConfig
}
