import { camelCase, kebabCase, pascalCase } from 'change-case'
import pluralize from 'pluralize-esm'
import slugify from 'slugify'
import { AppError } from '../errors/AppError.js'

export const generateDefaultNames = (serviceName) => {
  const singular = pluralize.singular(serviceName)
  const plural = pluralize.plural(serviceName)
  return {
    serviceFileName: `${kebabCase(plural)}.service.js`,
    serviceDirectoryName: `${kebabCase(plural)}`,
    modelFileName: `${kebabCase(singular)}.model.js`,
    modelName: `${pascalCase(singular)}`,
    modelVariableName: `${pascalCase(singular)}Model`,
    collectionName: `${kebabCase(plural)}`,
    schemaName: `${camelCase(singular)}Schema`
  }
}

export const sanitizeName = (name) => {
  let sanitized = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  })
  sanitized = sanitized.replace(/\.\./g, '')
  sanitized = sanitized.replace(/[\/\\]/g, '-')
  if (!sanitized) {
    throw new AppError('Name invalid after sanitization.', { code: 'INVALID_NAME' })
  }
  return sanitized
}
