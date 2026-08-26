/*
  PATH /src/utils/common-helpers.js
*/
import path from 'node:path'

import { camelCase, kebabCase, pascalCase } from 'change-case'
import pluralize from 'pluralize-esm'
import slugify from 'slugify'

import { AppError } from '../errors/AppError.js'

/**
 * Generates conventional file and identifier names for a service.
 *
 * @param {string} serviceName
 * @returns {{
 *   serviceFileName: string,
 *   serviceDirectoryName: string,
 *   modelFileName: string,
 *   modelName: string,
 *   modelVariableName: string,
 *   collectionName: string,
 *   schemaName: string
 * }}
 */
export const generateDefaultNames = (serviceName) => {
  const singular = pluralize.singular(serviceName)
  const plural = pluralize.plural(serviceName)

  return {
    serviceFileName: `${kebabCase(plural)}.service.js`,
    serviceDirectoryName: kebabCase(plural),
    modelFileName: `${kebabCase(singular)}.model.js`,
    modelName: pascalCase(singular),
    modelVariableName: `${pascalCase(singular)}Model`,
    collectionName: kebabCase(plural),
    schemaName: `${camelCase(singular)}Schema`
  }
}

/**
 * Converts a name into a lowercase URL-safe slug.
 *
 * @param {string} name
 * @returns {string}
 * @throws {AppError} If the name is invalid or produces an empty slug.
 */
export const sanitizeName = (name) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new AppError('Name must be a non-empty string.', {
      code: 'INVALID_NAME'
    })
  }

  const sanitized = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  })

  if (!sanitized) {
    throw new AppError('Name invalid after sanitization.', {
      code: 'INVALID_NAME'
    })
  }

  return sanitized
}

/**
 * Validates a project name.
 *
 * @param {string} name
 * @returns {string}
 * @throws {AppError} If the project name is invalid.
 */
export const validateProjectName = (name) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new AppError('projectName must be a non-empty string.', {
      code: 'INVALID_PROJECT_NAME'
    })
  }

  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw new AppError(
      'projectName cannot contain ".." or path separators.',
      { code: 'INVALID_PROJECT_NAME' }
    )
  }

  return name.trim()
}

/**
 * Validates that a value is already a valid sanitized name.
 *
 * @param {string} fieldName
 * @param {string} name
 * @returns {string}
 * @throws {AppError} If the value is not a valid sanitized name.
 */
export const validateSanitizedName = (fieldName, name) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new AppError(`${fieldName} must be a non-empty string.`, {
      code: 'INVALID_SANITIZED_NAME'
    })
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new AppError(
      `${fieldName} must contain only lowercase letters, numbers and single hyphens.`,
      { code: 'INVALID_SANITIZED_NAME' }
    )
  }

  return name
}

/**
 * Ensures a target path remains inside a base directory.
 *
 * @param {string} baseDir
 * @param {string} targetPath
 * @returns {string} Resolved target path.
 * @throws {AppError} If the target escapes the base directory.
 */
export const ensurePathInside = (baseDir, targetPath) => {
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(targetPath)
  const relativePath = path.relative(resolvedBase, resolvedTarget)

  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new AppError(
      `Target path must remain inside "${resolvedBase}".`,
      {
        code: 'PATH_OUTSIDE_BASE_DIRECTORY',
        details: {
          baseDir: resolvedBase,
          targetPath: resolvedTarget
        }
      }
    )
  }

  return resolvedTarget
}

export const toRelativeProjectPath = (
  projectDir,
  target
) => {
  const relative = path.isAbsolute(target)
    ? path.relative(projectDir, target)
    : target

  return relative.replaceAll(
    path.sep,
    path.posix.sep
  )
}
