'use client'

import { IconInfoCircle, IconSearch, IconTrash } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { AlertDialogGeneric } from '@/components/shared/alert-dialog-generic'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { useBatchDelete } from '@/hooks/use-bulk-delete'
import { deleteBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { CreateBookmarkDialog } from '../dialogs/create'

interface BookmarksDataTableHeaderProps {
  table: Table<Bookmark>
}

export function BookmarksDataTableHeader({ table }: BookmarksDataTableHeaderProps) {
  const [isSearchTooltipOpen, setSearchTooltipOpen] = useState(false)
  const [isCreateManualOpen, setIsCreateManualOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useQueryState('search-bookmarks', parseAsString.withDefault(''))

  const tableRowsLength = table.getCoreRowModel().rows.length
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedRowsLength = selectedRows.length

  const batchDeleteMutation = useBatchDelete({
    table,
    successTitle: 'Bookmarks deleted',
    successDescription: 'The selected bookmarks have been successfully deleted.',
    deleteFn: async (bookmark) => {
      await deleteBookmark(bookmark.id)
    },
    invalidateKeys: [BOOKMARKS_QUERY_KEY],
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  async function handleBatchDelete() {
    await batchDeleteMutation.mutateAsync()
  }

  useEffect(() => {
    table.getColumn('name')?.setFilterValue(searchQuery)
  }, [searchQuery, table])

  return (
    <>
      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        action={handleBatchDelete}
        variant="destructive"
        actionLabel="Delete"
        title="Delete bookmarks?"
        description={
          <div>
            <p>
              Selected bookmarks: <strong>{selectedRowsLength}</strong>.
            </p>
            <p>This action cannot be undone.</p>
          </div>
        }
      />

      <CreateBookmarkDialog open={isCreateManualOpen} onOpenChange={setIsCreateManualOpen} />

      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <InputGroup className="w-full bg-background sm:w-sm">
          <InputGroupInput
            type="search"
            value={searchQuery}
            aria-label="Buscar"
            placeholder="Buscar"
            disabled={tableRowsLength === 0}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <IconSearch className="size-4" />
          </InputGroupAddon>

          <InputGroupAddon align="inline-end">
            <Tooltip open={isSearchTooltipOpen} onOpenChange={setSearchTooltipOpen}>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    aria-label="Buscar por nombre"
                    className="cursor-default"
                    onClick={(e) => {
                      e.preventBaseUIHandler()
                      setSearchTooltipOpen(true)
                    }}
                  >
                    <IconInfoCircle className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>Buscar por nombre</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>

        <div className="flex gap-2">
          {selectedRowsLength > 0 && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="icon">
                    <IconTrash />
                  </Button>
                }
              />
              <TooltipContent>Delete selected bookmarks</TooltipContent>
            </Tooltip>
          )}

          <Button onClick={() => setIsCreateManualOpen(true)}>Create</Button>
        </div>
      </div>
    </>
  )
}
