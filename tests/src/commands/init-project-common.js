import { expect } from 'vitest'

export const createModule = key => ({
  meta: { key },
  docker: {},
  env: {}
})

export const createRegistryEntry = (
  key,
  category,
  enabledByDefault = false
) => ({
  factory: () => createModule(key),
  meta: {
    key,
    name: key,
    description: '',
    category,
    enabledByDefault
  }
})

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
