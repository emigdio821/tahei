'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarks, bookmarkTags } from '@/db/schema'
import type { Bookmark, BookmarkInsert } from '@/db/schema/zod/bookmarks'
import type { CreateBookmarkFormData } from '@/lib/form-schemas/bookmarks'
import { getBookmarkMetadata } from './bookmark-metadata'
import { getSession } from './session'

export async function getBookmarks() {
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

  return bookmarks satisfies Bookmark[]
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

export async function updateBookmark(id: string, data: Partial<BookmarkInsert>): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.update(bookmarks).set(data).where(eq(bookmarks.id, id))
}

export async function deleteBookmark(id: string): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.delete(bookmarks).where(eq(bookmarks.id, id))
}

export async function toggleFavoriteBookmark(id: string, isFavorite: boolean): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.update(bookmarks).set({ isFavorite }).where(eq(bookmarks.id, id))
}
