import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarkTags, tags } from '@/db/schema'
import type { TagWithBookmarkCount } from '@/db/schema/zod/tags'
import type { UpdateTagFormData } from '@/lib/form-schemas/tags'
import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '@/middleware/auth'

export const getTags = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<TagWithBookmarkCount[]> => {
    const session = context.session
    
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

    
});


export const createTag = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: string) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db.insert(tags).values({ name: data, userId: session.user.id }).returning()
  })

export const updateTag = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: UpdateTagFormData) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db
      .update(tags)
      .set({ name: data.name })
      .where(and(eq(tags.id, data.id), eq(tags.userId, session.user.id)))
  })

export const deleteTag = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data: string) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db.delete(tags).where(and(eq(tags.id, data), eq(tags.userId, session.user.id)))
  })
