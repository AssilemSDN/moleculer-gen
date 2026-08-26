/*
  PATH /src/utils/command-result.js
*/
export const createCommandResult = ({ dryRun = false } = {}) => ({
  success: true,
  dryRun,
  plannedChanges: [],
  checks: [],
  warnings: [],
  errors: [],
  nextSteps: [],
  data: {}
})

export const addPlannedChange = (result, plannedChange) => {
  result.plannedChanges.push(plannedChange)
}

export const addCheck = (result, check) => {
  result.checks.push(check)
}

export const addWarning = (result, warning) => {
  result.warnings.push(warning)
}

export const addError = (result, error) => {
  result.errors.push(error)
}

export const addNextStep = (result, nextStep) => {
  result.nextSteps.push(nextStep)
}
