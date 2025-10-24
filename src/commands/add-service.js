/*
  PATH  /src/cli/add-service.js
*/
import path from 'path'
import { safeRun } from '../utils/safe-run.js'
import { addServicePrompts } from '../prompts/add-service-prompts.js'
import { generateNewService } from '../generators/add/generate-new-service.js'
import { ensureEmptyDir, exists } from '../utils/fs-helpers.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_DIR = path.join(__dirname, '../../templates')

export const addService = safeRun(async ({ dryRun = false } = {}) => {
  // 1- Ensure .moleculer-gen/ directory exists
  const projectDir = process.cwd()
  await exists(path.join(projectDir, '.moleculer-gen'))

  // 2- Questions about the new service
  const answers = await addServicePrompts()

  // 3- Ensure the service directory is empty
  const serviceDir = path.join(projectDir, `src/services/${answers.serviceDirectoryName}`)
  await ensureEmptyDir(serviceDir)

  // 4- Generate files and directories
  await generateNewService(answers, TEMPLATE_DIR, projectDir, serviceDir, { dryRun })

  return answers
})
