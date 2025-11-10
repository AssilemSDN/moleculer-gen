/*
  PATH  /src/core/modules/plugins/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { PrometheusModuleMeta } from "./PrometheusModule.js"
import { TraefikModuleMeta, TraefikModule } from "./TraefikModule.js"

/** 
 * Meta information for plugins.
 * Used in init prompts and for display purposes.
 */
export const pluginMetas: Record<string, ModuleMeta> = {
  nats: TraefikModuleMeta,
  prometheus: PrometheusModuleMeta
}

/** 
 * Registry of all plugins factories.
 * Each key corresponds to a transporter factory that returns a ModuleDefinition.
 */
export const plugins: ModuleRegistry = {
  traefik: TraefikModule,
}
