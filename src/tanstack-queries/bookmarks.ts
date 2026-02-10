import { queryOptions } from '@tanstack/react-query'
import { getBookmarks } from '@/server-actions/bookmarks'

export const BOOKMARKS_QUERY_KEY = 'bookmarks'

export const bookmarksQueryOptions = () =>
  queryOptions({
    queryKey: [BOOKMARKS_QUERY_KEY],
    queryFn: async () => await getBookmarks(),
  })
