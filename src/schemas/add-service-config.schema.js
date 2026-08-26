import { z } from 'zod'

export const addServiceConfigSchema = z.object({
  serviceName: z.string().trim().min(1),
  isCrud: z.boolean().optional(),
  exposeApi: z.boolean().optional(),

  serviceFileName: z.string().min(1).optional(),
  serviceDirectoryName: z.string().trim().min(1).optional(),

  modelFileName: z.string().trim().min(1).optional(),
  modelName: z.string().trim().min(1).optional(),
  modelVariableName: z.string().trim().min(1).optional(),
  collectionName: z.string().trim().min(1).optional(),
  schemaName: z.string().trim().min(1).optional()
})
