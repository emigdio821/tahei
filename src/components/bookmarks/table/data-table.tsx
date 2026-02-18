'use client'

import { useQuery } from '@tanstack/react-query'
import { parseAsBoolean, parseAsNativeArrayOf, parseAsString, useQueryStates } from 'nuqs'
import { TSQueryGenericError } from '@/components/shared/errors/query-generic'
import { TableGenericSkeleton } from '@/components/shared/skeletons/table-generic'
import { DataTable } from '@/components/shared/table/data-table'
import { bookmarksQueryOptions } from '@/tanstack-queries/bookmarks'
import { bookmarksTableColumns } from './columns'
import { BookmarksDataTableHeader } from './data-table-header'

interface BookmarksGlobalFilters {
  showFavorites: boolean
  showAll: boolean
  folder?: string
  tag?: string[]
}

export function BookmarksDataTable() {
  const { data: bookmarks = [], isLoading, error, refetch } = useQuery(bookmarksQueryOptions())

  const [filters] = useQueryStates({
    showAll: parseAsBoolean.withDefault(true),
    showFavorites: parseAsBoolean.withDefault(false),
    folder: parseAsString.withDefault(''),
    tag: parseAsNativeArrayOf(parseAsString).withDefault([]),
  })

  if (error) {
    return (
      <TSQueryGenericError
        refetch={refetch}
        errorDescription="Something went wrong while fetching your bookmarks."
      />
    )
  }

  if (isLoading) {
    return <TableGenericSkeleton />
  }

  return (
    <DataTable
      data={bookmarks}
      tableId="bookmarks"
      columns={bookmarksTableColumns}
      header={(table) => <BookmarksDataTableHeader table={table} />}
      tableOptions={{
        enableGlobalFilter: true,
        state: { globalFilter: filters },
        globalFilterFn: (row, _columnId: string, filterValue: BookmarksGlobalFilters) => {
          const bookmark = row.original
          const bookmarkTags = bookmark.bookmarkTags ?? []

          if (filterValue.showFavorites && bookmark.isFavorite !== true) {
            return false
          }

          if (filterValue.folder && bookmark.folderId !== filterValue.folder) {
            return false
          }

          if (filterValue.tag && filterValue.tag.length > 0) {
            const hasAllTags = filterValue.tag.every((tagId) => bookmarkTags.some((bt) => bt.tagId === tagId))
            if (!hasAllTags) {
              return false
            }
          }

          return true
        },
      }}
    />
  )
}
