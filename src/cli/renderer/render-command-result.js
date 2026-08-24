/*
  PATH /src/cli/renderer/render-command-result.js
*/

import { logger } from '../../utils/logger.js'

const getMessage = (entry) => {
  if (typeof entry === 'string') {
    return entry
  }
  return entry?.message ?? String(entry)
}

const formatChange = (change) => {
  const type = (change?.type ?? 'change')
    .toUpperCase()
    .padEnd(7)
  return `${type} ${change.target}`
}

const renderDryRun = (changes) => {
  logger.info('Dry run — no changes were applied')
  if (changes.length === 0) {
    return
  }
  logger.newLine()
  for (const change of changes) {
    logger.plain(`  ${formatChange(change)}`)
  }
}

const resolveSuccessMessage = (
  commandName,
  successMessage,
  result
) => {
  if (typeof successMessage === 'function') {
    return successMessage(
      result.data,
      result.warnings ?? []
    )
  }
  return successMessage ?? `${commandName} completed`
}

export const renderCommandResult = ({
  commandName,
  result,
  successMessage
}) => {
  const checks = result.checks ?? []
  const warnings = result.warnings ?? []
  const errors = result.errors ?? []
  const changes = result.changes ?? []
  /*
   * Fatal command failure
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
    return
  }
  /*
   * Validation / informational checks
   */
  for (const check of checks) {
    logger.info(getMessage(check))
  }
  /*
   * Recoverable errors
   */
  for (const error of errors) {
    logger.error(getMessage(error))
  }
  /*
   * Non-blocking warnings
   */
  for (const warning of warnings) {
    logger.warn(getMessage(warning))
  }
  /*
   * Dry-run plan
   */
  if (result.dryRun) {
    logger.newLine()
    renderDryRun(changes)
  }
  /*
   * Final command status
   */
  logger.newLine()

  const finalMessage = resolveSuccessMessage(
    commandName,
    successMessage,
    result
  )
  if (result.dryRun) {
    const count = changes.length
    const label = count === 1 ? 'change' : 'changes'
    logger.success(
      `${finalMessage} — ${count} ${label} planned`
    )
  } else if (errors.length > 0) {
    logger.success(`${finalMessage} with errors`)
  } else if (warnings.length > 0) {
    logger.success(`${finalMessage} with warnings`)
  } else {
    logger.success(finalMessage)
  }
  logger.debug('Command result:', result)
}

export const renderUnexpectedError = (commandName, error) => {
  logger.newLine()
  logger.error('An unexpected internal error occurred.')
  logger.debug(
    `Unexpected error during ${commandName}:`,
    error
  )
}
