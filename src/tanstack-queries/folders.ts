import { queryOptions } from '@tanstack/react-query'
import { getFolders } from '@/server-actions/folders'

export const FOLDERS_QUERY_KEY = 'folders'

export const foldersQueryOptions = () =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: getFolders,
    staleTime: Number.POSITIVE_INFINITY,
  })
