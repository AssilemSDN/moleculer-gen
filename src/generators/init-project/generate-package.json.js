/*
 * PATH /src/generators/init-project/generate-package.json.js
 */
import path from 'path'
import { writeFile } from '../../utils/fs-helpers.js'

/**
 * Generate the final package.json for the project.
 *
 * @async
 * @param {string} projectNameSanitized - Sanitized project name
 * @param {string} projectDir - Project destination directory
 * @param {Object} resolvedPackage - Resolved project package
 */
export const generatePackageJson = async (
  projectNameSanitized,
  projectDir,
  resolvedPackage
) => {
  const pkg = {
    ...resolvedPackage,
    name: projectNameSanitized
  }

  await writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(pkg, null, 2)
  )
}
