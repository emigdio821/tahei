import { createServerFn } from '@tanstack/react-start'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db'
import { bookmarks, folders } from '@/db/schema'
import type { FolderSelect } from '@/db/schema/zod/folders'
import type { CreateFolderFormData, UpdateFolderFormData } from '@/lib/form-schemas/folders'
import { authMiddleware } from '@/middleware/auth'

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

export const getFolders = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FolderTreeNode[]> => {
    const session = context.session

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

    return buildFolderTree(allFolders)
  })

export const createFolder = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: CreateFolderFormData) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db.insert(folders).values({
      name: data.name,
      parentFolderId: data.parentFolderId,
      userId: session.user.id,
    })
  })

export const updateFolder = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: UpdateFolderFormData) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db
      .update(folders)
      .set({
        name: data.name,
        parentFolderId: data.parentFolderId,
      })
      .where(and(eq(folders.id, data.id), eq(folders.userId, session.user.id)))
  })

export const deleteFolder = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: string) => data)
  .handler(async ({ data, context }): Promise<void> => {
    const session = context.session
    await db.delete(folders).where(and(eq(folders.id, data), eq(folders.userId, session.user.id)))
  })
