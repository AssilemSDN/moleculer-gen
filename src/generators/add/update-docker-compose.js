import path from 'path'
import { mkdirp, exists, writeYAML } from '../../utils/fs-helpers.js'
import { ServiceModule } from '../../../dist/modules/backend-services/ServiceModule.js'
import { AppError } from '../../errors/AppError.js'

export const updateDockerCompose = async (projectNameSanitized, serviceDirectoryName) => {
  // 1- Check docker-compose.yaml exists (sanity check, we're in the right project)
  const projectDir = process.cwd()
  const composePath = path.join(projectDir, 'docker-compose.yaml')
  if (!await exists(composePath)) {
    throw new AppError(`docker-compose.yaml not found at ${composePath}`, { code: 'DOCKER_COMPOSE_NOT_FOUND' })
  }

  // 2- Build a new service module definition
  const module = ServiceModule({
    projectNameSanitized,
    serviceName: serviceDirectoryName
  })

  // 3- Build the service YAML content
  const serviceYaml = {
    services: {
      [module.docker.serviceName]: {
        image: module.docker.image,
        container_name: module.docker.container_name,
        environment: module.docker.environment,
        networks: module.docker.networks,
        volumes: module.docker.volumes,
        ports: module.docker.ports,
        command: module.docker.command,
        depends_on: module.docker.depends_on,
        labels: module.docker.labels,
        env_file: module.docker.env_file,
        security_opt: module.docker.security_opt,
        restart: module.docker.restart
      }
    }
  }

  // 4- Write to docker/services/<serviceDirectoryName>.yaml
  const serviceYamlDir = path.join(projectDir, 'docker/services')
  await mkdirp(serviceYamlDir)

  const serviceYamlPath = path.join(serviceYamlDir, `${serviceDirectoryName}.yaml`)
  if (await exists(serviceYamlPath)) {
    throw new AppError(`Service YAML already exists: ${serviceYamlPath}`, { code: 'SERVICE_ALREADY_EXISTS' })
  }

  await writeYAML(serviceYamlPath, serviceYaml)
}
