/*
  PATH /src/modules/databases/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { MongoDBModule, MongoDBModuleMeta } from "./MongoDBModule.js"

/** 
 * Meta information for databases.
 * Used in init prompts and for display purposes.
 */
export const databaseMetas: Record<string, ModuleMeta> = {
  mongodb: MongoDBModuleMeta
}

/** 
 * Registry of all databases factories.
 * Each key corresponds to a database factory that returns a ModuleDefinition.
 */
export const databases: ModuleRegistry = {
  mongodb: MongoDBModule,
}