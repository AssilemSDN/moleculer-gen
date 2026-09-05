/*
  PATH /src/commands/init-project.js
*/

import path from 'path'
import { fileURLToPath } from 'url'

import { initPrompts } from '../prompts/init-prompts.js'
import { safeRun } from '../utils/safe-run.js'
import { loadJsonConfigFile } from '../utils/config-helpers.js'
import { addNextStep, createCommandResult } from '../utils/command-result.js'
import { logger } from '../utils/logger.js'

import { validateInitProjectConfig } from '../validators/config/validate-init-project-config.js'

import {
  ensurePathInside,
  sanitizeName,
  validateProjectName,
  validateSanitizedName
} from '../utils/common-helpers.js'

// Modules Factory
import { modulesRegistry } from '../../dist/modules/registry.js'
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
    configType: 'Init config'
  })

  return validateInitProjectConfig(config)
}

/**
 * Command to initialize a Moleculer project.
 */
export const initProject = safeRun(
  async ({ dryRun = false, configFile } = {}) => {
    const result = createCommandResult({ dryRun })

    // 1. Get config
    const config = configFile
      ? await loadInitConfigFromFile(configFile)
      : await initPrompts()

    const projectName = validateProjectName(config.projectName)

    const projectNameSanitized =
      config.projectNameSanitized !== undefined
        ? validateSanitizedName(
          'projectNameSanitized',
          config.projectNameSanitized
        )
        : sanitizeName(projectName)

    const currentDir = process.cwd()

    const projectDir = ensurePathInside(
      currentDir,
      path.join(currentDir, projectNameSanitized)
    )

    const {
      database,
      transporter,
      plugins: selectedPlugins
    } = config

    // 2. Check if Traefik labels are needed
    const needsTraefikLabels = selectedPlugins.includes('traefik')

    // 3. Build modules
    const databaseModule = modulesRegistry.database[database]
    const transporterModule = modulesRegistry.transporter[transporter]

    const modulesToGenerate = [
      ApiGatewayModule({
        projectNameSanitized,
        needsTraefikLabels
      }),

      databaseModule.factory(projectNameSanitized),

      transporterModule.factory(projectNameSanitized),

      ...selectedPlugins
        .map(key => modulesRegistry.plugin[key]?.factory)
        .filter(Boolean)
        .map(factory =>
          factory({
            projectNameSanitized,
            needsTraefikLabels
          })
        )
    ]

    const normalizedConfig = {
      ...config,
      projectName,
      projectNameSanitized
    }

    // 4. Command result data
    result.data = {
      projectName,
      projectNameSanitized,
      projectDir,
      database,
      transporter,
      plugins: selectedPlugins
    }

    logger.debug('Init project configuration:', result.data)

    logger.debug(
      'Modules to generate:',
      modulesToGenerate.map(module => module.meta?.key)
    )

    // 5. Generate
    await generate({
      answers: normalizedConfig,
      dryRun,
      context: {
        database
      },
      modules: modulesToGenerate,
      templateDir: TEMPLATE_DIR,
      projectDir,
      result
    })

    if (!dryRun) {
      addNextStep(result, {
        type: 'command',
        value: `cd ./${projectNameSanitized}`
      })

      addNextStep(result, {
        type: 'command',
        value: 'npx moleculer-gen add-service'
      })

      addNextStep(result, {
        type: 'command',
        value: 'make build'
      })

      addNextStep(result, {
        type: 'command',
        value: 'make start'
      })
    }
    return result
  }
)
