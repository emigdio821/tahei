import { relations } from 'drizzle-orm'
import { boolean, index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth'

export * from './auth'

export const folders = pgTable(
  'folders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: varchar('description', { length: 200 }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentFolderId: uuid('parent_folder_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('folders_userId_idx').on(table.userId),
    index('folders_parentFolderId_idx').on(table.parentFolderId),
  ],
)

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 200 }),
    favicon: text('favicon'),
    image: text('image'),
    isFavorite: boolean('is_favorite').default(false).notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('bookmarks_userId_idx').on(table.userId),
    index('bookmarks_folderId_idx').on(table.folderId),
    index('bookmarks_isFavorite_idx').on(table.isFavorite),
  ],
)

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('tags_userId_idx').on(table.userId),
    uniqueIndex('tags_name_userId_unique_idx').on(table.name, table.userId),
  ],
)

export const bookmarkTags = pgTable(
  'bookmark_tags',
  {
    bookmarkId: uuid('bookmark_id')
      .notNull()
      .references(() => bookmarks.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('bookmarkTags_bookmarkId_idx').on(table.bookmarkId),
    index('bookmarkTags_tagId_idx').on(table.tagId),
    uniqueIndex('bookmarkTags_bookmarkId_tagId_unique_idx').on(table.bookmarkId, table.tagId),
  ],
)

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(user, {
    fields: [folders.userId],
    references: [user.id],
  }),
  parentFolder: one(folders, {
    fields: [folders.parentFolderId],
    references: [folders.id],
    relationName: 'subfolders',
  }),
  subfolders: many(folders, {
    relationName: 'subfolders',
  }),
  bookmarks: many(bookmarks),
}))

export const bookmarksRelations = relations(bookmarks, ({ one, many }) => ({
  user: one(user, {
    fields: [bookmarks.userId],
    references: [user.id],
  }),
  folder: one(folders, {
    fields: [bookmarks.folderId],
    references: [folders.id],
  }),
  bookmarkTags: many(bookmarkTags),
}))

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(user, {
    fields: [tags.userId],
    references: [user.id],
  }),
  bookmarkTags: many(bookmarkTags),
}))

export const bookmarkTagsRelations = relations(bookmarkTags, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmarkTags.bookmarkId],
    references: [bookmarks.id],
  }),
  tag: one(tags, {
    fields: [bookmarkTags.tagId],
    references: [tags.id],
  }),
}))
