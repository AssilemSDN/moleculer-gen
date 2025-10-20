/*
  PATH  /src/core/modules/backend-services/ServiceModule.ts
*/
import { ModuleDefinition, ModuleMeta, DockerConfigExtended } from "../types"

interface ServiceModuleOptions {
  /** Slugified project name, e.g., "myapp" */
  projectNameSanitized: string
  /** Name of the service, e.g., "User Service" */
  serviceName: string
  /** Optional array of Docker service names this service depends on */
  dependsOn?: string[]
  /** Optional Docker labels for the service */
  labels?: Record<string, string>
}

/**
 * Factory function to generate a Moleculer backend service module
 * with Docker configuration and environment variables.
 *
 * @param options - Configuration options for the service
 * @returns ModuleDefinition - Complete module definition for code generation
 */
export const ServiceModule = ({
  projectNameSanitized,
  serviceName,
  dependsOn = [],
  labels = {}
}: ServiceModuleOptions): ModuleDefinition => {
  const serviceNameSanitized = serviceName.trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

  const meta: ModuleMeta = {
    key: serviceNameSanitized,
    name: `${serviceName} Service`,
    description: `${serviceName} Moleculer.js Service`,
    category: 'backend-service',
    enabledByDefault: true
  }

  const docker: DockerConfigExtended = {
    serviceName: `${projectNameSanitized}-${serviceNameSanitized}`,
    container_name: "${DOCKER_CONTAINER_BASENAME_APP}-"+`${serviceNameSanitized}`,
    image: '${DOCKER_IMAGE_NAME_APP}:${DOCKER_IMAGE_TAG_APP}',
    command: [
      "node_modules/.bin/moleculer-runner",
      "--config",
      "./src/config/moleculer.config.js",
      "-E",
      "${DOCKER_ENV_FILE_APP}",
      `./src/services/${serviceNameSanitized}`
    ],
    env_file: ['${DOCKER_ENV_FILE_APP}'],
    networks: ['backend'],
    depends_on: dependsOn,
    restart: 'unless-stopped',
    labels
  }

  const env = {
    'DOCKER_CONTAINER_BASENAME_APP':`${projectNameSanitized}`,
    'DOCKER_IMAGE_NAME_APP':`${projectNameSanitized}`,
    'DOCKER_IMAGE_TAG_APP':"0.0.1"
  }
  return { meta, docker, env }
}
