/*
  PATH  /src/core/commands/init-project.js
*/
import path from 'path'
import { fileURLToPath } from 'url'
import { initPrompts } from '../prompts/init-prompts.js'
import { safeRun } from '../utils/safe-run.js'

// Modules Factory
import { databases } from '../../dist/modules/databases/index.js'
import { transporters } from '../../dist/modules/transporters/index.js'
import { plugins } from '../../dist/modules/plugins/index.js'
import { ApiGatewayModule } from '../../dist/modules/backend-services/ApiGatewayModule.js'

// Generator
import { generate } from '../generators/generate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates/base')

/**
 * Command to initialize a Moleculer project.
 * @async
 * @function initProject
 * @returns {Promise<Object>} > User answers from prompts
 */
export const initProject = safeRun(async ({ dryRun = false } = {}) => {
  // 1- Ask prompts
  const answers = await initPrompts()
  const { projectNameSanitized, database, transporter, plugins: selectedPlugins } = answers
  // 2- Factory chosen modules
  const needsTraefikLabels = selectedPlugins.includes('traefik')
  const modulesToGenerate = [
    ApiGatewayModule({ projectNameSanitized, needsTraefikLabels }),
    databases[database](projectNameSanitized),
    transporters[transporter](projectNameSanitized),
    ...selectedPlugins
      .map(pluginKey => plugins[pluginKey])
      .filter(Boolean) // in case if a key doesn't exist
      .map(factory => factory(projectNameSanitized))
  ]
  // 3- Generate the project
  const projectDir = path.join(process.cwd(), projectNameSanitized)
  await generate(answers, { database }, modulesToGenerate, TEMPLATE_DIR, projectDir, { dryRun })

  return answers
})
