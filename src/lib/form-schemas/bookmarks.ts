import { z } from 'zod'

export const createManualBookmarkSchema = z.object({
  url: z.url(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  folderId: z.uuid().optional(),
})

export type CreateManualBookmarkFormData = z.infer<typeof createManualBookmarkSchema>

export const updateBookmarkSchema = z.object({
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  isFavorite: z.boolean().optional(),
  folderId: z.string().uuid().nullable().optional(),
})

export type UpdateBookmarkFormData = z.infer<typeof updateBookmarkSchema>
