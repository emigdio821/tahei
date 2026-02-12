'use client'

import { useQuery } from '@tanstack/react-query'
import { TSQueryGenericError } from '@/components/shared/errors/query-generic'
import { TableGenericSkeleton } from '@/components/shared/skeletons/table-generic'
import { DataTable } from '@/components/shared/table/data-table'
import { BookmarkCreationProvider } from '@/lib/contexts/bookmark-creation'
import { tagsBookmarksQueryOptions } from '@/tanstack-queries/tags'
import { bookmarksTableColumns } from '../columns'
import { BookmarksDataTableHeader } from '../data-table-header'

interface TagBookmarksDataTableProps {
  tagId: string
}

export function TagBookmarksDataTable({ tagId }: TagBookmarksDataTableProps) {
  const { data: bookmarks = [], isLoading, error, refetch } = useQuery(tagsBookmarksQueryOptions(tagId))

  if (error) {
    return (
      <TSQueryGenericError
        refetch={refetch}
        errorDescription="Something went wrong while fetching bookmarks for this tag."
      />
    )
  }

  if (isLoading) {
    return <TableGenericSkeleton />
  }

  return (
    <BookmarkCreationProvider
      value={{
        defaultTags: [tagId],
        hiddenFields: { tags: true },
      }}
    >
      <DataTable
        data={bookmarks}
        tableId="tag-bookmarks"
        columns={bookmarksTableColumns}
        header={(table) => <BookmarksDataTableHeader table={table} />}
      />
    </BookmarkCreationProvider>
  )
}
