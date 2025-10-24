/*
  PATH  /src/core/generator/convert-moduleule-to-docker-and-env.js
*/

/**
 * Converts a ModuleDefinition into a Docker Compose service definition
 * and corresponding environment variable lines.
 *
 * @param {ModuleDefinition} module - The moduleule definition to convert
 * @returns {{
 *   service: Record<string, object>, // Docker Compose service object
 *   envLines: string[]               // Lines for .env file
 * }}
 */
export const ConvertModuleToDockerAndEnv = (module) => {
  const service = {
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

  const envLines = Object.entries(module.env).map(([k, v]) => `${k}=${v}`)
  return { service, envLines }
}
