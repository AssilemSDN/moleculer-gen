/*
  PATH /src/commands/validate-project.js
*/

import { safeRun } from '../utils/safe-run.js'
import { AppError } from '../errors/AppError.js'
import { projectValidator } from '../validators/project-validator.js'

export const validateProject = safeRun(async () => {
  const result = await projectValidator(process.cwd())

  if (!result.valid) {
    throw new AppError(`Project validation failed with ${result.errors.length} error(s).`, {
      code: 'PROJECT_VALIDATION_FAILED',
      details: result.errors
    })
  }
  return result
})
