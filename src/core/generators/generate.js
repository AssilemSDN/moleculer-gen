/*
  PATH  /src/core/generator/generate.js
*/
import { mkdirp, copyDir, ensureEmptyDir } from '../utils/fs-helpers.js'
import { generateDockerComposeAndEnv } from './generate-docker-compose-and-env.js'
import { generatePackageJson } from './generate-package.json.js'

/**
 * Generate a new project skeleton.
 * @param {string} projectNameSanitized - Name of the project
 * @param {Object} optionsPkg - Options for package.json generation
 * @param {Array} modules - Modules to include (databases, services, plugins...)
 * @param {string} templateDir - Path to template directory
 * @param {string} outputDir - Path to output directory
 */

export const generate = async (projectNameSanitized, optionsPkg, modules, templateDir, outputDir) => {
  await ensureEmptyDir(outputDir)
  await mkdirp(outputDir)
  await copyDir(templateDir, outputDir)
  // run in parallel
  await Promise.all([
    generatePackageJson(projectNameSanitized, outputDir, optionsPkg),
    generateDockerComposeAndEnv(modules, outputDir)
  ])
}
