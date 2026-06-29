/*
  PATH /src/modules/backend-services/ApiGatewayModule.ts
*/
import { ModuleDefinition } from "../types.js";
import { ServiceModule } from "./ServiceModule.js";

interface ApiGatewayModuleOptions {
  /** Slugified project name, e.g., "myapp" */
  projectNameSanitized: string
  /** Internal API Gateway port, e.g., "5000" */
  port?: string
  /** Host port used when Traefik is disabled, e.g., "5000" */
  hostPort?: string
  /** If needs traefik labels */
  needsTraefikLabels?: boolean
  /** Optional array of Docker service names this service depends on */
  dependsOn?: string[]
}

export const ApiGatewayModule = ({
  projectNameSanitized,
  port = '5000',
  hostPort = '5000',
  needsTraefikLabels = false,
  dependsOn = []
}: ApiGatewayModuleOptions): ModuleDefinition => {
  const base = ServiceModule({ projectNameSanitized, serviceName: 'Api Gateway', dependsOn, labels: 
    needsTraefikLabels?[
      "traefik.enable=true",
      "traefik.http.routers.api.rule=Host(`${DOCKER_CONTAINER_BASENAME_APP}.local`)",
      "traefik.http.routers.api.entrypoints=web",
      "traefik.http.services.api.loadbalancer.server.port=${APP_MOLECULER_API_GATEWAY_PORT}"  
    ]:[]
  })
  base.docker.expose = "${APP_MOLECULER_API_GATEWAY_PORT}"
  // If traefik labels are not needed, we need to expose the port directly
  if (!needsTraefikLabels) {
    base.docker.networks = [
      'public',
      'backend'
    ]
    base.docker.ports = [
      '127.0.0.1:${APP_MOLECULER_API_GATEWAY_HOST_PORT}:${APP_MOLECULER_API_GATEWAY_PORT}'
    ]
  }
  base.env.APP_MOLECULER_API_GATEWAY_PORT = port
  base.env.APP_MOLECULER_API_GATEWAY_HOST_PORT = hostPort
  base.env.DOCKER_ENV_FILE_APP = '.env.dev'
  return { meta: base.meta, docker: base.docker, env: base.env }
}