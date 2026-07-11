/*
  PATH /src/generators/add-service/add-new-service-to-project.js
*/
import path from 'path'
import { generateNewService } from './generate-new-service.js'
import { validateServiceCanBeAdded } from '../../validators/add-service/validate-service-can-be-added.js'

export const addNewServiceToProject = async ({
  projectNameSanitized,
  serviceConfig,
  templateDir,
  projectDir,
  moleculerGenConfig,
  dryRun = false
}) => {
  const serviceDir = path.join(
    projectDir,
    'src',
    'services',
    serviceConfig.serviceDirectoryName
  )

  await validateServiceCanBeAdded({
    projectDir,
    serviceConfig,
    moleculerGenConfig
  })

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
