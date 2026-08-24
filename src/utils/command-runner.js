/*
  PATH /src/utils/command-runner.js
*/

import { logger } from './logger.js'

const getMessage = entry => {
  if (typeof entry === 'string') {
    return entry
  }

  return entry?.message ?? String(entry)
}

const formatChange = change => {
  const type = (change?.type ?? 'change')
    .toUpperCase()
    .padEnd(7)

  return `${type} ${change.target}`
}

const logDryRun = changes => {
  logger.info('Dry run — no changes were applied')

  if (changes.length === 0) {
    return
  }

  logger.newLine()

  for (const change of changes) {
    logger.plain(`  ${formatChange(change)}`)
  }
}

export const runCommand = async (
  commandName,
  commandFn,
  options = {},
  {
    successMessage = `${commandName} completed`
  } = {}
) => {
  logger.debug(`Starting ${commandName}...`)

  try {
    const result = await commandFn(options)

    const warnings = result.warnings ?? []
    const errors = result.errors ?? []
    const changes = result.changes ?? []
    const checks = result.checks ?? []

    /*
     * Fatal command failure.
     */
    if (!result.success) {
      logger.newLine()

      for (const error of errors) {
        logger.error(getMessage(error))
      }

      if (errors.length === 0) {
        logger.error('An unexpected internal error occurred.')
      }

      if (result.error) {
        logger.debug('Raw error:', result.error)
      }

      process.exitCode ||= result.exitCode ?? 1
      return
    }

    /*
     * Recoverable errors.
     *
     * Mainly useful for batch commands where part of the work
     * may fail while the rest can still continue.
     */
    for (const error of errors) {
      logger.error(getMessage(error))
    }

    for (const check of checks) {
      logger.info(typeof check === 'string'
        ? check
        : check.message
      )
    }

    /*
     * Non-blocking warnings.
     */
    for (const warning of warnings) {
      logger.warn(getMessage(warning))
    }

    /*
     * Dry-run plan.
     */
    if (result.dryRun) {
      logger.newLine()
      logDryRun(changes)
    }

    /*
     * Final command status.
     */
    logger.newLine()

    const message = typeof successMessage === 'function'
      ? successMessage(result.data, warnings)
      : successMessage

    if (result.dryRun) {
      logger.success(message)
    } else if (errors.length > 0) {
      logger.success(`${message} with errors`)
    } else if (warnings.length > 0) {
      logger.success(`${message} with warnings`)
    } else {
      logger.success(message)
    }

    /*
     * Full structured result is available in --debug.
     */
    logger.debug('Command result:', result)
  } catch (error) {
    /*
     * runCommand itself should almost never throw because commands
     * are wrapped with safeRun().
     *
     * This remains as a last-resort CLI boundary.
     */
    logger.newLine()
    logger.error('An unexpected internal error occurred.')
    logger.debug(
      `Unexpected error during ${commandName}:`,
      error
    )

    process.exitCode ||= 1
  }
}
