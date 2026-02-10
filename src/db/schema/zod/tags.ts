import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { tags } from '..'

const tagSelectSchema = createSelectSchema(tags)
const tagInsertSchema = createInsertSchema(tags)
const tagUpdateSchema = createUpdateSchema(tags)

export type TagSelect = z.infer<typeof tagSelectSchema>
export type TagInsert = z.infer<typeof tagInsertSchema>
export type TagUpdate = z.infer<typeof tagUpdateSchema>
