import path from 'path'
import { describe, expect, it } from 'vitest'

import { resolvePathInside } from '../../../src/utils/fs-helpers.js'

describe('resolvePathInside', () => {
  const baseDir = path.resolve('/project/src/services')

  it('resolves a path inside the base directory', () => {
    const result = resolvePathInside(
      baseDir,
      'users'
    )

    expect(result).toBe(
      path.join(baseDir, 'users')
    )
  })

  it('allows nested paths inside the base directory', () => {
    const result = resolvePathInside(
      baseDir,
      'users/generated'
    )

    expect(result).toBe(
      path.join(baseDir, 'users', 'generated')
    )
  })

  it('rejects a path that escapes the base directory', () => {
    expect(() =>
      resolvePathInside(
        baseDir,
        '../../../evil'
      )
    ).toThrow(
      expect.objectContaining({
        name: 'AppError',
        code: 'INVALID_PATH'
      })
    )
  })

  it('rejects a direct parent directory traversal', () => {
    expect(() =>
      resolvePathInside(
        baseDir,
        '../evil'
      )
    ).toThrow(
      expect.objectContaining({
        code: 'INVALID_PATH'
      })
    )
  })

  it('rejects an absolute path outside the base directory', () => {
    const outsidePath = path.resolve('/tmp/evil')

    expect(() =>
      resolvePathInside(
        baseDir,
        outsidePath
      )
    ).toThrow(
      expect.objectContaining({
        code: 'INVALID_PATH'
      })
    )
  })

  it('rejects sibling directories with the same prefix', () => {
    const siblingPath = `${baseDir}-evil`

    expect(() =>
      resolvePathInside(
        baseDir,
        siblingPath
      )
    ).toThrow(
      expect.objectContaining({
        code: 'INVALID_PATH'
      })
    )
  })

  it('allows the base directory itself', () => {
    const result = resolvePathInside(
      baseDir,
      '.'
    )

    expect(result).toBe(baseDir)
  })
})
