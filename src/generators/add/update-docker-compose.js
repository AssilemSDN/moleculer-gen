import path from 'path'
import yaml from 'js-yaml'
import { exists, readFile, writeYAML } from '../../utils/fs-helpers.js'
import { ServiceModule } from '../../../dist/modules/backend-services/ServiceModule.js'
import { ConvertModuleToDockerAndEnv } from '../initProject/convert-module-to-docker-and-env.js'
import { AppError } from '../../errors/AppError.js'

export const updateDockerCompose = async (projectNameSanitized, serviceDirectoryName) => {
  // 1- Check docker-compose.yaml
  const projectDir = process.cwd()
  const composePath = path.join(projectDir, 'docker-compose.yaml')
  if (!await exists(composePath)) {
    throw new AppError(`docker-compose.yaml not found at ${composePath}`, { code: 'DOCKER_COMPOSE_NOT_FOUND' })
  }

  // 2- Read and parse docker-compose.yml
  const composeContent = await readFile(composePath, 'utf-8')
  const composeYaml = yaml.load(composeContent)

  // 3- Build a new service module definition
  const module = ServiceModule({
    projectNameSanitized,
    serviceName: serviceDirectoryName
  })

  // 4- Convert the module to docker-compose service + env lines
  const { service: newService } = ConvertModuleToDockerAndEnv(module)
  composeYaml.services = { ...composeYaml.services, ...newService }

  // 5- Write updated docker-compose.yml
  await writeYAML(composePath, composeYaml, { encoding: 'utf-8' })
}
