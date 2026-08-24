/*
  PATH /src/commands/validate-project.js
*/

import { safeRun } from '../utils/safe-run.js'
import {
  createCommandResult,
  addCheck,
  addWarning
} from '../utils/command-result.js'
import { AppError } from '../errors/AppError.js'
import { projectValidator } from '../validators/project-validator.js'

export const validateProject = safeRun(async () => {
  const commandResult = createCommandResult()

  const result = await projectValidator(process.cwd())

  if (!result.valid) {
    throw new AppError(`Project validation failed with ${result.errors.length} error(s).`, {
      code: 'PROJECT_VALIDATION_FAILED',
      details: result.errors
    })
  }

  for (const check of result.checks) {
    addCheck(commandResult, check)
  }

  for (const warning of result.warnings) {
    addWarning(commandResult, {
      code: 'PROJECT_VALIDATION_WARNING',
      message: warning
    })
  }

  commandResult.data = {
    valid: result.valid
  }

  return commandResult
})
