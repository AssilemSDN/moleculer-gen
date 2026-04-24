/*
  PATH /src/utils/docker-helpers.js
*/

const omitEmpty = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && !(Array.isArray(v) && v.length === 0))
  )

/**
 * Builds a Docker service object from a DockerConfig definition.
 * @param {import('../modules/types.js').DockerConfig} docker
 * @returns {Record<string, object>} - Keyed by service name, ready to merge into a `services:` block
 */
export const buildDockerService = (docker) => ({
  [docker.serviceName]: omitEmpty({
    image: docker.image,
    container_name: docker.container_name,
    environment: docker.environment,
    networks: docker.networks,
    volumes: docker.volumes,
    ports: docker.ports,
    command: docker.command,
    depends_on: docker.depends_on,
    labels: docker.labels,
    env_file: docker.env_file,
    security_opt: docker.security_opt,
    restart: docker.restart
  })
})
