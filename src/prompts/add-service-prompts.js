/*
  PATH  /src/prompts/add-service-prompts.js
*/
import inquirer from 'inquirer'
import { camelCase, kebabCase, pascalCase } from 'change-case'
import pluralize from 'pluralize-esm'

const generateDefaultNames = (serviceName) => {
  const singular = pluralize.singular(serviceName)
  const plural = pluralize.plural(serviceName)
  return {
    serviceFileName: `${kebabCase(plural)}.service.js`,
    serviceDirectoryName: `${kebabCase(plural)}`,
    modelFileName: `${kebabCase(singular)}.model.js`,
    modelName: `${pascalCase(singular)}Model`,
    collectionName: `${kebabCase(plural)}`
  }
}

export const addServicePrompts = async () => {
  const { serviceName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'serviceName',
      message: 'Service name (e.g. Users, Orders, Payments):',
      validate: input => {
        if (!input) return 'The service name is mandatory.'
        if (!input.trim()) return 'Service name must not be empty.'
        if (/(\.\.|\/|\\)/.test(input)) return 'Invalid service name (no ../ or / allowed).'
        if (input.length > 50) return 'Service name too long (max 50 characters).'
        return true
      },
      filter: input => camelCase(input.trim())
    }
  ])
  const { isCrud } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isCrud',
      message: 'Is this a CRUD service?',
      default: true
    }
  ])
  let exposeApi = false
  if (isCrud) {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'exposeApi',
        message: 'Expose CRUD operations via API Gateway?',
        default: true
      }
    ])
    exposeApi = answer.exposeApi
  }
  const defaults = generateDefaultNames(serviceName)
  const otherAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'serviceFileName',
      message: 'File name:',
      default: defaults.serviceFileName,
      filter: input => input ? kebabCase(input) : defaults.serviceFileName
    },
    {
      type: 'input',
      name: 'serviceDirectoryName',
      message: 'Service directory name:',
      default: defaults.serviceDirectoryName,
      filter: input => input ? kebabCase(input) : defaults.serviceDirectoryName
    },
    {
      type: 'input',
      name: 'modelFileName',
      message: 'Model file name:',
      default: defaults.modelFileName
    },
    {
      type: 'input',
      name: 'modelName',
      message: 'Model name:',
      default: defaults.modelName
    },
    {
      type: 'input',
      name: 'collectionName',
      message: 'Collection/table name:',
      default: defaults.collectionName
    }
  ])
  return {
    serviceName,
    isCrud,
    exposeApi,
    ...otherAnswers
  }
}
