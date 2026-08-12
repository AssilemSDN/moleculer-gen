import { z } from 'zod'

export const addServiceConfigSchema = z.object({
  serviceName: z.string().min(1),
  isCrud: z.boolean().optional(),
  exposeApi: z.boolean().optional(),

  serviceFileName: z.string().min(1).optional(),
  serviceDirectoryName: z.string().min(1).optional(),

  modelFileName: z.string().min(1).optional(),
  modelName: z.string().min(1).optional(),
  modelVariableName: z.string().min(1).optional(),
  collectionName: z.string().min(1).optional(),
  schemaName: z.string().min(1).optional()
})
