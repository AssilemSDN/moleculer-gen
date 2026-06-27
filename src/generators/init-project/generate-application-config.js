/*
  PATH /src/generators/init-project/generate-application-config.js
*/
import path from 'path'
import { camelCase } from 'change-case'
import { renderTemplateToFile } from '../../utils/render-template.js'

const toConfigImport = (template) => {
  const file = path.basename(template.outputPath, '.js')
  const baseName = file.replace(/\.config$/, '')

  return {
    file,
    importName: camelCase(baseName)
  }
}

/**
 * Generate the application config file for Moleculer.
 * @param {string} templateDir - Path to template directory
 * @param {string} projectDir - Path to output directory
 * @param {Array} modules - Modules to include
 */
export const generateApplicationConfig = async (templateDir, projectDir, modules) => {
  const moleculerConfigs = modules
    .flatMap(module => module.templates ?? [])
    .filter(template => template.kind === 'moleculer-config')
    .map(toConfigImport)

  await renderTemplateToFile(
    path.join(templateDir, 'dynamic/src/config/application.config.js.mustache'),
    path.join(projectDir, 'src/config/application.config.js'),
    { moleculerConfigs }
  )
}
