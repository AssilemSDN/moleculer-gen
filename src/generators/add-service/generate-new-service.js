/*
  PATH /src/generators/add/generate-new-service.js
*/
import path from 'path'
import { mkdirp, writeFile, resolvePathInside } from '../../utils/fs-helpers.js'
import { renderTemplate } from '../../utils/render-template.js'
import { createCommandResult, addPlannedChange } from '../../utils/command-result.js'
import { updateMoleculerGenConfig } from './update-moleculer-gen-config.js'
import { updateRoutesConfig } from './update-routes-config.js'
import { updateDockerCompose } from './update-docker-compose.js'

/**
 * Generate a new Moleculer service with optional CRUD model.
 * @param {string} projectNameSanitized
 * @param {object} answers - User inputs from prompts
 * @param {string} templateDir - Path to templates directory
 * @param {string} outputDir - Project root directory
 * @param {string} serviceDir - Directory for the service
 * @param {object} [options]
 * @param {boolean} [options.dryRun=false] - Simulate generation
 */
export const generateNewService = async (
  projectNameSanitized,
  answers,
  templateDir,
  outputDir,
  serviceDir,
  { dryRun = false } = {}
) => {
  const result = createCommandResult({ dryRun })

  const {
    isCrud,
    exposeApi,
    serviceFileName,
    modelFileName,
    modelName,
    serviceDirectoryName,
    schemaName
  } = answers

  const serviceFilePath = resolvePathInside(
    serviceDir,
    serviceFileName
  )

  const modelDir = path.join(
    outputDir,
    'src',
    'data',
    'model'
  )

  const modelFilePath = isCrud
    ? resolvePathInside(modelDir, modelFileName)
    : null

  addPlannedChange(result, {
    type: 'create',
    target: serviceFilePath
  })

  if (isCrud) {
    addPlannedChange(result, {
      type: 'create',
      target: modelFilePath
    })
  }

  addPlannedChange(result, {
    type: 'create',
    target: path.join('docker', 'services', `${serviceDirectoryName}.yaml`)
  })

  addPlannedChange(result, {
    type: 'update',
    target: '.moleculer-gen/config.json'
  })

  if (exposeApi) {
    addPlannedChange(result, {
      type: 'update',
      target: 'src/config/routes.config.js'
    })
  }

  //  1- dry-run mode : no real service generation
  if (dryRun) {
    return result
  }

  // 2- Create needed directories
  await mkdirp(path.join(serviceDir, 'actions'))
  await mkdirp(path.join(serviceDir, 'methods'))

  // 3- Render service template
  const serviceTemplatePath = path.join(
    templateDir,
    isCrud
      ? 'dynamic/src/services/service-crud.js.mustache'
      : 'dynamic/src/services/service.js.mustache'
  )

  const serviceRendered = await renderTemplate(serviceTemplatePath, {
    ...answers,
    servicePath: `src/services/${serviceDirectoryName}/${serviceFileName}`
  })

  await writeFile(serviceFilePath, serviceRendered)

  // 4- Generate model if CRUD
  if (isCrud) {
    const modelTemplatePath = path.join(
      templateDir,
      'dynamic/src/data/model/model.js.mustache'
    )
    const modelRendered = await renderTemplate(modelTemplatePath, {
      modelFileName,
      modelName,
      schemaName
    })

    await mkdirp(path.dirname(modelFilePath))
    await writeFile(modelFilePath, modelRendered)
  }
  // 5- Generate new service in docker-compose
  await updateDockerCompose(projectNameSanitized, serviceDirectoryName)
  // 6- Generate new service in .moleculer-gen/config
  await updateMoleculerGenConfig(answers)
  // 7- Handle api-gateway route addition
  if (exposeApi) {
    await updateRoutesConfig(answers)
  }

  return result
}
