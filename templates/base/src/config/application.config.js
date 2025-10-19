/*
  PATH      /src/config/application.config.js
*/
require('dotenv').config()

const {
  APP_MOLECULER_API_HOSTNAME = '0.0.0.0',
  APP_MOLECULER_API_GATEWAY_PORT = '5000',
  APP_MOLECULER_LOGGER,
  APP_MOLECULER_LOG_LEVEL = 'info',

  APP_TRANSPORTER_TYPE = 'nats',
  APP_TRANSPORTER_HOSTNAME = 'nats',
  APP_TRANSPORTER_PORT = '4222',
  APP_TRANSPORTER_USERNAME,
  APP_TRANSPORTER_PASSWORD,

  APP_DB_TYPE,
  APP_DB_HOSTNAME,
  APP_DB_PORT,
  APP_DB_USERNAME,
  APP_DB_PASSWORD,

  NODE_ENV = 'development'
} = process.env

module.exports = {
  moleculer: {
    port: APP_MOLECULER_API_GATEWAY_PORT,
    host: APP_MOLECULER_API_HOSTNAME,
    namespace: NODE_ENV,
    logger: APP_MOLECULER_LOGGER === 'true',
    logLevel: APP_MOLECULER_LOG_LEVEL,
    transporter: {
      type: APP_TRANSPORTER_TYPE,
      options: {
        url: `${APP_TRANSPORTER_TYPE}://${APP_TRANSPORTER_HOSTNAME}:${APP_TRANSPORTER_PORT}`,
        user: APP_TRANSPORTER_USERNAME,
        pass: APP_TRANSPORTER_PASSWORD
      }
    }
  },
  db: {
    port: APP_DB_PORT,
    host: APP_DB_HOSTNAME,
    url: `${APP_DB_TYPE}://${APP_DB_HOSTNAME}:${APP_DB_PORT}`,
    user: APP_DB_USERNAME,
    pass: APP_DB_PASSWORD
  },
  nodeEnv: NODE_ENV
}
