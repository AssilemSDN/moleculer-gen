import { ModuleDefinition } from "../types";
import { ServiceModule } from "./ServiceModule.js";

interface ApiGatewayModuleOptions {
  /** Slugified project name, e.g., "myapp" */
  projectNameSanitized: string
  /** Exposed port e.g., "5000" */
  port: string
  /** If needs traefik labels */
  needsTraefikLabels: boolean
  /** Optional array of Docker service names this service depends on */
  dependsOn?: string[]
}

export const ApiGatewayModule = ({
  projectNameSanitized,
  port = '5000',
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
  base.env.APP_MOLECULER_API_GATEWAY_PORT = port
  base.env.DOCKER_ENV_FILE_APP = '.env.dev'
  return { meta: base.meta, docker: base.docker, env: base.env }
}