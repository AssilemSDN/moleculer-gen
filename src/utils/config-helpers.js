/*
  PATH /src/utils/config-helpers.js
*/
import path from 'path'
import { exists, readJsonFile } from './fs-helpers.js'
import { AppError } from '../errors/AppError.js'

/**
 * Load a JSON configuration file.
 *
 * @param {string} configFile Path to the configuration file.
 * @param {object} [options]
 * @param {string} [options.notFoundCode='CONFIG_NOT_FOUND']
 * @param {string} [options.invalidJsonCode='INVALID_CONFIG']
 * @param {string} [options.configType='Config']
 * @returns {Promise<object>}
 */
export const loadJsonConfigFile = async (
  configFile,
  {
    notFoundCode = ErrorCodes.CONFIG_NOT_FOUND,
    configType = 'Config'
  } = {}
) => {
  const configPath = path.resolve(process.cwd(), configFile)

  if (!(await exists(configPath))) {
    throw new AppError(`${configType} file not found: ${configPath}`, {
      code: notFoundCode,
      details: {
        path: configPath
      }
    })
  }

  return readJsonFile(configPath)
}