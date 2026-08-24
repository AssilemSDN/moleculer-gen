/*
  PATH /src/cli/commands.js
*/

import { addService } from '../commands/add-service.js'
import { addServices } from '../commands/add-services.js'
import { initProject } from '../commands/init-project.js'
import { validateProject } from '../commands/validate-project.js'

import { runCommand } from '../utils/command-runner.js'

export const registerCommands = (program) => {
  program
    .command('init')
    .description('Initialize a new Moleculer project')
    .argument('[config-file]', 'Path to a JSON config file')
    .option('--dry-run', 'Simulate project generation without creating files')
    .action(async (configFile, opts) =>
      runCommand(
        'project initialization',
        initProject,
        {
          dryRun: opts.dryRun,
          configFile
        },
        {
          successMessage: opts.dryRun
            ? 'Project initialization simulated'
            : 'Project initialized'
        }
      )
    )

  program
    .command('add-service')
    .description('Add a new service to an existing Moleculer.js project')
    .argument('[config-file]', 'Path to a JSON config file')
    .option('--dry-run', 'Simulate service generation without creating files')
    .action(async (configFile, opts) =>
      runCommand(
        'service addition',
        addService,
        {
          dryRun: opts.dryRun,
          configFile
        },
        {
          successMessage: opts.dryRun
            ? 'Service addition simulated'
            : 'Service added'
        }
      )
    )

  program
    .command('add-services')
    .description('Add multiple services to an existing Moleculer.js project')
    .argument('[config-file]', 'Path to a JSON config file')
    .option('--dry-run', 'Simulate service generation without creating files')

    .action(async (configFile, opts) =>
      runCommand(
        'services addition',
        addServices,
        {
          dryRun: opts.dryRun,
          configFile
        },
        {
          successMessage: (data) => {
            const {
              createdCount = 0,
              skippedCount = 0
            } = data ?? {}

            if (opts.dryRun) {
              return `${createdCount} service${createdCount === 1 ? '' : 's'} can be added`
            }

            if (skippedCount > 0) {
              return `${createdCount} service${createdCount === 1 ? '' : 's'} added, ${skippedCount} skipped`
            }

            return `${createdCount} service${createdCount === 1 ? '' : 's'} added`
          }
        }
      )
    )
  program
    .command('validate')
    .description('Validate the generated Moleculer project consistency')
    .action(async () =>
      runCommand(
        'project validation',
        validateProject,
        {},
        {
          successMessage: 'Project validated'
        }
      )
    )
}
