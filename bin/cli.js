#!/usr/bin/env node

/*
  PATH  /bin/cli.js
*/
import { program } from 'commander'
import { applyLoggerLevel, registerGlobalOptions } from '../src/core/cli/options.js'
import { registerCommands } from '../src/core/cli/commands.js'

// CLI definition
program
  .name('moleculer-gen')
  .description('Moleculer project generator')
  .version('0.0.1')

// Options
registerGlobalOptions(program)
// init commands
registerCommands(program)
program.parse()
// Log levels
applyLoggerLevel(program)
