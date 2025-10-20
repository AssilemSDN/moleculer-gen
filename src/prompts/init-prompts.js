/*
  PATH  /src/core/prompts/init-prompts.js
*/
import inquirer from 'inquirer'
import { AppError } from '../errors/AppError.js'
import { transporterMetas } from '../../dist/modules/transporters/index.js'
import { databaseMetas } from '../../dist/modules/databases/index.js'
import { pluginMetas } from '../../dist/modules/plugins/index.js'

const sanitizeProjectName = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

/**
 * Ask the user interactive prompts to configure a new Moleculer project.
 * Includes project name, database, transporter, and optional plugins.
 *
 * @async
 * @returns {Promise<{
 *   projectName: string,
 *   projectNameSanitized: string,
 *   database: string,
 *   transporter: string,
 *   plugins: string[]
 * }>} - User configuration answers
 * @throws {AppError} If project name is invalid after sanitization
 */
export const initPrompts = async () => {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '🧱 Project name:',
      validate: input => {
        if (!input) return 'The project name is mandatory.'
        if (/(\.\.|\/|\\)/.test(input)) return 'Invalid name (no ../ or / allowed).'
        if (input.length > 50) return 'Project name too long (max 50 characters).'
        return true
      }
    }
  ])

  const projectNameSanitized = sanitizeProjectName(projectName)
  if (!projectNameSanitized) {
    throw new AppError('Project name invalid.', { code: 'INVALID_PROJECT_NAME' })
  }

  // Database
  const { database } = await inquirer.prompt([
    {
      type: 'list',
      name: 'database',
      message: '💾 Choose a database:',
      choices: Object.values(databaseMetas).map(meta => ({
        name: `${meta.name} – ${meta.description}`,
        value: meta.key
      }))
    }
  ])

  // Transporter
  const { transporter } = await inquirer.prompt([
    {
      type: 'list',
      name: 'transporter',
      message: '📦 Choose a transporter:',
      choices: Object.values(transporterMetas).map(meta => ({
        name: `${meta.name} – ${meta.description}`,
        value: meta.key
      }))
    }
  ])

  // Plugins
  const { plugins } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: '⚙️ Select optional infrastructure modules:',
      choices: Object.values(pluginMetas).map(meta => ({
        name: `${meta.name} – ${meta.description}`,
        value: meta.key
      }))
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
