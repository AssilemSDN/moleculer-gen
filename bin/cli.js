#!/usr/bin/env node

/*
  PATH  /bin/cli.js
*/
import { program } from 'commander'
import { initProject } from '../src/core/commands/init-project.js'
import { logger } from '../src/core/utils/logger.js'

// CLI definition
program
  .name('moleculer-gen')
  .description('Moleculer project generator')
  .version('0.0.1')

// Options
program
  .option('--debug', 'Enable debug logging')
  .option('--verbose', 'Enable verbose logging (info level)')
  .option('--quiet', 'Only show errors')

program
  .helpOption('-h, --help', 'Display help for command')
  .addHelpText('beforeAll', `🔹 Moleculer-Gen CLI
Generate Moleculer projects and Moleculer services easily.

Usage examples:
  $ moleculer-gen init
`)

// init command
program
  .command('init')
  .description('Initialize a new Moleculer project')
  .action(async () => {
    logger.debug('🔧 Logger level set to:', logger.level)
    logger.info('🚀 Starting project initialization...')
    // launch init
    const result = await initProject()
    if (result.success) {
      logger.info('🎉 Project initialized successfully!')
      logger.info('Project settings:\n', result.data)
    } else {
      logger.error('❌ Failed to initialize project')
      process.exitCode ||= 1
    }
  })

program.parse()

// Log levels
const opts = program.opts()
logger.level = opts.debug ? 'debug' : opts.verbose ? 'info' : opts.quiet ? 'error' : 'warn'
logger.debug('🔧 Logger level set to:', logger.level)
