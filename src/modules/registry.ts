/*
  PATH /src/modules/registry.ts
*/
import { databases } from './databases/index.js'
import { plugins } from './plugins/index.js'
import { transporters } from './transporters/index.js'

import type {
  ModuleRegistry,
  StaticModuleCategory,
} from './types.js'

/**
 * Central registry of all statically available modules.
 *
 * Module categories expose their registered modules as entries containing
 * both the factory used for generation and the metadata used by consumers
 * such as prompts and configuration validation.
 *
 * Backend services are excluded because they are created dynamically from
 * the project service configuration.
 */
export const modulesRegistry = {
  database: databases,
  transporter: transporters,
  plugin: plugins,
} satisfies Record<StaticModuleCategory, ModuleRegistry>

/**
 * Categories available through the centralized module registry.
 */
export type RegisteredModuleCategory = keyof typeof modulesRegistry

/**
 * Registered module keys for a given category.
 *
 * @example
 * ModuleKey<'database'> // 'mongodb'
 * ModuleKey<'plugin'> // 'traefik' | 'prometheus'
 */
export type ModuleKey<C extends RegisteredModuleCategory> = keyof typeof modulesRegistry[C]