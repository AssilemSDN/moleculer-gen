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

export const PrometheusModule = (
  needsTraefikLabels = false
): ModuleDefinition => ({
  meta: PrometheusModuleMeta,
  docker: {
    serviceName: 'prometheus',
    image: '${DOCKER_IMAGE_NAME_MONITORING}:${DOCKER_IMAGE_TAG_MONITORING}',
    container_name: '${DOCKER_CONTAINER_NAME_MONITORING}',
    networks: [ 'backend' ],
    volumes: [
      "./prometheus.yml:/etc/prometheus/prometheus.yml:ro",
      "prometheus_data:/prometheus"
    ],
    labels: 
      needsTraefikLabels ? [

      ] : []
  },
  env: {}
})
