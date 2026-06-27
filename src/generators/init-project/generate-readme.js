/*
  PATH /src/generators/init-project/generate-readme.js
*/
import path from 'path'
import { renderTemplateToFile } from '../../utils/render-template.js'

export const generateReadme = async (templateDir, projectDir, projectName, database, transporter) => {
  await renderTemplateToFile(
    path.join(templateDir, 'dynamic/README.md.mustache'),
    path.join(projectDir, 'README.md'),
    {
      projectName,
      database,
      transporter
    }
  )
}
