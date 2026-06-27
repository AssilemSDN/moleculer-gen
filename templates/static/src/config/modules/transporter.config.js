/*
  PATH      /src/config/modules/transporter.config.js
  Purpose   Exports transporter configuration for Moleculer. Default : NATS
*/
module.exports = () => {
  const type = process.env.APP_TRANSPORTER_TYPE || 'NATS'
  const protocol = process.env.APP_TRANSPORTER_PROTOCOL || 'nats'
  const hostname = process.env.APP_TRANSPORTER_HOSTNAME || 'nats'
  const port = process.env.APP_TRANSPORTER_PORT || '4222'

  const username = process.env.APP_TRANSPORTER_USERNAME
  const password = process.env.APP_TRANSPORTER_PASSWORD

  const options = {
    url: `${protocol}://${hostname}:${port}`
  }

  if (username) {
    options.user = username
  }

  if (password) {
    options.pass = password
  }

  return {
    moleculer: {
      transporter: {
        type: type.toUpperCase(),
        options
      }
    }
  }
}
