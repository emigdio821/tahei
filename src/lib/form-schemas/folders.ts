import { z } from 'zod'

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(50, 'Folder name must be less than 50 characters'),
  description: z.string().max(200, 'Folder description must be less than 200 characters'),
  parentFolderId: z.uuid('Invalid parent folder ID').nullable(),
})

export type CreateFolderFormData = z.infer<typeof createFolderSchema>

export const updateFolderSchema = createFolderSchema.extend({
  id: z.uuid('Invalid folder ID'),
})

export type UpdateFolderFormData = z.infer<typeof updateFolderSchema>
