import path from 'path'
import { writeFile } from '../utils/fs-helpers.js'

/**
 * Generate `.moleculer-gen/config.js`, useful file for moleculer-gen
 * @param {object} answers - Answers from init commands prompts
 * @param {string} answers.projectName - Project name
 * @param {string} answers.projectNameSanitized - Project name slugify
 * @param {string} answers.database - Chosen database
 * @param {string} answers.transporter - Chosen transporter
 * @param {string[]} answers.plugins - Optional selected plugins
 * @param {string} outputDir - Directory where files will be generated
 */
export const generateConfig = async (answers, outputDir) => {
  const config = {
    ...answers,
    services: [
      'apiGateway'
    ]
  }
  await writeFile(path.join(outputDir, '.moleculer-gen/config.json'), JSON.stringify(config, null, 2))
}
