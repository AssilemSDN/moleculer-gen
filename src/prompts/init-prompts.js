/*
  PATH /src/prompts/init-prompts.js
*/
import inquirer from 'inquirer'
import { modulesRegistry } from '../../dist/modules/registry.js'
import { sanitizeName } from '../utils/common-helpers.js'
import path from 'path'

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

  let projectNameSanitized = sanitizeName(projectName)
  projectNameSanitized = path.basename(projectNameSanitized) // For security

  // Database
  const { database } = await inquirer.prompt([
    {
      type: 'select',
      name: 'database',
      message: '💾 Choose a database:',
      choices: Object.entries(modulesRegistry.database).map(([key, { meta }]) => ({
        name: `${meta.name} – ${meta.description}`,
        value: key
      }))
    }
  ])

  // Transporter
  const { transporter } = await inquirer.prompt([
    {
      type: 'select',
      name: 'transporter',
      message: '📦 Choose a transporter:',
      choices: Object.entries(modulesRegistry.transporter).map(([key, { meta }]) => ({
        name: `${meta.name} – ${meta.description}`,
        value: key
      }))
    }
  ])

  // Plugins
  const { plugins } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: '⚙️ Select optional infrastructure modules:',
      choices: Object.entries(modulesRegistry.plugin).map(([key, { meta }]) => ({
        name: `${meta.name} – ${meta.description}`,
        short: meta.name,
        value: key,
        checked: meta.enabledByDefault
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
