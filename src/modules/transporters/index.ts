/*
  PATH /src/modules/transporters/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { NatsModule, NatsModuleMeta } from "./NatsModule.js"


/** 
 * Registry of all transporter factories.
 * Each key corresponds to a transporter factory that returns a ModuleDefinition.
 */
export const transporters = {
  nats: {
    factory: NatsModule,
    meta: NatsModuleMeta
  },
} satisfies ModuleRegistry


export type TransporterKey = keyof typeof transporters

/** 
 * Meta information for transporters.
 * Used in init prompts and for display purposes.
 */
export const transporterMetas = {
  nats: NatsModuleMeta
} satisfies Record<string, ModuleMeta> 


