/*
  PATH  /src/core/modules/plugins/PrometheusModule.ts
*/
import { ModuleDefinition, ModuleMeta } from "../types"

export const PrometheusModuleMeta: ModuleMeta = {
  key: "prometheus",
  name: "Prometheus",
  description: "Monitoring for Moleculer services.",
  category: "plugin",
  enabledByDefault: false,
}


interface PrometheusModuleOptions {
  /** Slugified project name, e.g., "myapp" */
  projectNameSanitized: string
  needsTraefikLabels: boolean
}

export const PrometheusModule = ({
  needsTraefikLabels = false,
  projectNameSanitized
}: PrometheusModuleOptions): ModuleDefinition => ({
  meta: PrometheusModuleMeta,
  docker: {
    serviceName: 'prometheus',
    image: '${DOCKER_IMAGE_NAME_MONITORING}:${DOCKER_IMAGE_TAG_MONITORING}',
    container_name: '${DOCKER_CONTAINER_NAME_MONITORING}',
    networks: [ 'backend' ],
    volumes: [
      "./docker/config/prometheus.yml:/etc/prometheus/prometheus.yml:ro",
      "prometheus_data:/prometheus"
    ],
    labels: 
      needsTraefikLabels ? [
      "traefik.enable=true",
      "traefik.http.routers.prometheus.rule=Host(`${DOCKER_CONTAINER_NAME_MONITORING}.local`)",
      "traefik.http.routers.prometheus.entrypoints=web",
      "traefik.http.services.prometheus.loadbalancer.server.port=9090"
      ] : [],
    global: {
      volumes: { prometheus_data: {} }
    }
  },
  env: {
    'DOCKER_CONTAINER_NAME_MONITORING': 'prometheus',
    'DOCKER_IMAGE_NAME_MONITORING': 'prom/prometheus',
    'DOCKER_IMAGE_TAG_MONITORING': 'v3.7.3'
  },
  templates: [
    { 
      templatePath: 'config/prometheus.mustache', 
      outputPath: 'docker/config/prometheus.yml',
      data: { projectNameSanitized }
    }
  ]
})
