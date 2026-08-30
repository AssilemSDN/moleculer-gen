import { describe, expect, it } from 'vitest'

import {
  resolveProjectPackage
} from '../../../src/project/resolve-package.ts'

const basePackage = {
  name: 'test-project',
  version: '1.0.0',
  dependencies: {
    moleculer: '0.15.1'
  },
  devDependencies: {}
}

const module = ({
  key = 'test-module',
  dependencies,
  devDependencies
} = {}) => ({
  meta: { key },
  package: {
    dependencies,
    devDependencies
  }
})

const cases = [
  {
    name: 'merges dependencies',
    modules: [
      module({
        dependencies: {
          mongoose: '8.24.1'
        }
      })
    ],
    expected: {
      dependencies: {
        moleculer: '0.15.1',
        mongoose: '8.24.1'
      }
    }
  },
  {
    name: 'deduplicates identical versions',
    modules: [
      module({
        dependencies: {
          moleculer: '0.15.1'
        }
      })
    ],
    expected: {
      dependencies: {
        moleculer: '0.15.1'
      }
    }
  },
  {
    name: 'rejects version conflicts',
    modules: [
      module({
        dependencies: {
          moleculer: '1.0.0'
        }
      })
    ],
    errorCode: 'DEPENDENCY_VERSION_CONFLICT'
  },
  {
    name: 'rejects cross-scope conflicts',
    modules: [
      module({
        devDependencies: {
          moleculer: '0.15.1'
        }
      })
    ],
    errorCode: 'DEPENDENCY_SCOPE_CONFLICT'
  }
]

describe('resolveProjectPackage', () => {
  it.each(cases)('$name', ({ modules, expected, errorCode }) => {
    const resolve = () =>
      resolveProjectPackage(basePackage, modules)
    if (errorCode) {
      expect(resolve).toThrow(
        expect.objectContaining({
          code: errorCode
        })
      )
      return
    }
    expect(resolve()).toMatchObject(expected)
  })
})
