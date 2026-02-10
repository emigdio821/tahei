'use client'

import { useQuery } from '@tanstack/react-query'
import { TSQueryGenericError } from '@/components/shared/errors/query-generic'
import { TableGenericSkeleton } from '@/components/shared/skeletons/table-generic'
import { DataTable } from '@/components/shared/table/data-table'
import { bookmarksQueryOptions } from '@/tanstack-queries/bookmarks'
import { bookmarksTableColumns } from './columns'
import { BookmarksDataTableHeader } from './data-table-header'

export function HoaMembersDataTable() {
  const { data: bookmarks = [], isLoading, error, refetch } = useQuery(bookmarksQueryOptions())

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
    />
  )
}
