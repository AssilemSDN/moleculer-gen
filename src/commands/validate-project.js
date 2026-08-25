/*
  PATH /src/commands/validate-project.js
*/

import { safeRun } from '../utils/safe-run.js'
import {
  createCommandResult,
  addCheck,
  addError,
  addWarning
} from '../utils/command-result.js'
import { projectValidator } from '../validators/project-validator.js'
import { ExitCodes } from '../utils/exit-codes.js'

export const validateProject = safeRun(async () => {
  const commandResult = createCommandResult()

  const result = await projectValidator(process.cwd())

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

  if (!result.valid) {
    for (const error of result.errors) {
      addError(commandResult, {
        code: 'PROJECT_VALIDATION_ERROR',
        message: error
      })
    }
    return {
      ...commandResult,
      success: false,
      exitCode: ExitCodes.USER_ERROR.code
    }
  }

  return commandResult
})
