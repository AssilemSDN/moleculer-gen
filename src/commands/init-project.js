/*
  PATH /src/commands/init-project.js
*/
import path from 'path'
import { fileURLToPath } from 'url'

import { initPrompts } from '../prompts/init-prompts.js'
import { safeRun } from '../utils/safe-run.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
import { validateInitProjectConfig } from '../validators/config/validate-init-project-config.js'

// Modules Factory
import { databases } from '../../dist/modules/databases/index.js'
import { transporters } from '../../dist/modules/transporters/index.js'
import { plugins } from '../../dist/modules/plugins/index.js'
import { ApiGatewayModule } from '../../dist/modules/backend-services/ApiGatewayModule.js'

// Generator
import { generate } from '../generators/init-project/generate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

/**
 * Load and validate an initialization configuration from a JSON file.
 *
 * @param {string} configFile Path to the configuration file.
 * @returns {Promise<object>} Validated and normalized configuration.
 */
const loadInitConfigFromFile = async (configFile) => {
  const config = await loadJsonConfigFile(configFile, {
    invalidJsonCode: 'INVALID_JSON',
    label: 'Init config'
  })

  return validateInitProjectConfig(config)
}

/**
 * Command to initialize a Moleculer project.
 */
export const initProject = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    // 1. Get config
    const config = configFile
      ? await loadInitConfigFromFile(configFile)
      : await initPrompts()

    const {
      projectNameSanitized,
      database,
      transporter,
      plugins: selectedPlugins
    } = config

    // 2. Check if Traefik labels are needed
    const needsTraefikLabels = selectedPlugins.includes('traefik')

    // 3. Build modules
    const modulesToGenerate = [
      ApiGatewayModule({
        projectNameSanitized,
        needsTraefikLabels
      }),

      databases[database](projectNameSanitized),

      transporters[transporter](projectNameSanitized),

      ...selectedPlugins
        .map(key => plugins[key])
        .filter(Boolean)
        .map(factory =>
          factory({
            projectNameSanitized,
            needsTraefikLabels
          })
        )
    ]

    // 4. Define generation options
    const generateOptions = {
      answers: config,
      dryRun,
      context: {
        database
      },
      modules: modulesToGenerate,
      templateDir: TEMPLATE_DIR,
      projectDir: path.join(
        process.cwd(),
        projectNameSanitized
      )
    }

    // 5. Generate
    await generate(generateOptions)
    return config
  }
)
