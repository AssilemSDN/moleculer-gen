import path from 'path'
import { renderTemplateToFile } from '../../utils/render-template.js'

export const generateReadme = async (templateDir, projectDir, projectName, database, transporter) => {
  renderTemplateToFile(
    path.join(templateDir, 'README.mustache'),
    path.join(projectDir, 'README.md'),
    {
      projectName,
      database,
      transporter
    }
  )
}
