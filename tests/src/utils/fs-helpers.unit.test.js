import path from 'path'
import { describe, expect, it } from 'vitest'

import { resolvePathInside } from '../../../src/utils/fs-helpers.js'

////////////// Tests : function resolvePathInside 
describe('resolvePathInside', () => {
  const baseDir = path.resolve('/project/src/services')

  const validPathCases = [
    {
      name: 'path inside base directory',
      targetPath: 'users',
      expectedPath: path.join(
        baseDir,
        'users'
      )
    },
    {
      name: 'nested path inside base directory',
      targetPath: 'users/generated',
      expectedPath: path.join(
        baseDir,
        'users',
        'generated'
      )
    },
    {
      name: 'base directory itself',
      targetPath: '.',
      expectedPath: baseDir
    }
  ]

  const invalidPathCases = [
    {
      name: 'path traversal escaping multiple parents',
      targetPath: '../../../evil'
    },
    {
      name: 'direct parent directory traversal',
      targetPath: '../evil'
    },
    {
      name: 'absolute path outside base directory',
      targetPath: path.resolve('/tmp/evil')
    },
    {
      name: 'sibling directory with same prefix',
      targetPath: `${baseDir}-evil`
    }
  ]

  it.each(validPathCases)(
    'OK : $name',
    ({ targetPath, expectedPath }) => {
      expect(
        resolvePathInside(
          baseDir,
          targetPath
        )
      ).toBe(expectedPath)
    }
  )

  it.each(invalidPathCases)(
    'KO : $name',
    ({ targetPath }) => {
      expect(() =>
        resolvePathInside(
          baseDir,
          targetPath
        )
      ).toThrow(
        expect.objectContaining({
          name: 'AppError',
          code: 'INVALID_PATH'
        })
      )
    }
  )
})
