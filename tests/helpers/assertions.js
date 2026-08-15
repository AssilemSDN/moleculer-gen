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
      service => service.serviceName === serviceName
    )
  }

  return config.services?.[serviceName]
}

export const getServiceDirectoryPath = (
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

export const getServiceFilePath = (
  projectDir,
  service
) => {
  return path.join(
    getServiceDirectoryPath(projectDir, service),
    service.serviceFileName ??
      `${service.serviceName}.service.js`
  )
}

export const expectServiceToExist = async (
  projectDir,
  service
) => {
  await expect(
    fs.access(
      getServiceDirectoryPath(projectDir, service)
    )
  ).resolves.toBeUndefined()
}

export const expectServiceNotToExist = async (
  projectDir,
  service
) => {
  await expect(
    fs.access(
      getServiceDirectoryPath(projectDir, service)
    )
  ).rejects.toThrow()
}

export const expectServiceFileToExist = async (
  projectDir,
  service
) => {
  await expect(
    fs.access(
      getServiceFilePath(projectDir, service)
    )
  ).resolves.toBeUndefined()
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
  expect(generatedService.exposeApi).toBe(true)

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
    `/api/v1/${service.serviceName}`
  )

  for (const action of [
    'create',
    'list',
    'get',
    'update',
    'remove'
  ]) {
    expect(routesConfig).toContain(
      `${service.serviceName}.${action}`
    )
  }
}

export const expectDockerArtifactToExist = async (
  projectDir,
  service
) => {
  const dockerServicePath = path.join(
    projectDir,
    'docker',
    'services',
    `${service.serviceName}.yaml`
  )

  await expect(
    fs.access(dockerServicePath)
  ).resolves.toBeUndefined()
}

export const expectServiceArtifacts = async (
  projectDir,
  service
) => {
  await expectServiceToExist(
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
