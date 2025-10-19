/*
  PATH      /src/config/moleculer.config.js
  Purpose   Exports Moleculer-specific configuration from main app config
*/
const {
  namespace,
  logger,
  logLevel,
  transporter
} = require('./application.config').moleculer

module.exports = {
  namespace,
  logger,
  logLevel,
  transporter
}
