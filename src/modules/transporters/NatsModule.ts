/*
  PATH  /src/core/modules/transporters/NatsModule.ts
*/

import { ModuleMeta, ModuleDefinition } from "../types"

export const NatsModuleMeta: ModuleMeta = {
  key: "nats",
  name: "NATS Message Broker",
  description: "Handles pub/sub communication between Moleculer services.",
  category: "transporter",
  enabledByDefault: true,
}

export const NatsModule: () => ModuleDefinition = () => ({
  meta: NatsModuleMeta,
  docker: {
    serviceName: "nats",
    image: "${DOCKER_IMAGE_NAME_TRANSPORTER}:${DOCKER_IMAGE_TAG_TRANSPORTER}",
    container_name: "nats",
    networks: ["backend"],
    volumes: [],
    depends_on: [],
    restart: "unless-stopped",
  },
  env: {
    APP_TRANSPORTER_TYPE: "nats",
    APP_TRANSPORTER_HOSTNAME: "nats",
    APP_TRANSPORTER_PORT: "4222",
    APP_TRANSPORTER_USERNAME: "natsusername",
    APP_TRANSPORTER_PASSWORD: "natspassword",
    DOCKER_CONTAINER_NAME_TRANSPORTER: "nats",
    DOCKER_IMAGE_NAME_TRANSPORTER: "nats",
    DOCKER_IMAGE_TAG_TRANSPORTER: "2.11.1-alpine",
  },
})
