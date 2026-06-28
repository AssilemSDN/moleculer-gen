/*
  PATH /src/cli/commands.js
*/
import { addService } from '../commands/add-service.js'
import { initProject } from '../commands/init-project.js'
import { validateProject } from '../commands/validate-project.js'
import { runCommand } from '../utils/command-runner.js'

/**
 * Register CLI commands
 * @param {*} program
 */
export const registerCommands = (program) => {
  program
    .command('init')
    .description('Initialize a new Moleculer project')
    .argument('[config-file]', 'Path to a JSON config file')
    .option('--dry-run', 'Simulate project generation without creating files')
    .action(async (configFile, opts) =>
      runCommand('project initialization', initProject, {
        dryRun: opts.dryRun,
        configFile
      })
    )

  program
    .command('add-service')
    .description('Add a new service to an existing Moleculer.js project')
    .argument('[config-file]', 'Path to a JSON config file')
    .option('--dry-run', 'Simulate service generation without creating files')
    .action(async (configFile, opts) =>
      runCommand('service addition', addService, {
        dryRun: opts.dryRun,
        configFile
      })
    )

  program
    .command('validate')
    .description('Validate the generated Moleculer project consistency')
    .action(async () => runCommand('project validation', validateProject, {}))
}