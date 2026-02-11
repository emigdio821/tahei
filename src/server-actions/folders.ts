'use server'

import { db } from '@/db'
import type { FolderSelect } from '@/db/schema/zod/folders'
import { getSession } from './session'

export type FolderTreeNode = FolderSelect & {
  subfolders: FolderTreeNode[]
}

function buildFolderTree(folders: FolderSelect[]): FolderTreeNode[] {
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

  const allFolders = await db.query.folders.findMany({
    where: (folder, { eq }) => eq(folder.userId, session.user.id),
    orderBy: (folder, { asc }) => asc(folder.name),
  })

  return buildFolderTree(allFolders) satisfies FolderTreeNode[]
}
