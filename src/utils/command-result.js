/*
  PATH /src/utils/command-result.js
*/
export const createCommandResult = ({ dryRun = false } = {}) => ({
  dryRun,
  changes: [],
  warnings: [],
  errors: [],
  data: {}
})

export const addChange = (result, change) => {
  result.changes.push(change)
}

export const addWarning = (result, warning) => {
  result.warnings.push(warning)
}

export const addError = (result, error) => {
  result.errors.push(error)
}
