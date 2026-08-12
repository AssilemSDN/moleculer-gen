import { describe, expect, it } from 'vitest'

import { validateAddServiceConfig } from '../../../src/validators/config/validate-add-service-config.js'

describe('validateAddServiceConfig', () => {
  it('rejects string boolean values', () => {
    expect(() =>
      validateAddServiceConfig({
        serviceName: 'users',
        isCrud: 'false',
        exposeApi: 'false'
      })
    ).toThrow()
  })

  it('accepts false boolean values', () => {
    const config = validateAddServiceConfig({
      serviceName: 'users',
      isCrud: false,
      exposeApi: false
    })

    expect(config.isCrud).toBe(false)
    expect(config.exposeApi).toBe(false)
  })

  it('defaults missing boolean values to false', () => {
    const config = validateAddServiceConfig({
      serviceName: 'users'
    })

    expect(config.isCrud).toBe(false)
    expect(config.exposeApi).toBe(false)
  })
})
