/*
  PATH /src/generators/add-service/add-new-service-to-project.js
*/

import path from 'path'

import { generateNewService } from './generate-new-service.js'
import { validateServiceCanBeAdded } from '../../validators/add-service/validate-service-can-be-added.js'
import { resolvePathInside } from '../../utils/fs-helpers.js'

export const addNewServiceToProject = async ({
  projectNameSanitized,
  serviceConfig,
  templateDir,
  projectDir,
  moleculerGenConfig,
  dryRun = false
}) => {
  const servicesDir = path.join(
    projectDir,
    'src',
    'services'
  )

  const serviceDir = resolvePathInside(
    servicesDir,
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
