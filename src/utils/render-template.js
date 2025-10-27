import Mustache from 'mustache'
import { readFile, writeFile } from './fs-helpers.js'

export const renderTemplate = async (templatePath, data) => {
  const template = await readFile(templatePath)
  return Mustache.render(template, data)
}

/**
 * Render a Mustache template and write the result to a file.
 * @param {string} templatePath - Path to the template file.
 * @param {string} outputPath - Path to write the rendered file.
 * @param {object} data - Data to inject into the template.
 */
export const renderTemplateToFile = async (templatePath, outputPath, data) => {
  const rendered = await renderTemplate(templatePath, data)
  await writeFile(outputPath, rendered, 'utf8')
}
