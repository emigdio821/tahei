'use server'

import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarks, folders } from '@/db/schema'
import type { FolderSelect } from '@/db/schema/zod/folders'
import type { CreateFolderFormData, UpdateFolderFormData } from '@/lib/form-schemas/folders'
import { getSession } from './session'

export type FolderTreeNode = FolderSelect & {
  subfolders: FolderTreeNode[]
  bookmarkCount: number
}

function buildFolderTree(folders: Array<FolderSelect & { bookmarkCount: number }>): FolderTreeNode[] {
  const folderMap = new Map<string, FolderTreeNode>()
  const rootFolders: FolderTreeNode[] = []

  for (const folder of folders) {
    folderMap.set(folder.id, { ...folder, subfolders: [] })
  }

  for (const folder of folderMap.values()) {
    if (folder.parentFolderId) {
      const parent = folderMap.get(folder.parentFolderId)
      parent?.subfolders.push(folder)
    } else {
      rootFolders.push(folder)
    }
  }

  function sortSubfolders(nodes: FolderTreeNode[]) {
    nodes.sort((a, b) => a.name.localeCompare(b.name))

    for (const node of nodes) {
      if (node.subfolders.length > 0) {
        sortSubfolders(node.subfolders)
      }
    }
  }

  sortSubfolders(rootFolders)
  return rootFolders
}

export async function getFolders() {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const allFolders = await db
    .select({
      id: folders.id,
      name: folders.name,
      userId: folders.userId,
      parentFolderId: folders.parentFolderId,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
      bookmarkCount: count(bookmarks.id).as('bookmark_count'),
    })
    .from(folders)
    .leftJoin(bookmarks, eq(bookmarks.folderId, folders.id))
    .where(eq(folders.userId, session.user.id))
    .groupBy(folders.id)
    .orderBy(folders.name)

  return buildFolderTree(allFolders) satisfies FolderTreeNode[]
}

export async function createFolder(data: CreateFolderFormData) {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.insert(folders).values({
    name: data.name,
    parentFolderId: data.parentFolderId,
    userId: session.user.id,
  })
}

export async function updateFolder(data: UpdateFolderFormData) {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db
    .update(folders)
    .set({
      name: data.name,
      parentFolderId: data.parentFolderId,
    })
    .where(and(eq(folders.id, data.id), eq(folders.userId, session.user.id)))
}

export async function deleteFolder(folderId: string) {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  await db.delete(folders).where(and(eq(folders.id, folderId), eq(folders.userId, session.user.id)))
}
