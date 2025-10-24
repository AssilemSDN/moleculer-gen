/*
  PATH: /src/core/generators/generate-new-service.js
*/
import path from 'path'
import { mkdirp, writeFile } from '../../utils/fs-helpers.js'
import { renderTemplate } from '../../utils/render-template.js'
import { logger } from '../../utils/logger.js'

/**
 * Generate a new Moleculer service with optional CRUD model.
 * @param {object} answers - User inputs from prompts
 * @param {string} templateDir - Path to templates directory
 * @param {string} outputDir - Root of /src in project
 * @param {string} serviceDir - Directory for the service
 * @param {object} [options]
 * @param {boolean} [options.dryRun=false] - Simulate generation
 */
export const generateNewService = async (
  answers,
  templateDir,
  outputDir,
  serviceDir,
  { dryRun = false } = {}
) => {
  const {
    serviceName,
    isCrud,
    exposeApi,
    serviceFileName,
    modelFileName,
    modelName,
    collectionName
  } = answers

  // --- 🧪 Dry-run mode ---
  if (dryRun) {
    logger.info(`[dry-run] Would generate service ${serviceFileName} at ${serviceDir}`)
    if (isCrud) logger.info(`[dry-run] Would generate model ${modelFileName}`)
    if (exposeApi) logger.info('[dry-run] Would update api-gateway routes')
    return
  }

  // --- 📁 Ensure folders exist ---
  await mkdirp(serviceDir)
  await mkdirp(path.join(serviceDir, 'actions'))
  await mkdirp(path.join(serviceDir, 'methods'))

  // --- 🧩 Render service template ---
  const serviceTemplatePath = path.join(
    templateDir,
    isCrud ? 'service-crud.mustache' : 'service.mustache'
  )

  const serviceRendered = await renderTemplate(serviceTemplatePath, {
    serviceName,
    modelName,
    modelFileName,
    collectionName
  })

  const serviceFilePath = path.join(serviceDir, serviceFileName)
  await writeFile(serviceFilePath, serviceRendered)
  logger.success(`✅ Service generated: ${serviceFilePath}`)

  // --- 🧩 Generate model if CRUD ---
  if (isCrud) {
    const modelTemplatePath = path.join(templateDir, 'model.mustache')
    const modelRendered = await renderTemplate(modelTemplatePath, {
      modelName,
      collectionName
    })
    const modelFilePath = path.join(outputDir, `data/model/${modelFileName}`)
    await mkdirp(path.dirname(modelFilePath))
    await writeFile(modelFilePath, modelRendered)
    logger.success(`✅ Model generated: ${modelFilePath}`)
  }

  // --- 🔗 Handle api-gateway route addition (placeholder for future) ---
  if (exposeApi) {
    logger.warn('ℹ️  API route addition not yet implemented.')
  }
}
