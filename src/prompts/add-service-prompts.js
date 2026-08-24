/*
  PATH /src/prompts/add-service-prompts.js
*/

import { camelCase } from 'change-case'

import { prompt } from './prompt.js'
import { generateDefaultNames } from '../utils/common-helpers.js'

export const addServicePrompts = async () => {
  const baseAnswers = await prompt([
    {
      type: 'input',
      name: 'serviceName',
      message: 'Service name:',
      validate: input => {
        if (!input) return 'The service name is mandatory.'
        if (!input.trim()) return 'Service name must not be empty.'

        if (/(\.\.|\/|\\)/.test(input)) {
          return 'Invalid service name (no ../ or / allowed).'
        }

        if (input.length > 50) {
          return 'Service name too long (max 50 characters).'
        }

        return true
      },
      filter: input => camelCase(input.trim())
    },
    {
      type: 'confirm',
      name: 'isCrud',
      message: 'CRUD service:',
      default: true
    }
  ])

  const defaults = generateDefaultNames(baseAnswers.serviceName)

  const serviceAnswers = await prompt([
    {
      type: 'input',
      name: 'serviceFileName',
      message: 'Service file:',
      default: defaults.serviceFileName
    },
    {
      type: 'input',
      name: 'serviceDirectoryName',
      message: 'Service directory:',
      default: defaults.serviceDirectoryName
    }
  ])

  let exposeApi = false
  let crudAnswers = {}

  if (baseAnswers.isCrud) {
    const { exposeApi: exposeApiAnswer } = await prompt([
      {
        type: 'confirm',
        name: 'exposeApi',
        message: 'Expose via API Gateway:',
        default: true
      }
    ])

    exposeApi = exposeApiAnswer

    crudAnswers = await prompt([
      {
        type: 'input',
        name: 'modelFileName',
        message: 'Model file:',
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
        message: 'Model variable:',
        default: defaults.modelVariableName
      },
      {
        type: 'input',
        name: 'schemaName',
        message: 'Schema:',
        default: defaults.schemaName
      },
      {
        type: 'input',
        name: 'collectionName',
        message: 'Collection/table:',
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
