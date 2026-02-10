'use server'

import { db } from '@/db'
import type { FolderSelect } from '@/db/schema/zod/folders'
import { getSession } from './session'

export async function getFolders() {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const folders = await db.query.folders.findMany({
    where: (folder, { eq }) => eq(folder.userId, session.user.id),
    orderBy: (folder, { asc }) => asc(folder.name),
  })

  return folders satisfies FolderSelect[]
}
