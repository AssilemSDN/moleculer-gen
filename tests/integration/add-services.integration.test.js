import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import {
  runCli
} from '../helpers/cli.js'

import {
  createGeneratedProject,
  removeTempDir,
  writeTempConfig
} from '../helpers/temp-project.js'

import { repoRoot } from '../helpers/paths.js'
import { createAddServicesConfig } from '../helpers/config-factories.js'
import { readJsonFile } from '../../src/utils/fs-helpers.js'

import { expectServicesNotToExist, expectServicesToExist } from '../helpers/assertions.js'

const initConfigPath = path.join(
  repoRoot,
  'examples/config/init-project/demo.json'
)

const addServicesConfigPath = path.join(
  repoRoot,
  'examples/config/add-services/demo.json'
)

describe('add-services command integration', () => {
  let tempDir

  afterEach(async () => {
    await removeTempDir(tempDir)
    tempDir = undefined
  })

  const setupProject = async () => {
    const generatedProject = await createGeneratedProject(
      initConfigPath
    )
    tempDir = generatedProject.tempDir
    return generatedProject
  }

  // OK Cases
  const cases = [
    {
      name: 'Should create all services when none already exist',
      existingServices: []
    },
    {
      name: 'Should skip existing services and create missing ones',
      existingServices: ['articles']
    },
    {
      name: 'Should skip all services when all already exist',
      existingServices: ['articles', 'categories']
    }
  ]

  /// /////////// OK cases //////////////
  it.each(cases)(
    'OK : $name',
    async ({ existingServices }) => {
      const { projectDir } = await setupProject()

      const addServicesConfig = await readJsonFile(
        addServicesConfigPath
      )

      const services = addServicesConfig.services

      const servicesToSkip = services.filter(service =>
        existingServices.includes(service.serviceName)
      )

      const servicesToCreate = services.filter(service =>
        !existingServices.includes(service.serviceName)
      )

      if (servicesToSkip.length > 0) {
        const seedConfigPath = await writeTempConfig(
          tempDir,
          'seed-add-services.json',
          createAddServicesConfig(servicesToSkip)
        )

        await runCli(
          ['add-services', seedConfigPath],
          { cwd: projectDir }
        )
      }

      // State before command
      await expectServicesToExist(
        projectDir,
        servicesToSkip
      )

      await expectServicesNotToExist(
        projectDir,
        servicesToCreate
      )

      // Actual command under test
      const result = await runCli(
        ['add-services', addServicesConfigPath],
        { cwd: projectDir }
      )

      const output = `${
      result.stdout ?? ''
    }${
      result.stderr ?? ''
    }`

      // Everything must exist afterward
      await expectServicesToExist(
        projectDir,
        services
      )

      // Existing services must have been skipped
      for (const service of servicesToSkip) {
        expect(output).toContain(
        `Service "${service.serviceName}" already exists, skipping`
        )
      }

      // Everything was already there
      if (servicesToCreate.length === 0) {
        expect(output).toContain(
          'No service was added. All services were skipped.'
        )

        expect(output).toContain(
          'completed with warnings'
        )
      }
    }
  )

  /// /////////// KO cases //////////////
  it('KO : should reject path traversal in serviceFileName', async () => {
    const { projectDir } = await setupProject()

    const maliciousConfig = createAddServicesConfig([
      {
        serviceName: 'users',
        serviceDirectoryName: 'users',
        serviceFileName: '../../../users.service.js',
        isCrud: false,
        exposeApi: false
      }
    ])

    const maliciousConfigPath = await writeTempConfig(
      tempDir,
      'malicious-add-services.json',
      maliciousConfig
    )

    let commandError

    try {
      await runCli(
        ['add-services', maliciousConfigPath],
        { cwd: projectDir }
      )
    } catch (error) {
      commandError = error
    }

    expect(commandError).toBeDefined()

    const errorOutput = `${
      commandError?.stdout ?? ''
    }${
      commandError?.stderr ?? ''
    }${
      commandError?.message ?? ''
    }`

    expect(errorOutput).toMatch(
      /serviceFileName|path|traversal|invalid/i
    )

    const escapedFilePath = path.resolve(
      projectDir,
      'src',
      'services',
      'users',
      '../../../users.service.js'
    )

    await expect(
      fs.access(escapedFilePath)
    ).rejects.toThrow()
  })
})
