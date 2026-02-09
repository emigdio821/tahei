import { queryOptions } from '@tanstack/react-query'
import { getSession } from '@/app/server-actions/session'

export const LOGGED_USER_QUERY_KEY = 'logged-user'

export const loggedUserQueryOptions = () =>
  queryOptions({
    queryKey: [LOGGED_USER_QUERY_KEY],
    queryFn: async () => {
      const session = await getSession()
      return session?.user
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
