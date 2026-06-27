/*
  PATH      /src/config/modules/database.config.js
  Purpose   Exports database configuration for Moleculer. Default : MongoDB
*/
module.exports = () => {
  const type = process.env.APP_DB_TYPE
  const hostname = process.env.APP_DB_HOSTNAME
  const port = process.env.APP_DB_PORT

  return {
    db: {
      type,
      port,
      host: hostname,
      url: `${type}://${hostname}:${port}`,
      user: process.env.APP_DB_USERNAME,
      pass: process.env.APP_DB_PASSWORD
    }
  }
}
