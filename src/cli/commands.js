/*
  PATH  /src/core/cli/commands.js
*/

import { addService } from '../commands/add-service.js'
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
    .option('--dry-run', 'Simulate service generation without creating files')
    .action(async (opts) => {
      try {
        const result = await addService({ dryRun: opts.dryRun })
        if (result.success) {
          logger.info('🎉 Service added successfully!')
          logger.info('Service settings:\n', result.data)
        } else {
          logger.error('❌ Failed to add new service')
          process.exitCode ||= 1
        }
      } catch (err) {
        logger.error('❌ Unexpected error during add service:', err)
        process.exitCode ||= 1
      }
    })
}
