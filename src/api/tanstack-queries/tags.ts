import { queryOptions } from '@tanstack/react-query'
import { getTags } from '../server-functions/tags'

export const TAGS_QUERY_KEY = 'tags'

export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: getTags,
    staleTime: Number.POSITIVE_INFINITY,
  })
