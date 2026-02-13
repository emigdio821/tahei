import { queryOptions } from '@tanstack/react-query'
import { getBookmarksByTag, getTags } from '@/server-actions/tags'

export const TAGS_QUERY_KEY = 'tags'
export const TAGS_BOOKMARKS_QUERY_KEY = 'tags-bookmarks'

export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: getTags,
    staleTime: Number.POSITIVE_INFINITY,
  })

export const tagsBookmarksQueryOptions = (tagId: string) =>
  queryOptions({
    queryKey: [TAGS_BOOKMARKS_QUERY_KEY, tagId],
    queryFn: async () => await getBookmarksByTag(tagId),
  })
