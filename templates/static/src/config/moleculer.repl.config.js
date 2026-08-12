const config = require('./application.config').moleculer

module.exports = {
  ...config,
  transporter: null
}
