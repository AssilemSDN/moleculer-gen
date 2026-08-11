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

export const modulesRegistry = {
  database: databases,
  transporter: transporters,
  plugin: plugins,
} satisfies Record<StaticModuleCategory, ModuleRegistry>

export type RegisteredModuleCategory = keyof typeof modulesRegistry

export type ModuleKey<C extends RegisteredModuleCategory> = keyof typeof modulesRegistry[C]