/*
  PATH  /src/core/generator/generate.js
*/
import path from 'path'
import { mkdirp, copyDir, ensureEmptyDir } from '../../utils/fs-helpers.js'
import { logger } from '../../utils/logger.js'
import { generateConfig } from './generate-config.js'
import { generateDockerComposeAndEnv } from './generate-docker-compose-and-env.js'
import { generatePackageJson } from './generate-package.json.js'
import { renderTemplateToFile } from '../../utils/render-template.js'

/**
 * Generate a new project skeleton.
 * @param {Object} options - Options object
 * @param {Object} options.answers - Answers / config
 * @param {Object} options.context - Context for generation (e.g. database)
 * @param {Array} options.modules - Modules to include
 * @param {string} options.templateDir - Path to template directory
 * @param {string} options.projectDir - Path to output directory
 * @param {boolean} options.dryRun - If true, just log actions
 */
export const generate = async ({
  answers,
  context = {},
  modules = [],
  templateDir,
  projectDir,
  dryRun = false
} = {}) => {
  if (dryRun) {
    logger.info(`[dry-run] Would generate project at ${projectDir}`)
    logger.info(`[dry-run] Would copy template from ${templateDir}`)
    logger.info('[dry-run] Would generate package.json and Docker Compose')
    return
  }

  // Ensure the output directory is clean
  await ensureEmptyDir(projectDir)
  await mkdirp(path.join(projectDir, '.moleculer-gen/'))

  // Copy base template
  await copyDir(path.join(templateDir, 'base'), projectDir)

  // Run generation tasks in parallel
  await Promise.all([
    generateConfig(answers, projectDir),
    generatePackageJson(answers.projectNameSanitized, projectDir, context),
    generateDockerComposeAndEnv(modules, projectDir),
    renderTemplateToFile(
      path.join(templateDir, 'README.mustache'),
      path.join(projectDir, 'README.md'),
      {
        projectName: answers.projectName,
        database: answers.database,
        transporter: answers.transporter
      }
    )
  ])
}
