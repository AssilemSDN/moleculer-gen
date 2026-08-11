/*
  PATH /src/modules/transporters/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { NatsModule, NatsModuleMeta } from "./NatsModule.js"


/** 
 * Registry of all transporter factories.
 * 
 * Each entry contains the module factory and its metadata.
 */
export const transporters = {
  nats: {
    factory: NatsModule,
    meta: NatsModuleMeta
  },
} satisfies ModuleRegistry
