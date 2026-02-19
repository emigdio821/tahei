import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarks, bookmarkTags } from '@/db/schema'
import type { Bookmark, BookmarkInsert } from '@/db/schema/zod/bookmarks'
import type { CreateBookmarkFormData, UpdateBookmarkFormData } from '@/lib/form-schemas/bookmarks'
import { processConcurrently } from '@/lib/utils'
import { getBookmarkMetadata } from './bookmark-metadata'
import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '@/middleware/auth'

export const getBookmarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Bookmark[]> => {
    const session = context.session

    const bookmarksData = await db.query.bookmarks.findMany({
      with: {
        bookmarkTags: {
          with: {
            tag: true,
          },
        },
        folder: true,
      },
      where: (bookmark, { eq }) => eq(bookmark.userId, session.user.id),
      orderBy: (bookmark, { desc }) => desc(bookmark.updatedAt),
    })

    return bookmarksData
  })

export const createBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: CreateBookmarkFormData) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session

    const { name, url, folderId, description, isFavorite, tags } = data
    const { title, description: metaDescription, image, favicon } = await getBookmarkMetadata(data.url)

    const payload: BookmarkInsert = {
      url,
      image,
      favicon,
      folderId,
      isFavorite,
      userId: session.user.id,
      name: name || title || 'bookmark',
      description: description || metaDescription,
    }

    const [bookmark] = await db.insert(bookmarks).values(payload).returning()

    if (tags && tags.length > 0 && bookmark.id) {
      const tagsToInsert = tags.map((tagId) => ({
        bookmarkId: bookmark.id,
        tagId,
      }))

      await db.insert(bookmarkTags).values(tagsToInsert)
    }
  })

export interface UpdateBookmarkTagsBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export const updateBookmarkTagsBatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { bookmarkIds: string[]; tagIds: string[] }) => data)
  .handler(async ({ data, context }): Promise<UpdateBookmarkTagsBatchResult[]> => {
    const session = context.session
    const { bookmarkIds, tagIds } = data

    const results = await Promise.allSettled(
      bookmarkIds.map(async (bookmarkId) => {
        // Verify ownership
        const bookmark = await db.query.bookmarks.findFirst({
          where: (bookmark, { eq, and }) => and(eq(bookmark.id, bookmarkId), eq(bookmark.userId, session.user.id)),
        })

        if (!bookmark) {
          throw new Error('Bookmark not found or unauthorized')
        }

        await db.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, bookmarkId))

        if (tagIds.length > 0) {
          const tagsToInsert = tagIds.map((tagId) => ({
            bookmarkId,
            tagId,
          }))

          await db.insert(bookmarkTags).values(tagsToInsert)
        }

        return bookmarkId
      }),
    )

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          bookmarkId: result.value,
        }
      } else {
        return {
          success: false,
          bookmarkId: bookmarkIds[index],
          error: result.reason?.message || 'Unknown error',
        }
      }
    })
  })

export const updateBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { id: string; data: UpdateBookmarkFormData }) => data)
  .handler(async ({ data }): Promise<void> => {
    const { id, data: formData } = data
    const { tags, ...bookmark } = formData

    await db.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, id))

    if (tags && tags.length > 0) {
      const tagsToInsert = tags.map((tagId) => ({
        bookmarkId: id,
        tagId,
      }))

      await db.insert(bookmarkTags).values(tagsToInsert)
    }

    await db.update(bookmarks).set(bookmark).where(eq(bookmarks.id, id))
  })

export const deleteBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: string) => data)
  .handler(async ({ data }): Promise<void> => {
    await db.delete(bookmarks).where(eq(bookmarks.id, data))
  })

export interface DeleteBookmarksBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export const deleteBookmarksBatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: string[]) => data)
  .handler(async ({ data, context }): Promise<DeleteBookmarksBatchResult[]> => {
    const session = context.session
    const bookmarkIds = data

    if (bookmarkIds.length === 0) {
      return []
    }

    try {
      await db
        .delete(bookmarks)
        .where(and(inArray(bookmarks.id, bookmarkIds), eq(bookmarks.userId, session.user.id)))

      return bookmarkIds.map((id) => ({
        success: true,
        bookmarkId: id,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return bookmarkIds.map((id) => ({
        success: false,
        bookmarkId: id,
        error: errorMessage,
      }))
    }
  })

export const toggleFavoriteBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { id: string; isFavorite: boolean }) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db
      .update(bookmarks)
      .set({ isFavorite: data.isFavorite })
      .where(and(eq(bookmarks.id, data.id), eq(bookmarks.userId, session.user.id)))
  })

export const getAllBookmarkUrls = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ url: string }[]> => {
    const session = context.session

    const bookmarksUrls = await db
      .select({
        url: bookmarks.url,
      })
      .from(bookmarks)
      .where(eq(bookmarks.userId, session.user.id))

    return bookmarksUrls || []
  })

export const getAllBookmarkIds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ id: string }[]> => {
    const session = context.session

    const bookmarkIds = await db
      .select({
        id: bookmarks.id,
      })
      .from(bookmarks)
      .where(eq(bookmarks.userId, session.user.id))

    return bookmarkIds || []
  })

