/*
  PATH  /src/core/modules/plugins/TraefikModule.ts
*/
import { ModuleDefinition, ModuleMeta } from "../types"

interface TraefikModuleOptions {
  /** Slugified project name, e.g., "myapp" */
  projectNameSanitized: string
  enableDashboard: boolean,
  enableTLS: boolean
}

export const TraefikModuleMeta: ModuleMeta = {
  key: "traefik",
  name: "Traefik Reverse Proxy",
  description: "Manages HTTP routing and load balancing between services.",
  category: "plugin",
  enabledByDefault: true,
}

/**
 * Traefik module factory.
 * Returns the complete ModuleDefinition including Docker configuration and environment variables.
 *
 * @param projectNameSanitized - Slugified project name (e.g., "myapp")
 * @param enableDashboard - Whether to enable the Traefik dashboard (default: false)
 * @param enableTLS - Whether to enable HTTPS/TLS (default: false)
 * @returns {ModuleDefinition} Complete module definition for Docker and .env
 */
export const TraefikModule = ({
  projectNameSanitized,
  enableDashboard = false,
  enableTLS = false
}: TraefikModuleOptions): ModuleDefinition => ({
  meta: TraefikModuleMeta,

  docker: {
    serviceName: "traefik",
    image: "${DOCKER_IMAGE_NAME_REVERSE_PROXY}:${DOCKER_IMAGE_TAG_REVERSE_PROXY}",
    container_name: "${DOCKER_CONTAINER_NAME_REVERSE_PROXY}",
    networks: ["publique", "backend"],
    volumes: ["/var/run/docker.sock:/var/run/docker.sock:ro"],
    ports: ([] as string[]).concat(
      "80:80",
      enableTLS ? ["443:443"] : [],
      enableDashboard ? ["8080:8080"] : []
    ),
    command: ([] as string[]).concat(
      "--providers.docker=true",
      "--providers.docker.exposedbydefault=false",
      "--entrypoints.web.address=:80",
      enableTLS ? ["--entrypoints.websecure.address=:443"] : [],
      enableDashboard ? ["--api.insecure=true"] : []
    ),
    security_opt: ["no-new-privileges:true"],
    restart: "unless-stopped",
    depends_on: [],
  },

  env: {
    DOCKER_CONTAINER_NAME_REVERSE_PROXY: "traefik",
    DOCKER_IMAGE_NAME_REVERSE_PROXY: "traefik",
    DOCKER_IMAGE_TAG_REVERSE_PROXY: "v3.3",
    APP_MOLECULER_API_DOMAIN: `${projectNameSanitized}.local`,
  },
})
