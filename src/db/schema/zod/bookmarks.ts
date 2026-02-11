import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { bookmarks, bookmarkTags } from '..'
import type { FolderSelect } from './folders'
import type { TagWithBookmarkCount } from './tags'

const bookmarkSelectSchema = createSelectSchema(bookmarks)
const bookmarkInsertSchema = createInsertSchema(bookmarks)
const bookmarkUpdateSchema = createUpdateSchema(bookmarks)

const bookmarkTagsSelectSchema = createSelectSchema(bookmarkTags)
const bookmarkTagsInsertSchema = createInsertSchema(bookmarkTags)
const bookmarkTagsUpdateSchema = createUpdateSchema(bookmarkTags)

export type BookmarkSelect = z.infer<typeof bookmarkSelectSchema>
export type BookmarkInsert = z.infer<typeof bookmarkInsertSchema>
export type BookmarkUpdate = z.infer<typeof bookmarkUpdateSchema>

export type BookmarkTagsSelect = z.infer<typeof bookmarkTagsSelectSchema>
export type BookmarkTagsInsert = z.infer<typeof bookmarkTagsInsertSchema>
export type BookmarkTagsUpdate = z.infer<typeof bookmarkTagsUpdateSchema>

export type BookmarkTagsWithTag = BookmarkTagsSelect & {
  tag: TagWithBookmarkCount
}

export type Bookmark = BookmarkSelect & {
  bookmarkTags: BookmarkTagsWithTag[]
  folder: FolderSelect | null
}
