import path from 'path'
import { AppError } from '../../errors/AppError.js'
import { exists, writeFile } from '../../utils/fs-helpers.js'
import { createRequire } from 'module'

/**
 * Dynamically updates the project's `src/config/routes.config.js` file
 * by adding a new CRUD API route configuration for a generated service.
 *
 * @async
 * @function updateRoutesConfig
 * @param {Object} answers - User-provided answers collected during the service generation process.
 * @param {string} answers.serviceDirectoryName - The directory name of the new service (e.g., "articles").
 * @param {boolean} answers.isCrud - Whether the new service is a CRUD service.
 * @param {boolean} answers.exposeApi - Whether the new service should be exposed through the API Gateway.
 * @throws {AppError} Throws an error if the `routes.config.js` file is missing
 *                   or if its structure is invalid.
 * @example
 * await updateRoutesConfig({
 *   serviceDirectoryName: 'users',
 *   isCrud: true,
 *   exposeApi: true
 * })
 * // This will add the following route to routes.config.js:
 * // {
 * //   path: '/api/v1/users',
 * //   aliases: {
 * //     'POST /': 'users.create',
 * //     'GET /': 'users.list',
 * //     'GET /:id': 'users.get',
 * //     'PUT /:id': 'users.update',
 * //     'DELETE /:slug': 'users.remove'
 * //   },
 * //   bodyParsers: { json: true }
 * // }
 */
export const updateRoutesConfig = async (answers) => {
  // 0- Exit if no need to update routes
  if (!answers.isCrud || !answers.exposeApi) return

  // 1- Check if routes config file exists
  const routesConfigPath = path.join(process.cwd(), 'src/config/routes.config.js')
  if (!await exists(routesConfigPath)) {
    throw new AppError(`Config file not found: ${routesConfigPath}`, { code: 'CONFIG_NOT_FOUND' })
  }

  // 2- Extract routes from common js file routes.config.js
  const require = createRequire(import.meta.url)
  const routesConfig = require(routesConfigPath)

  // 3- Update routes config
  routesConfig.routes.push({
    path: `/api/v1/${answers.serviceDirectoryName}`,
    aliases: {
      'POST /': `${answers.serviceDirectoryName}.create`,
      'GET /': `${answers.serviceDirectoryName}.list`,
      'GET /:id': `${answers.serviceDirectoryName}.get`,
      'PUT /:id': `${answers.serviceDirectoryName}.update`,
      'DELETE /:slug': `${answers.serviceDirectoryName}.remove`
    },
    bodyParsers: { json: true }
  })
  const updatedContent = `module.exports = ${JSON.stringify(routesConfig, null, 2)}\n`
  await writeFile(routesConfigPath, updatedContent, 'utf-8')
}
