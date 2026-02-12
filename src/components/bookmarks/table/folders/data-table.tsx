'use client'

import { useQuery } from '@tanstack/react-query'
import { TSQueryGenericError } from '@/components/shared/errors/query-generic'
import { TableGenericSkeleton } from '@/components/shared/skeletons/table-generic'
import { DataTable } from '@/components/shared/table/data-table'
import { BookmarkCreationProvider } from '@/lib/contexts/bookmark-creation'
import { foldersBookmarksQueryOptions } from '@/tanstack-queries/folders'
import { bookmarksTableColumns } from '../columns'
import { BookmarksDataTableHeader } from '../data-table-header'

interface FolderBookmarksDataTableProps {
  folderId: string
}

export function FolderBookmarksDataTable({ folderId }: FolderBookmarksDataTableProps) {
  const { data: bookmarks = [], isLoading, error, refetch } = useQuery(foldersBookmarksQueryOptions(folderId))

  if (error) {
    return (
      <TSQueryGenericError
        refetch={refetch}
        errorDescription="Something went wrong while fetching bookmarks for this folder."
      />
    )
  }

  if (isLoading) {
    return <TableGenericSkeleton />
  }

  return (
    <BookmarkCreationProvider
      value={{
        defaultFolderId: folderId,
        hiddenFields: { folder: true },
      }}
    >
      <DataTable
        data={bookmarks}
        tableId="folder-bookmarks"
        columns={bookmarksTableColumns}
        header={(table) => <BookmarksDataTableHeader table={table} />}
      />
    </BookmarkCreationProvider>
  )
}
