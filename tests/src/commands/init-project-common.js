import { expect } from 'vitest'

export const expectCommandSuccess = result => {
  expect(result.success).toBe(true)

  return result.data
}

export const expectCommandFailure = result => {
  expect(result.success).toBe(false)
  expect(result.error).toBeInstanceOf(Error)

  return result.error
}

export const getGenerateCall = generate => {
  expect(generate).toHaveBeenCalledOnce()

  return generate.mock.calls[0][0]
}

export const getGeneratedModuleKeys = generate => {
  return getGenerateCall(generate)
    .modules
    .map(module => module.meta.key)
}
