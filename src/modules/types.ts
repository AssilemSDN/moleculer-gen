/*
  PATH  /src/core/modules/types.ts
*/

/**
 * Meta information used for init prompts / user selection
 */
export interface ModuleMeta {
  /** Unique identifier for the module */
  key: string
  /** Human-readable module name */
  name: string
  /** Description shown during init prompts */
  description: string
  /** Module category */
  category: 'database' | 'transporter' | 'plugin' | 'backend-service'
  /** Whether the module is enabled by default */
  enabledByDefault: boolean
}

/**
 * Docker configuration for a module
 */
export interface DockerConfig {
  /** Name of the Docker service */
  serviceName: string
  /** Docker image to use */
  image: string
  /** Optional container name */
  container_name?: string
  /** Environment variables for the container */
  environment?: Record<string, string>
  /** Docker networks */
  networks?: string[]
  /** Docker volumes */
  volumes?: string[]
  /** Ports exposed by the container to other containers */
  expose?: number | string
  /** Ports exposed by the container from the outside, e.g., 5000 or "5000:5000" */
  ports?: Array<number | string>
  /** Additional command to run inside the container */
  command?: string[]
  /** Services this container depends on */
  depends_on?: string[]
  /** Optional Docker labels (useful for Traefik or other orchestrators) */
  labels?: string[]
  /** Optional env files */
  env_file?: string[]
  /** Security options for the container */
  security_opt?: string[]
  /** Restart policy for the container */
  restart?: 'no' | 'on-failure' | 'always' | 'unless-stopped'
}

/**
 * Complete module definition
 */
export interface ModuleDefinition {
  /** Static meta information for init prompts */
  meta: ModuleMeta
  /** Docker configuration for this module */
  docker: DockerConfig
  /** Environment variables for the module, written to .env files */
  env: Record<string, string>
}

/**
 * Factory function that produces a ModuleDefinition
 */
export type ModuleFactory = (...args: any[]) => ModuleDefinition

/**
 * Registry of all available modules
 */
export type ModuleRegistry = Record<string, ModuleFactory>