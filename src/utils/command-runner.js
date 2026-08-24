/*
  PATH /src/utils/command-runner.js
*/

import { logger } from './logger.js'

import {
  renderCommandResult,
  renderUnexpectedError
} from '../cli/renderer/render-command-result.js'

export const runCommand = async (
  commandName,
  commandFn,
  options = {},
  {
    successMessage
  } = {}
) => {
  logger.debug(`Starting ${commandName}...`)
  try {
    const result = await commandFn(options)
    renderCommandResult({
      commandName,
      result,
      successMessage
    })
    if (!result.success) {
      process.exitCode ||= result.exitCode ?? 1
    }
  } catch (error) {
    renderUnexpectedError(
      commandName,
      error
    )
    process.exitCode ||= 1
  }
}
