import Mustache from 'mustache'
import { readFile } from './fs-helpers.js'

export const renderTemplate = async (templatePath, data) => {
  const template = await readFile(templatePath)
  return Mustache.render(template, data)
}
