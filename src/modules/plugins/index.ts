/*
  PATH /src/modules/plugins/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { PrometheusModule, PrometheusModuleMeta } from "./PrometheusModule.js"
import { TraefikModuleMeta, TraefikModule } from "./TraefikModule.js"

/** 
 * Registry of all plugins factories.
 * Each key corresponds to a plugin factory that returns a ModuleDefinition.
 */
export const plugins = {
  traefik: {
    factory: TraefikModule,
    meta: TraefikModuleMeta,
  },

  prometheus: {
    factory: PrometheusModule,
    meta: PrometheusModuleMeta,
  },
} satisfies ModuleRegistry
