import path from 'path'
import { readFile, writeFile } from '../../utils/fs-helpers.js'

export const updateMoleculerGenConfig = async (answers) => {
  const moleculerGenConfigPath = path.join(process.cwd(), '.moleculer-gen/config.json')
  const content = await readFile(moleculerGenConfigPath, 'utf-8')
  const moleculerGenConfig = JSON.parse(content)
  if (!moleculerGenConfig.services) {
    moleculerGenConfig.services = {}
  }
  moleculerGenConfig.services[answers.serviceName] = answers
  await writeFile(moleculerGenConfigPath, JSON.stringify(moleculerGenConfig, null, 2), 'utf-8')
  return moleculerGenConfig
}
