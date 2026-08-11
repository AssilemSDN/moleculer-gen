/*
  PATH /src/modules/databases/index.ts
*/
import { ModuleRegistry, ModuleMeta } from "../types.js"
import { MongoDBModule, MongoDBModuleMeta } from "./MongoDBModule.js"

/** 
 * Registry of all databases factories.
 * 
 * Each entry contains the module factory and its metadata.
 */
export const databases = {
  mongodb: {
    factory: MongoDBModule,
    meta: MongoDBModuleMeta,
  },
} satisfies ModuleRegistry
