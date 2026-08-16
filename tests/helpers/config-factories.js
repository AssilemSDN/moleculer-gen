export const createAddServiceConfig = (overrides = {}) => {
  return {
    serviceName: 'users',
    isCrud: true,
    exposeApi: true,
    ...overrides
  }
}

export const createAddServicesConfig = (
  services = [{}],
  overrides = {}
) => ({
  services: services.map(service => createAddServiceConfig(service)),
  ...overrides
})

export const createInitAnswers = (
  overrides = {}
) => ({
  projectName: 'Project',
  database: 'mongodb',
  transporter: 'nats',
  plugins: [],
  ...overrides
})

export const createInitConfig = (
  overrides = {}
) => ({
  ...createInitAnswers(),
  projectNameSanitized: 'project',
  services: {},
  ...overrides
})
