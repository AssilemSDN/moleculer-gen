/*
  PATH  /src/prompts/add-service-prompts.js
*/
import inquirer from 'inquirer'
import { camelCase } from 'change-case'
import { generateDefaultNames } from '../utils/common-helpers.js'

export const addServicePrompts = async () => {
  const baseAnswers = await inquirer.prompt([
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
    },
    {
      type: 'confirm',
      name: 'isCrud',
      message: 'Is this a CRUD service?',
      default: true
    }
  ])

  const defaults = generateDefaultNames(baseAnswers.serviceName)

  const serviceAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'serviceFileName',
      message: 'Service file name:',
      default: defaults.serviceFileName
    },
    {
      type: 'input',
      name: 'serviceDirectoryName',
      message: 'Service directory name:',
      default: defaults.serviceDirectoryName
    }
  ])

  let exposeApi = false
  let crudAnswers = {}

  if (baseAnswers.isCrud) {
    const { exposeApi: exposeApiAnswer } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'exposeApi',
        message: 'Expose CRUD operations via API Gateway?',
        default: true
      }
    ])
    exposeApi = exposeApiAnswer

    crudAnswers = await inquirer.prompt([
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
        name: 'modelVariableName',
        message: 'Model variable name:',
        default: defaults.modelVariableName
      },
      {
        type: 'input',
        name: 'schemaName',
        message: 'Schema name:',
        default: defaults.schemaName
      },
      {
        type: 'input',
        name: 'collectionName',
        message: 'Collection/table name:',
        default: defaults.collectionName
      }
    ])
  }

  return {
    ...baseAnswers,
    exposeApi,
    ...serviceAnswers,
    ...crudAnswers
  }
}
