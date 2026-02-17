'use server'

import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarks, bookmarkTags } from '@/db/schema'
import type { Bookmark, BookmarkInsert } from '@/db/schema/zod/bookmarks'
import type { CreateBookmarkFormData, UpdateBookmarkFormData } from '@/lib/form-schemas/bookmarks'
import { processConcurrently } from '@/lib/utils'
import { getBookmarkMetadata } from './bookmark-metadata'
import { getSession } from './session'

export async function getBookmarks(): Promise<Bookmark[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const bookmarks = await db.query.bookmarks.findMany({
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

  return bookmarks
}

export async function getFavoriteBookmarks(): Promise<Bookmark[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const bookmarks = await db.query.bookmarks.findMany({
    with: {
      bookmarkTags: {
        with: {
          tag: true,
        },
      },
      folder: true,
    },
    where: (bookmark, { eq, and }) =>
      and(eq(bookmark.userId, session.user.id), eq(bookmark.isFavorite, true)),
    orderBy: (bookmark, { desc }) => desc(bookmark.updatedAt),
  })

  return bookmarks
}

export async function createBookmark(data: CreateBookmarkFormData): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

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
}

export interface UpdateBookmarkTagsBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export async function updateBookmarkTagsBatch(
  bookmarkIds: string[],
  tagIds: string[],
): Promise<UpdateBookmarkTagsBatchResult[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const results = await Promise.allSettled(
    bookmarkIds.map(async (bookmarkId) => {
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
}

export async function updateBookmark(id: string, data: UpdateBookmarkFormData): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const { tags, ...bookmark } = data

  await db.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, id))

  if (tags && tags.length > 0) {
    const tagsToInsert = tags.map((tagId) => ({
      bookmarkId: id,
      tagId,
    }))

    await db.insert(bookmarkTags).values(tagsToInsert)
  }

  await db.update(bookmarks).set(bookmark).where(eq(bookmarks.id, id))
}

export async function deleteBookmark(id: string): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.delete(bookmarks).where(eq(bookmarks.id, id))
}

export interface DeleteBookmarksBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export async function deleteBookmarksBatch(bookmarkIds: string[]): Promise<DeleteBookmarksBatchResult[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

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
}

export async function toggleFavoriteBookmark(id: string, isFavorite: boolean): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db
    .update(bookmarks)
    .set({ isFavorite })
    .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, session.user.id)))
}

export async function getAllBookmarkUrls(): Promise<{ url: string }[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const bookmarksUrls = await db
    .select({
      url: bookmarks.url,
    })
    .from(bookmarks)
    .where(eq(bookmarks.userId, session.user.id))

  return bookmarksUrls || []
}

export async function getAllBookmarkIds(): Promise<{ id: string }[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const bookmarkIds = await db
    .select({
      id: bookmarks.id,
    })
    .from(bookmarks)
    .where(eq(bookmarks.userId, session.user.id))

  return bookmarkIds || []
}

export interface CreateBookmarksBatchResult {
  success: boolean
  bookmarkId?: string
  error?: string
  url: string
}

export async function createBookmarksBatch(
  bookmarksData: CreateBookmarkFormData[],
): Promise<CreateBookmarksBatchResult[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const urls = bookmarksData.map((data) => data.url)
  const metadataList = await processConcurrently(urls, (url) => getBookmarkMetadata(url))

  const results = await Promise.allSettled(
    bookmarksData.map(async (data, index) => {
      const metadata = metadataList[index]
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
          const tagsToInsert = tags.map((tagId) => ({
            bookmarkId: bookmark.id,
            tagId,
          }))

          await tx.insert(bookmarkTags).values(tagsToInsert)
        }

        return bookmark
      })
    }),
  )

  return results.map((result, index) => {
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
}

export async function resyncBookmarkMetadata(
  bookmarkId: string,
  options: { assetsOnly: boolean },
): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

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
}

export interface ResyncBookmarksMetadataBatchResult {
  success: boolean
  bookmarkId: string
  error?: string
}

export async function resyncBookmarksMetadataBatch(
  bookmarkIds: string[],
  options: { assetsOnly: boolean },
): Promise<ResyncBookmarksMetadataBatchResult[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const bookmarksToSync = await db.query.bookmarks.findMany({
    where: (bookmark, { inArray, and, eq }) =>
      and(inArray(bookmark.id, bookmarkIds), eq(bookmark.userId, session.user.id)),
  })

  const metadataList = await processConcurrently(bookmarksToSync, (bookmark) =>
    getBookmarkMetadata(bookmark.url),
  )

  const results = await Promise.allSettled(
    bookmarksToSync.map(async (bookmark, index) => {
      const metadata = metadataList[index]

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
        bookmarkId: bookmarksToSync[index].id,
        error: result.reason?.message || 'Unknown error',
      }
    }
  })
}
