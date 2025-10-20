/*
  PATH  /src/core/modules/transporters/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types"
import { NatsModule, NatsModuleMeta } from "./NatsModule.js"

/** 
 * Meta information for transporters.
 * Used in init prompts and for display purposes.
 */
export const transporterMetas: Record<string, ModuleMeta> = {
  nats: NatsModuleMeta
}

/** 
 * Registry of all transporter factories.
 * Each key corresponds to a transporter factory that returns a ModuleDefinition.
 */
export const transporters: ModuleRegistry = {
  nats: NatsModule
}
