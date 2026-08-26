/*
  PATH /src/generators/add-service/update-docker-compose.js
*/
import path from 'path'

import {
  mkdirp,
  exists,
  writeYAML
} from '../../utils/fs-helpers.js'

import { ServiceModule } from '../../../dist/modules/backend-services/ServiceModule.js'
import { AppError } from '../../errors/AppError.js'
import { ErrorCodes } from '../../errors/error-codes.js'
import { buildDockerService } from '../../utils/docker-helpers.js'

/**
 * Add a Docker Compose service YAML file for a generated service.
 *
 * Convention:
 * - serviceDirectoryName is used as the Docker Compose service name.
 * - The generated file is docker/services/<serviceDirectoryName>.yaml.
 *
 * @param {string} projectNameSanitized Sanitized project name.
 * @param {string} serviceDirectoryName Generated service directory name.
 * @param {string} projectDir Project root directory.
 */
export const updateDockerCompose = async (
  projectNameSanitized,
  serviceDirectoryName,
  projectDir = process.cwd()
) => {
  const dockerServiceName = serviceDirectoryName

  // 1. Ensure docker-compose.yaml exists
  const composePath = path.join(projectDir, 'docker-compose.yaml')

  if (!(await exists(composePath))) {
    throw new AppError(
      `docker-compose.yaml not found at ${composePath}`,
      { code: ErrorCodes.PROJECT_FILE_NOT_FOUND }
    )
  }

  // 2. Build Docker service module definition
  const module = ServiceModule({
    projectNameSanitized,
    serviceName: dockerServiceName
  })

  // 3. Build YAML content
  const serviceYaml = {
    services: buildDockerService(module.docker)
  }

  // 4. Write docker/services/<serviceDirectoryName>.yaml
  const serviceYamlDir = path.join(
    projectDir,
    'docker',
    'services'
  )

  await mkdirp(serviceYamlDir)

  const serviceYamlPath = path.join(
    serviceYamlDir,
    `${dockerServiceName}.yaml`
  )

  if (await exists(serviceYamlPath)) {
    throw new AppError(
      `Docker service YAML already exists: ${serviceYamlPath}`,
      { code: ErrorCodes.DOCKER_SERVICE_ALREADY_EXISTS }
    )
  }

  await writeYAML(serviceYamlPath, serviceYaml)
}
