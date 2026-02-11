'use server'

import { db } from '@/db'
import { tags } from '@/db/schema'
import type { TagSelect } from '@/db/schema/zod/tags'
import { getSession } from './session'

export async function getTags(): Promise<TagSelect[]> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const tags = await db.query.tags.findMany({
    where: (tag, { eq }) => eq(tag.userId, session.user.id),
    orderBy: (tag, { asc }) => asc(tag.name),
  })

  return tags
}

export async function createTag(name: string): Promise<void> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.insert(tags).values({ name, userId: session.user.id }).returning()
}
