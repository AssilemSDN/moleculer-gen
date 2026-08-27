/*
  PATH /src/generators/init-project/generate.js
*/
import fs from 'fs/promises'
import path from 'path'

import {
  mkdirp,
  copyDir,
  ensureEmptyDir
} from '../../utils/fs-helpers.js'

import {
  addPlannedChange,
  createCommandResult
} from '../../utils/command-result.js'

import { logger } from '../../utils/logger.js'

import { generateConfig } from './generate-config.js'
import { generateModules } from './generate-modules.js'
import { generatePackageJson } from './generate-package.json.js'
import { generateApplicationConfig } from './generate-application-config.js'
import { generateReadme } from './generate-readme.js'

const listFilesRecursive = async (directory, baseDirectory = directory) => {
  const entries = await fs.readdir(directory, {
    withFileTypes: true
  })
  const files = []
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(
        ...await listFilesRecursive(
          entryPath,
          baseDirectory
        )
      )
      continue
    }

    const relativePath = path.relative(
      baseDirectory,
      entryPath
    )
    const normalizedPath = relativePath.replaceAll(
      path.sep,
      path.posix.sep
    )

    files.push(normalizedPath)
  }
  return files.sort()
}

/**
 * Register all planned changes involved in project generation.
 *
 * Planned changes describe the expected filesystem effects of the project generation.
 */
const registerPlannedGenerationChanges = async ({
  result,
  modules,
  templateDir
}) => {
  const staticDir = path.join(templateDir, 'static')

  const templateFiles = await listFilesRecursive(staticDir)

  for (const target of templateFiles) {
    addPlannedChange(result, {
      type: 'create',
      target,
      scope: 'base-template'
    })
  }

  const generatedFiles = [
    '.moleculer-gen/config.json',
    'package.json',
    'README.md',
    'src/config/application.config.js',
    'docker-compose.yaml',
    '.env.example',
    '.env.dev'
  ]

  for (const target of generatedFiles) {
    addPlannedChange(result, {
      type: 'create',
      target
    })
  }

  for (const module of modules) {
    const moduleKey = path.basename(module.meta.key)

    addPlannedChange(result, {
      type: 'create',
      target: `docker/services/${moduleKey}.yaml`,
      scope: 'module',
      module: module.meta.key
    })

    for (const template of module.templates ?? []) {
      addPlannedChange(result, {
        type: 'create',
        target: template.outputPath,
        scope: 'module',
        module: module.meta.key
      })
    }
  }
}

/**
 * Generate a new project skeleton.
 *
 * @param {Object} options
 * @param {Object} options.answers
 * @param {Object} options.context
 * @param {Array} options.modules
 * @param {string} options.templateDir
 * @param {string} options.projectDir
 * @param {boolean} options.dryRun
 * @param {Object} options.result
 */
export const generate = async ({
  answers,
  context = {},
  modules = [],
  templateDir,
  projectDir,
  dryRun = false,
  result
} = {}) => {
  const generationResult =
    result ?? createCommandResult({ dryRun })

  logger.debug('Preparing project generation:', {
    projectDir,
    dryRun
  })

  /*
   * This is safe during dry-run:
   * ensureEmptyDir only verifies the destination and does not create it.
   *
   * Keeping this check means a dry-run cannot report success for a
   * destination that would fail during the real generation.
   */
  await ensureEmptyDir(projectDir)

  await registerPlannedGenerationChanges({
    result: generationResult,
    modules,
    templateDir
  })

  logger.debug(
    'Project generation plan:',
    generationResult.plannedChanges
  )

  // Dry-run stops after building and validating the plan.
  if (dryRun) {
    return generationResult
  }

  // Create required directories
  const dirs = [
    '.moleculer-gen',
    'docker/services'
  ]

  await Promise.all(
    dirs.map(dir =>
      mkdirp(path.join(projectDir, dir))
    )
  )

  // Copy base template
  await copyDir(
    path.join(templateDir, 'static'),
    projectDir
  )

  // Run generation tasks in parallel
  await Promise.all([
    generateConfig(answers, projectDir),
    generatePackageJson(
      answers.projectNameSanitized,
      projectDir,
      context
    ),
    generateReadme(
      templateDir,
      projectDir,
      answers.projectName,
      answers.database,
      answers.transporter
    ),
    generateApplicationConfig(
      templateDir,
      projectDir,
      modules
    ),
    generateModules(
      templateDir,
      projectDir,
      modules
    )
  ])

  logger.debug('Project generation completed:', {
    projectDir,
    plannedChanges: generationResult.plannedChanges.length
  })

  return generationResult
}
