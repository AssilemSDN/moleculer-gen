/*
  PATH /src/modules/plugins/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { PrometheusModule, PrometheusModuleMeta } from "./PrometheusModule.js"
import { TraefikModuleMeta, TraefikModule } from "./TraefikModule.js"

/** 
 * Registry of all plugins factories.
 * 
 * Each entry contains the module factory and its metadata.
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
