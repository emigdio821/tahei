import { z } from 'zod'
import { TAG_NAME_MAX_LENGTH } from '../constants'

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(TAG_NAME_MAX_LENGTH, `Tag name must be less than ${TAG_NAME_MAX_LENGTH} characters`),
})

export type CreateTagFormData = z.infer<typeof createTagSchema>

export const updateTagSchema = createTagSchema.extend({
  id: z.uuid('Invalid tag ID'),
})

export type UpdateTagFormData = z.infer<typeof updateTagSchema>
