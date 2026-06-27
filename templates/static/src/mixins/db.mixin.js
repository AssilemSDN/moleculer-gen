/*
  PATH      /src/mixins/db.mixin.js
*/
const DbService = require('moleculer-db')
const MongooseAdapter = require('moleculer-db-adapter-mongoose')
const { nodeEnv } = require('../config/application.config')
const { url, user, pass } = require('../config/application.config').db

/**
 * Mixin to create Moleculer DB service using Mongoose adapter.
 * @param {Object} options
 * @param {mongoose.Model} options.model    > Mongoose model
 * @param {string} options.collection       > MongoDB collection name
 * @param {Object} [options.adapterOptions] > Additional options for MongooseAdapter
 * @returns {Object}                        > Moleculer service schema
 */
module.exports = ({ model, collection, adapterOptions }) => ({
  mixins: [DbService],
  adapter: new MongooseAdapter(url, {
    user,
    pass,
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    ...adapterOptions
  }),
  model,
  settings: {
    collection
  },
  hooks: {
    before: {
      '*' (ctx) {
        if (nodeEnv === 'development') {
          this.logger.info(`[${ctx.action.name}] ctx.params:`, JSON.stringify(ctx.params, null, 2))
        }
      }
    }
  },

  created () {
    this.logger.info(`Service '${this.name}' created.`)
  },
  started () {
    this.logger.info(`Service '${this.name}' started.`)
  },
  stopped () {
    this.logger.info(`Service '${this.name}' stopped.`)
  }
})
