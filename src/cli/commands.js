/*
  PATH  /src/core/cli/commands.js
*/

import { initProject } from '../commands/init-project.js'
import { logger } from '../utils/logger.js'

/**
 * Register CLI commands
 * @param {*} program
 */
export const registerCommands = (program) => {
  // Init command
  program
    .command('init')
    .description('Initialize a new Moleculer project')
    .option('--dry-run', 'Simulate project generation without creating files')
    .action(async (opts) => {
      try {
        logger.info('🚀 Starting project initialization...')
        const result = await initProject({ dryRun: opts.dryRun })

        if (result.success) {
          logger.info('🎉 Project initialized successfully!')
          logger.info('Project settings:\n', result.data)
        } else {
          logger.error('❌ Failed to initialize project')
          process.exitCode ||= 1
        }
      } catch (err) {
        logger.error('❌ Unexpected error during init:', err)
        process.exitCode ||= 1
      }
    })

  // (Futur) Add command
  program
    .command('add-service')
    .description('Add a new service to an existing Moleculer.js project')
    .action(async (type, name) => {
      logger.info(`Adding new ${type}: ${name}`)
      // TODO
    })
}
