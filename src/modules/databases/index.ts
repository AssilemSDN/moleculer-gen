/*
  PATH /src/modules/databases/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { MongoDBModule, MongoDBModuleMeta } from "./MongoDBModule.js"

/** 
 * Registry of all databases factories.
 * Each key corresponds to a database factory that returns a ModuleDefinition.
 */
export const databases = {
  mongodb: {
    factory: MongoDBModule,
    meta: MongoDBModuleMeta,
  },
} satisfies ModuleRegistry
