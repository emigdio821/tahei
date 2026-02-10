import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { folders } from '..'

const folderSelectSchema = createSelectSchema(folders)
const folderInsertSchema = createInsertSchema(folders)
const folderUpdateSchema = createUpdateSchema(folders)

export type FolderSelect = z.infer<typeof folderSelectSchema>
export type FolderInsert = z.infer<typeof folderInsertSchema>
export type FolderUpdate = z.infer<typeof folderUpdateSchema>
