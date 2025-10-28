import { camelCase, kebabCase, pascalCase } from 'change-case'
import pluralize from 'pluralize-esm'

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
