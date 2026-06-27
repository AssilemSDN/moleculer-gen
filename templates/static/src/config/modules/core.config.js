/*
  PATH      /src/config/modules/core.config.js
  Purpose   Exports core configuration for Moleculer.
*/
module.exports = () => ({
  moleculer: {
    port: process.env.APP_MOLECULER_API_GATEWAY_PORT || '5000',
    host: process.env.APP_MOLECULER_API_HOSTNAME || '0.0.0.0',
    namespace: process.env.NODE_ENV || 'development',
    logger: process.env.APP_MOLECULER_LOGGER === 'true',
    logLevel: process.env.APP_MOLECULER_LOG_LEVEL || 'info'
  },
  nodeEnv: process.env.NODE_ENV || 'development'
})
