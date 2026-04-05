#!/usr/bin/env node

/*
  PATH  /bin/cli.js
*/
import { program } from 'commander'
import { applyLoggerLevel, registerGlobalOptions } from '../src/cli/options.js'
import { registerCommands } from '../src/cli/commands.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

// CLI definition
program
  .name('moleculer-gen')
  .description('Moleculer project generator')
  .version(version)
// Options
registerGlobalOptions(program)
// init commands
registerCommands(program)
program.hook('preAction', (thisCommand) => applyLoggerLevel(thisCommand))

program.parse()
