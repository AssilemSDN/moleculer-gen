/*
  PATH /src/cli/renderer/render-command-result.js
*/
import path from 'path'

import { logger } from '../../utils/logger.js'

const renderNextSteps = (nextSteps) => {
  if (nextSteps.length === 0) {
    return
  }

  logger.newLine()
  logger.plain('Next steps:')

  for (const step of nextSteps) {
    if (step.type === 'command') {
      logger.plain(`  $ ${step.value}`)
      continue
    }

    logger.plain(`  ${step.value}`)
  }
}

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

  let target = change.target

  if (target && path.isAbsolute(target)) {
    const relativePath = path.relative(
      process.cwd(),
      target
    )
    target = relativePath || '.'
  }

  return `${type} ${target}`
}

const renderDryRun = (plannedChanges) => {
  logger.info('Dry run — no files will be modified')
  if (plannedChanges.length === 0) {
    return
  }

  // Group identical changes and keep their occurrence count
  const grouped = new Map()

  for (const plannedChange of plannedChanges) {
    const key = `${plannedChange.type}:${plannedChange.target}`
    const existing = grouped.get(key)
    if (existing) {
      ++existing.count
      continue
    }
    grouped.set(key, {
      plannedChange,
      count: 1
    })
  }

  logger.newLine()

  for (const { plannedChange, count } of grouped.values()) {
    const suffix = count > 1
      ? ` x${count}`
      : ''

    logger.plain(
      `  ${formatChange(plannedChange)}${suffix}`
    )
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
      result
    )
  }
  return successMessage ?? `${commandName} completed`
}

const renderFinalStatus = ({
  message,
  result,
  plannedChanges
}) => {
  let finalMessage = message
  if (result.dryRun) {
    const count = plannedChanges.length
    const label = count === 1 ? 'change' : 'changes'
    finalMessage = `${message} — ${count} planned ${label}`
  }
  logger.success(finalMessage)
}

export const renderCommandResult = ({
  commandName,
  result,
  successMessage
}) => {
  const checks = result.checks ?? []
  const warnings = result.warnings ?? []
  const errors = result.errors ?? []
  const plannedChanges = result.plannedChanges ?? []
  const nextSteps = result.nextSteps ?? []

  /*
   * Successful checks
   */
  for (const check of checks) {
    logger.success(getMessage(check))
  }
  /*
   * Non-blocking warnings
   */
  for (const warning of warnings) {
    logger.warn(getMessage(warning))
  }
  /*
   * Errors
   */
  for (const error of errors) {
    logger.error(getMessage(error))
  }
  /*
   * Command failure
   */
  if (!result.success) {
    if (errors.length === 0) {
      logger.error('An unexpected internal error occurred.')
    }
    renderNextSteps(nextSteps)
    if (result.error) {
      logger.debug('Raw error: ', result.error)
    }
    return
  }
  /*
   * Dry-run plan
   */
  if (result.dryRun) {
    logger.newLine()
    renderDryRun(plannedChanges)
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

  renderFinalStatus({
    message: finalMessage,
    result,
    plannedChanges
  })
  renderNextSteps(nextSteps)
  logger.debug('Command result:', result)
}

export const renderUnexpectedError = (
  commandName,
  error
) => {
  logger.newLine()
  logger.error('An unexpected internal error occurred.')
  logger.debug(
    `Unexpected error during ${commandName}:`,
    error
  )
}
