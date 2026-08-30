import { describe, expect, it } from 'vitest'

import {
  basePackage
} from '../../../src/project/package.ts'

describe('basePackage', () => {
  it('contains only project-wide runtime dependencies', () => {
    expect(basePackage.dependencies).toMatchObject({
      moleculer: '0.15.1',
      'moleculer-db': '0.9.0',
      'moleculer-web': '0.11.0'
    })
  })

  it('does not contain module-specific dependencies', () => {
    expect(basePackage.dependencies).not.toHaveProperty(
      'nats'
    )
    expect(basePackage.dependencies).not.toHaveProperty(
      'mongoose'
    )
    expect(basePackage.dependencies).not.toHaveProperty(
      'moleculer-db-adapter-mongoose'
    )
  })
})
