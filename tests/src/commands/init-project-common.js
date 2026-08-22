import { expect } from 'vitest'

export const createModulesRegistry = () => ({
  database: {
    mongodb: {
      factory: () => ({
        meta: { key: 'mongodb' },
        docker: {},
        env: {}
      }),
      meta: {
        key: 'mongodb',
        name: 'MongoDB',
        description: '',
        category: 'database',
        enabledByDefault: true
      }
    }
  },

  transporter: {
    nats: {
      factory: () => ({
        meta: { key: 'nats' },
        docker: {},
        env: {}
      }),
      meta: {
        key: 'nats',
        name: 'NATS',
        description: '',
        category: 'transporter',
        enabledByDefault: true
      }
    }
  },

  plugin: {
    traefik: {
      factory: () => ({
        meta: { key: 'traefik' },
        docker: {},
        env: {}
      }),
      meta: {
        key: 'traefik',
        name: 'Traefik',
        description: '',
        category: 'plugin',
        enabledByDefault: false
      }
    },

    prometheus: {
      factory: () => ({
        meta: { key: 'prometheus' },
        docker: {},
        env: {}
      }),
      meta: {
        key: 'prometheus',
        name: 'Prometheus',
        description: '',
        category: 'plugin',
        enabledByDefault: false
      }
    }
  }
})

export const createApiGatewayModule = ({
  projectNameSanitized,
  needsTraefikLabels
}) => ({
  meta: {
    key: `${projectNameSanitized}-api-gateway`,
    needsTraefikLabels
  },
  docker: {},
  env: {}
})

export const expectCommandSuccess = result => {
  expect(result.success).toBe(true)

  return result.data
}

export const expectCommandFailure = result => {
  expect(result.success).toBe(false)
  expect(result.error).toBeInstanceOf(Error)

  return result.error
}

export const getGenerateCall = generate => {
  expect(generate).toHaveBeenCalledOnce()

  return generate.mock.calls[0][0]
}

export const getGeneratedModuleKeys = generate => {
  return getGenerateCall(generate)
    .modules
    .map(module => module.meta.key)
}
