/*
  PATH  /src/core/modules/transporters/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { MongoDBModule, MongoDBModuleMeta } from "./MongoDBModule.js"

/** 
 * Meta information for transporters.
 * Used in init prompts and for display purposes.
 */
export const databaseMetas: Record<string, ModuleMeta> = {
  mongodb: MongoDBModuleMeta
}

/** 
 * Registry of all transporter factories.
 * Each key corresponds to a transporter factory that returns a ModuleDefinition.
 */
export const databases: ModuleRegistry = {
  mongodb: MongoDBModule,
}