/*
  PATH  /src/core/cli/commands.js
*/
import { addService } from '../commands/add-service.js'
import { initProject } from '../commands/init-project.js'
import { runCommand } from '../utils/command-runner.js'

/**
 * Register CLI commands
 * @param {*} program
 */
export const registerCommands = (program) => {
  program
    .command('init')
    .description('Initialize a new Moleculer project')
    .option('--dry-run', 'Simulate project generation without creating files')
    .option('--config <file>', 'Path to a JSON config file')
    .action((opts) => runCommand('project initialization', initProject, { dryRun: opts.dryRun, configFile: opts.config }))

  program
    .command('add-service')
    .description('Add a new service to an existing Moleculer.js project')
    .option('--dry-run', 'Simulate service generation without creating files')
    .action((opts) => runCommand('service addition', addService, { dryRun: opts.dryRun }))
}
