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

import {
  expectGeneratedArtifacts,
  expectServicesNotToExist,
  expectServicesToExist
} from '../helpers/assertions.js'

const initConfigPath = path.join(
  repoRoot,
  'examples/config/init-project/demo.json'
)

const addServicesConfigPath = path.join(
  repoRoot,
  'examples/config/add-services/demo.json'
)

const readDirectoryState = async directoryPath => {
  const entries = await fs.readdir(directoryPath, {
    recursive: true,
    withFileTypes: true
  })

  return Object.fromEntries(
    await Promise.all(
      entries
        .filter(entry => entry.isFile())
        .map(async entry => {
          const filePath = path.join(entry.parentPath, entry.name)
          return [
            path.relative(directoryPath, filePath),
            await fs.readFile(filePath)
          ]
        })
    )
  )
}

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

      const skippedServicesState = new Map()

      for (const service of servicesToSkip) {
        const serviceDirectory = path.join(
          projectDir,
          'src',
          'services',
          service.serviceDirectoryName ??
            service.serviceName
        )

        skippedServicesState.set(
          service.serviceName,
          await readDirectoryState(serviceDirectory)
        )
      }

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

      // Newly generated services must contain
      // all expected artifacts
      await expectGeneratedArtifacts(
        projectDir,
        servicesToCreate
      )

      // Existing services must still exist
      await expectServicesToExist(
        projectDir,
        servicesToSkip
      )

      // Existing services must have been skipped
      // without being modified
      for (const service of servicesToSkip) {
        expect(output).toContain(
          `Service "${service.serviceName}" already exists, skipping`
        )

        const serviceDirectory = path.join(
          projectDir,
          'src',
          'services',
          service.serviceDirectoryName ??
            service.serviceName
        )

        const stateAfter = await readDirectoryState(
          serviceDirectory
        )

        expect(stateAfter).toEqual(
          skippedServicesState.get(service.serviceName)
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

    expect(commandError.stdout).toContain(
      'Path escapes allowed directory: ../../../users.service.js'
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
