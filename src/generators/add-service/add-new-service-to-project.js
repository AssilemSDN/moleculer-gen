/*
  PATH /src/generators/add-service/add-new-service-to-project.js
*/
import path from 'path'
import { ensureEmptyDir } from '../../utils/fs-helpers.js'
import { generateNewService } from './generate-new-service.js'

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

  await ensureEmptyDir(serviceDir)

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
