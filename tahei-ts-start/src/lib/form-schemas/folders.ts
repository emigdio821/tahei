import { z } from 'zod'
import { FOLDER_NAME_MAX_LENGTH } from '../constants'

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(FOLDER_NAME_MAX_LENGTH, 'Folder name must be less than 50 characters'),
  parentFolderId: z.uuid('Invalid parent folder ID').nullable(),
})

export type CreateFolderFormData = z.infer<typeof createFolderSchema>

export const updateFolderSchema = createFolderSchema.extend({
  id: z.uuid('Invalid folder ID'),
})

export type UpdateFolderFormData = z.infer<typeof updateFolderSchema>
