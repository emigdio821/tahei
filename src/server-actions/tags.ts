'use server'

import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarkTags, tags } from '@/db/schema'
import type { TagWithBookmarkCount } from '@/db/schema/zod/tags'
import type { UpdateTagFormData } from '@/lib/form-schemas/tags'
import { getSession } from './session'

export async function getTags(): Promise<TagWithBookmarkCount[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const allTags = await db
    .select({
      id: tags.id,
      name: tags.name,
      userId: tags.userId,
      createdAt: tags.createdAt,
      updatedAt: tags.updatedAt,
      bookmarkCount: count(bookmarkTags.bookmarkId).as('bookmark_count'),
    })
    .from(tags)
    .leftJoin(bookmarkTags, eq(bookmarkTags.tagId, tags.id))
    .where(eq(tags.userId, session.user.id))
    .groupBy(tags.id)
    .orderBy(tags.name)

  return allTags
}

export async function createTag(name: string): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.insert(tags).values({ name, userId: session.user.id }).returning()
}

export async function updateTag(data: UpdateTagFormData): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db
    .update(tags)
    .set({ name: data.name })
    .where(and(eq(tags.id, data.id), eq(tags.userId, session.user.id)))
}

export async function deleteTag(tagId: string): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.delete(tags).where(and(eq(tags.id, tagId), eq(tags.userId, session.user.id)))
}
