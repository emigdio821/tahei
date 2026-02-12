import { z } from 'zod'

export const createBookmarkSchema = z.object({
  url: z.url(),
  name: z.string().optional(),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.uuid().nullable().optional(),
})

export type CreateBookmarkFormData = z.infer<typeof createBookmarkSchema>

export const updateBookmarkSchema = z.object({
  url: z.url('Invalid URL').min(1, 'URL is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  isFavorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.uuid().nullable().optional(),
})

export type UpdateBookmarkFormData = z.infer<typeof updateBookmarkSchema>

export const importBookmarksSchema = z
  .object({
    urls: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    folderId: z.uuid().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.urls.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one URL is required',
        path: ['urls'],
      })
      return
    }

    data.urls.forEach((url, index) => {
      try {
        z.url().parse(url)
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid URL at line ${index + 1}`,
          path: ['urls'],
        })
      }
    })
  })

export type ImportBookmarksFormData = z.infer<typeof importBookmarksSchema>
