import fs from 'node:fs/promises'
import path from 'node:path'
import { expect } from 'vitest'

import { readJsonFile } from '../../src/utils/fs-helpers.js'

const getGeneratedServiceConfig = async (
  projectDir,
  serviceName
) => {
  const configPath = path.join(
    projectDir,
    '.moleculer-gen',
    'config.json'
  )

  const config = await readJsonFile(configPath)

  if (Array.isArray(config.services)) {
    return config.services.find(
      service =>
        service.serviceName === serviceName
    )
  }

  return config.services?.[serviceName]
}

/**
 * Path expected from the input config.
 *
 * Used before running the command, when the generated
 * service config may not exist yet.
 */
export const getExpectedServiceDirectoryPath = (
  projectDir,
  service
) => {
  return path.join(
    projectDir,
    'src',
    'services',
    service.serviceDirectoryName ??
      service.serviceName
  )
}

/**
 * Path resolved from the config actually generated
 * by moleculer-gen.
 */
const getGeneratedServiceDirectoryPath = async (
  projectDir,
  service
) => {
  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()
  expect(
    generatedService.serviceDirectoryName
  ).toBeDefined()

  return path.join(
    projectDir,
    'src',
    'services',
    generatedService.serviceDirectoryName
  )
}

const getGeneratedServiceFilePath = async (
  projectDir,
  service
) => {
  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()
  expect(
    generatedService.serviceDirectoryName
  ).toBeDefined()
  expect(
    generatedService.serviceFileName
  ).toBeDefined()

  return path.join(
    projectDir,
    'src',
    'services',
    generatedService.serviceDirectoryName,
    generatedService.serviceFileName
  )
}

/**
 * Assertions on the initial filesystem state.
 */

export const expectServiceToExist = async (
  projectDir,
  service
) => {
  const serviceDirectoryPath =
    getExpectedServiceDirectoryPath(
      projectDir,
      service
    )

  await expect(
    fs.access(serviceDirectoryPath)
  ).resolves.toBeUndefined()
}

export const expectServiceNotToExist = async (
  projectDir,
  service
) => {
  const serviceDirectoryPath =
    getExpectedServiceDirectoryPath(
      projectDir,
      service
    )

  await expect(
    fs.access(serviceDirectoryPath)
  ).rejects.toThrow()
}

export const expectServicesToExist = async (
  projectDir,
  services
) => {
  for (const service of services) {
    await expectServiceToExist(
      projectDir,
      service
    )
  }
}

export const expectServicesNotToExist = async (
  projectDir,
  services
) => {
  for (const service of services) {
    await expectServiceNotToExist(
      projectDir,
      service
    )
  }
}

/**
 * Assertions on generated artifacts.
 */

export const expectGeneratedServiceDirectoryToExist =
  async (
    projectDir,
    service
  ) => {
    const serviceDirectoryPath =
      await getGeneratedServiceDirectoryPath(
        projectDir,
        service
      )

    await expect(
      fs.access(serviceDirectoryPath)
    ).resolves.toBeUndefined()
  }

export const expectServiceFileToExist = async (
  projectDir,
  service
) => {
  const serviceFilePath =
    await getGeneratedServiceFilePath(
      projectDir,
      service
    )

  await expect(
    fs.access(serviceFilePath)
  ).resolves.toBeUndefined()
}

export const expectCrudArtifactsToExist = async (
  projectDir,
  service
) => {
  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()
  expect(generatedService.isCrud).toBe(true)
  expect(
    generatedService.modelFileName
  ).toBeDefined()

  const modelPath = path.join(
    projectDir,
    'src',
    'data',
    'model',
    generatedService.modelFileName
  )

  await expect(
    fs.access(modelPath)
  ).resolves.toBeUndefined()
}

export const expectApiArtifactsToExist = async (
  projectDir,
  service
) => {
  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()
  expect(
    generatedService.exposeApi
  ).toBe(true)
  expect(
    generatedService.serviceDirectoryName
  ).toBeDefined()

  const routesConfigPath = path.join(
    projectDir,
    'src',
    'config',
    'routes.config.js'
  )

  const routesConfig = await fs.readFile(
    routesConfigPath,
    'utf8'
  )

  expect(routesConfig).toContain(
    `/api/v1/${generatedService.serviceDirectoryName}`
  )

  for (const action of [
    'create',
    'list',
    'get',
    'update',
    'remove'
  ]) {
    expect(routesConfig).toContain(
      `${generatedService.serviceName}.${action}`
    )
  }
}

export const expectDockerArtifactToExist = async (
  projectDir,
  service
) => {
  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()
  expect(
    generatedService.serviceDirectoryName
  ).toBeDefined()

  const dockerServicePath = path.join(
    projectDir,
    'docker',
    'services',
    `${generatedService.serviceDirectoryName}.yaml`
  )

  await expect(
    fs.access(dockerServicePath)
  ).resolves.toBeUndefined()
}

const expectGeneratedServiceConfigToMatchInput = async (
  projectDir,
  service
) => {
  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()

  expect(generatedService.serviceName).toBe(
    service.serviceName
  )

  if (service.isCrud !== undefined) {
    expect(generatedService.isCrud).toBe(
      service.isCrud
    )
  }

  if (service.exposeApi !== undefined) {
    expect(generatedService.exposeApi).toBe(
      service.exposeApi
    )
  }

  if (service.serviceDirectoryName !== undefined) {
    expect(
      generatedService.serviceDirectoryName
    ).toBe(service.serviceDirectoryName)
  }

  if (service.serviceFileName !== undefined) {
    expect(
      generatedService.serviceFileName
    ).toBe(service.serviceFileName)
  }

  return generatedService
}

export const expectServiceArtifacts = async (
  projectDir,
  service
) => {
  await expectGeneratedServiceConfigToMatchInput(
    projectDir,
    service
  )

  const generatedService =
    await getGeneratedServiceConfig(
      projectDir,
      service.serviceName
    )

  expect(generatedService).toBeDefined()

  await expectGeneratedServiceDirectoryToExist(
    projectDir,
    service
  )

  await expectServiceFileToExist(
    projectDir,
    service
  )

  await expectDockerArtifactToExist(
    projectDir,
    service
  )

  if (service.isCrud) {
    await expectCrudArtifactsToExist(
      projectDir,
      service
    )
  }

  if (service.exposeApi) {
    await expectApiArtifactsToExist(
      projectDir,
      service
    )
  }
}

export const expectGeneratedArtifacts = async (
  projectDir,
  services
) => {
  for (const service of services) {
    await expectServiceArtifacts(
      projectDir,
      service
    )
  }
}
