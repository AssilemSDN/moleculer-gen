export const createInitConfig = (overrides = {}) => {
  return {
    projectName: 'Project',
    projectNameSanitized: 'project',
    database: 'mongodb',
    transporter: 'nats',
    plugins: [],
    services: {},
    ...overrides
  }
}

export const createAddServiceConfig = (overrides = {}) => {
  return {
    serviceName: 'users',
    isCrud: true,
    exposeApi: true,
    ...overrides
  }
}

export const createAddServicesConfig = (
  services = [createAddServiceConfig()],
  overrides = {}
) => {
  return {
    services,
    ...overrides
  }
}
