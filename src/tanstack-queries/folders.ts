import { queryOptions } from '@tanstack/react-query'
import { getBookmarksByFolder, getFolders } from '@/server-actions/folders'

export const FOLDERS_QUERY_KEY = 'folders'

export const foldersQueryOptions = () =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: getFolders,
    staleTime: Number.POSITIVE_INFINITY,
  })

export const foldersBookmarksQueryOptions = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, folderId],
    queryFn: async () => await getBookmarksByFolder(folderId),
    staleTime: Number.POSITIVE_INFINITY,
  })
