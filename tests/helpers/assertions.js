import fs from 'node:fs/promises'
import path from 'node:path'
import { expect } from 'vitest'

export const getServiceDirectoryPath = (
  projectDir,
  service
) => {
  return path.join(
    projectDir,
    'src/services',
    service.serviceDirectoryName ??
      service.serviceName
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
