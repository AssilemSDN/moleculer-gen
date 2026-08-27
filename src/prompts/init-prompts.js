/*
  PATH /src/prompts/init-prompts.js
*/

import path from 'path'

import { modulesRegistry } from '../../dist/modules/registry.js'
import { sanitizeName } from '../utils/common-helpers.js'
import { prompt } from './prompt.js'

/**
 * Ask the user interactive prompts to configure a new Moleculer project.
 *
 * @returns {Promise<{
 *   projectName: string,
 *   projectNameSanitized: string,
 *   database: string,
 *   transporter: string,
 *   plugins: string[]
 * }>}
 */
export const initPrompts = async () => {
  const { projectName } = await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      validate: input => {
        if (!input) return 'The project name is mandatory.'

        if (/(\.\.|\/|\\)/.test(input)) {
          return 'Invalid name (no ../ or / allowed).'
        }

        if (input.length > 50) {
          return 'Project name too long (max 50 characters).'
        }

        return true
      }
    }
  ])

  let projectNameSanitized = sanitizeName(projectName)
  projectNameSanitized = path.basename(projectNameSanitized)

  const { database } = await prompt([
    {
      type: 'select',
      name: 'database',
      message: 'Database:',
      choices: Object.entries(modulesRegistry.database).map(
        ([key, { meta }]) => ({
          name: `${meta.name} – ${meta.description}`,
          value: key
        })
      )
    }
  ])

  const { transporter } = await prompt([
    {
      type: 'select',
      name: 'transporter',
      message: 'Transporter:',
      choices: Object.entries(modulesRegistry.transporter).map(
        ([key, { meta }]) => ({
          name: `${meta.name} – ${meta.description}`,
          value: key
        })
      )
    }
  ])

  const { plugins } = await prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'Infrastructure modules:',
      choices: Object.entries(modulesRegistry.plugin).map(
        ([key, { meta }]) => ({
          name: `${meta.name} – ${meta.description}`,
          short: meta.name,
          value: key,
          checked: meta.enabledByDefault
        })
      )
    }
  ])

  return {
    projectName,
    projectNameSanitized,
    database,
    transporter,
    plugins
  }
}
