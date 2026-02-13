import { queryOptions } from '@tanstack/react-query'
import { getBookmarks, getFavoriteBookmarks } from '@/server-actions/bookmarks'

export const BOOKMARKS_QUERY_KEY = 'bookmarks'
export const FAVORITE_BOOKMARKS_QUERY_KEY = 'favorite-bookmarks'

export const bookmarksQueryOptions = () =>
  queryOptions({
    queryKey: [BOOKMARKS_QUERY_KEY],
    queryFn: getBookmarks,
  })

export const favoriteBookmarksQueryOptions = () =>
  queryOptions({
    queryKey: [FAVORITE_BOOKMARKS_QUERY_KEY],
    queryFn: getFavoriteBookmarks,
  })
