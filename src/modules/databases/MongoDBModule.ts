/*
  PATH  /src/core/modules/databases/MongoDBModule.ts
*/
import { ModuleDefinition, ModuleMeta } from "../types"

export const MongoDBModuleMeta: ModuleMeta = {
  key: "mongodb",
  name: "MongoDB",
  description: "A NoSQL database used to store persistent application data.",
  category: "database",
  enabledByDefault: true,
}

export const MongoDBModule: () => ModuleDefinition = (): ModuleDefinition => ({
  meta: MongoDBModuleMeta,

  docker: {
    serviceName: "mongo",
    image: "${DOCKER_IMAGE_NAME_DB}:${DOCKER_IMAGE_TAG_DB}",
    container_name: "mongo",
    environment: {
      MONGO_INITDB_ROOT_USERNAME: "${APP_DB_USERNAME}",
      MONGO_INITDB_ROOT_PASSWORD: "${APP_DB_PASSWORD}",
    },
    networks: ["backend"],
    volumes: ["db_data:/data/db"],
    ports: [],
    command: [],
    depends_on: [],
    security_opt: [],
    restart: "always",
  },

  env: {
    APP_DB_TYPE:"mongodb",
    APP_DB_HOSTNAME: "mongo",
    APP_DB_PORT: "27017",
    APP_DB_USERNAME: "root",
    APP_DB_PASSWORD: "rootpassword",
    DOCKER_IMAGE_NAME_DB: "mongo",
    DOCKER_IMAGE_TAG_DB: "8.0.6",
  },
})
