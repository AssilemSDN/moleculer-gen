/*
  PATH  /src/core/cli/options.js
*/
import { logger } from '../utils/logger.js'

/**
 * Define global CLI options and logging behavior
 * @param {*} program
 */
export const registerGlobalOptions = (program) => {
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
  $ moleculer-gen add module MyModule
`)
}

export const applyLoggerLevel = (program) => {
  const opts = program.opts()
  logger.level = opts.debug
    ? 'debug'
    : opts.verbose
      ? 'info'
      : opts.quiet
        ? 'error'
        : 'warn'

  logger.debug('🔧 Logger level set to:', logger.level)
}