export interface CreateBookmarksBatchResult {
  success: boolean
  bookmarkId?: string
  error?: string
  url: string
}

export const createBookmarksBatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: CreateBookmarkFormData[]) => data)
  .handler(async ({ data, context }): Promise<CreateBookmarksBatchResult[]> => {
    const session = context.session
    const bookmarksData = data

    const results = await processConcurrently(bookmarksData, async (data: CreateBookmarkFormData) => {
      const metadata = await getBookmarkMetadata(data.url)
      const { name, url, folderId, description, isFavorite, tags } = data

      const payload: BookmarkInsert = {
        url,
        image: metadata.image,
        favicon: metadata.favicon,
        folderId,
        isFavorite,
        userId: session.user.id,
        name: name || metadata.title || 'bookmark',
        description: description || metadata.description,
      }

      return await db.transaction(async (tx) => {
        const [bookmark] = await tx.insert(bookmarks).values(payload).returning()

        if (tags && tags.length > 0 && bookmark.id) {
          const tagsToInsert = tags.map((tagId: string) => ({
            bookmarkId: bookmark.id,
            tagId,
          }))

          await tx.insert(bookmarkTags).values(tagsToInsert)
        }

        return bookmark
      })
    })

    return results.map((result: any, index: number) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          bookmarkId: result.value.id,
          url: bookmarksData[index].url,
        }
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Unknown error',
          url: bookmarksData[index].url,
        }
      }
    })
  })

export const resyncBookmarkMetadata = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { bookmarkId: string; options: { assetsOnly: boolean } }) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    const { bookmarkId, options } = data

    const bookmark = await db.query.bookmarks.findFirst({
      where: (bookmark, { eq, and }) => and(eq(bookmark.id, bookmarkId), eq(bookmark.userId, session.user.id)),
    })

    if (!bookmark) {
      throw new Error('Bookmark not found')
    }

    const metadata = await getBookmarkMetadata(bookmark.url)

    const updatePayload = options.assetsOnly
      ? {
          image: metadata.image,
          favicon: metadata.favicon,
        }
      : {
          name: metadata.title,
          description: metadata.description,
          image: metadata.image,
          favicon: metadata.favicon,
        }

    await db.update(bookmarks).set(updatePayload).where(eq(bookmarks.id, bookmarkId))
  })

export interface ResyncBookmarksMetadataBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export const resyncBookmarksMetadataBatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { bookmarkIds: string[]; options: { assetsOnly: boolean } }) => data)
  .handler(async ({ data, context }): Promise<ResyncBookmarksMetadataBatchResult[]> => {
    const session = context.session
    const { bookmarkIds, options } = data

    const bookmarksToSync = await db.query.bookmarks.findMany({
      where: (bookmark, { inArray, and, eq }) =>
        and(inArray(bookmark.id, bookmarkIds), eq(bookmark.userId, session.user.id)),
    })

    const results = await processConcurrently(bookmarksToSync, async (bookmark) => {
      const metadata = await getBookmarkMetadata(bookmark.url)

      const updatePayload = options.assetsOnly
        ? {
            image: metadata.image,
            favicon: metadata.favicon,
          }
        : {
            name: metadata.title,
            description: metadata.description,
            image: metadata.image,
            favicon: metadata.favicon,
          }

      await db.update(bookmarks).set(updatePayload).where(eq(bookmarks.id, bookmark.id))

      return bookmark.id
    })

    return results.map((result: any, index: number) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          bookmarkId: result.value,
        }
      } else {
        return {
          success: false,
          bookmarkId: bookmarksToSync[index].id,
          error: result.reason?.message || 'Unknown error',
        }
      }
    })
  })

export interface MoveBookmarksToFolderBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export const moveBookmarksToFolderBatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { bookmarkIds: string[]; folderId: string | null }) => data)
  .handler(async ({ data, context }): Promise<MoveBookmarksToFolderBatchResult[]> => {
    const session = context.session
    const { bookmarkIds, folderId } = data

    const results = await Promise.allSettled(
      bookmarkIds.map(async (bookmarkId) => {
        await db
          .update(bookmarks)
          .set({ folderId })
          .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, session.user.id)))

        return bookmarkId
      }),
    )

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          bookmarkId: result.value,
        }
      } else {
        return {
          success: false,
          bookmarkId: bookmarkIds[index],
          error: result.reason?.message || 'Unknown error',
        }
      }
    })
  })

export interface ToggleFavoriteBookmarksBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export const toggleFavoriteBookmarksBatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: { bookmarkIds: string[]; isFavorite: boolean }) => data)
  .handler(async ({ data, context }): Promise<ToggleFavoriteBookmarksBatchResult[]> => {
    const session = context.session
    const { bookmarkIds, isFavorite } = data

    const results = await Promise.allSettled(
      bookmarkIds.map(async (bookmarkId) => {
        await db
          .update(bookmarks)
          .set({ isFavorite })
          .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, session.user.id)))

        return bookmarkId
      }),
    )

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          bookmarkId: result.value,
        }
      } else {
        return {
          success: false,
          bookmarkId: bookmarkIds[index],
          error: result.reason?.message || 'Unknown error',
        }
      }
    })
  })
