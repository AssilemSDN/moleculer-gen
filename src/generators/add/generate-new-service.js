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
    modelVariableName,
    collectionName,
    schemaName
  } = answers

  //  1- dry-run mode : no real service generation
  if (dryRun) {
    logger.info(`[dry-run] Would generate service ${serviceFileName} at ${serviceDir}`)
    if (isCrud) logger.info(`[dry-run] Would generate model ${modelFileName}`)
    if (exposeApi) logger.info('[dry-run] Would update api-gateway routes')

    return
  }

  // 2- Create needed directories
  await mkdirp(path.join(serviceDir, 'actions'))
  await mkdirp(path.join(serviceDir, 'methods'))

  // 3- Render service template
  const serviceTemplatePath = path.join(
    templateDir,
    isCrud ? 'service-crud.mustache' : 'service.mustache'
  )

  const serviceRendered = await renderTemplate(serviceTemplatePath, {
    serviceName,
    modelVariableName,
    modelFileName,
    collectionName
  })

  const serviceFilePath = path.join(serviceDir, serviceFileName)
  await writeFile(serviceFilePath, serviceRendered)

  // 4- Generate model if CRUD
  if (isCrud) {
    const modelTemplatePath = path.join(templateDir, 'model.mustache')
    const modelRendered = await renderTemplate(modelTemplatePath, {
      modelFileName,
      modelName,
      schemaName
    })
    const modelFilePath = path.join(outputDir, `src/data/model/${modelFileName}`)
    await mkdirp(path.dirname(modelFilePath))
    await writeFile(modelFilePath, modelRendered)
  }

  // Generate new service in docker-compose
  // Generate new service in .moleculer-gen/config
  // Handle api-gateway route addition (placeholder for future)
  if (exposeApi) {
    logger.warn('API route addition not yet implemented.')
  }
}
