import { describe, expect, it } from 'vitest'

import {
  modulesRegistry
} from '../../../dist/modules/registry.js'

describe('modulesRegistry', () => {
  it('should expose registered module categories', () => {
    expect(Object.keys(modulesRegistry)).toEqual([
      'database',
      'transporter',
      'plugin'
    ])
  })

  it('should expose registered modules', () => {
    expect(modulesRegistry.database.mongodb).toBeDefined()
    expect(modulesRegistry.transporter.nats).toBeDefined()
    expect(modulesRegistry.plugin.traefik).toBeDefined()
    expect(modulesRegistry.plugin.prometheus).toBeDefined()
  })

  it('should expose factory and meta for each module', () => {
    for (const [category, modules] of Object.entries(modulesRegistry)) {
      for (const [key, module] of Object.entries(modules)) {
        expect(module.factory).toBeTypeOf('function')
        expect(module.meta).toBeDefined()

        expect(module.meta.key).toBe(key)
        expect(module.meta.category).toBe(category)
      }
    }
  })
})