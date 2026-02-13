'use client'

import { IconInfoCircle, IconSearch, IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AlertDialogGeneric } from '@/components/shared/alert-dialog-generic'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { deleteBookmarksBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { CreateBookmarkDialog } from '../dialogs/create'

interface BookmarksDataTableHeaderProps {
  table: Table<Bookmark>
}

export function BookmarksDataTableHeader({ table }: BookmarksDataTableHeaderProps) {
  const [isCreateManualOpen, setIsCreateManualOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useQueryState('search-bookmarks', parseAsString.withDefault(''))

  const tableRowsLength = table.getCoreRowModel().rows.length
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedRowsLength = selectedRows.length

  const selectedItems = selectedRows.map((row) => row.original)

  const batchDeleteMutation = useMutation({
    mutationFn: async (bookmarkIds: string[]) => {
      return await deleteBookmarksBatch(bookmarkIds)
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Bookmarks deleted', {
          description: 'The selected bookmarks have been successfully deleted.',
        })
      } else if (succeeded === 0) {
        toast.error('Delete failed', {
          description: 'Failed to delete any bookmarks. Please try again.',
        })
      } else {
        toast.warning('Partial deletion', {
          description: `${succeeded} deleted, ${failed} failed.`,
        })
      }

      if (succeeded > 0) {
        table.resetRowSelection()
        setDeleteDialogOpen(false)
      }
    },
    onError: (error) => {
      toast.error('Delete failed', {
        description: error instanceof Error ? error.message : 'An error occurred while deleting bookmarks.',
      })
    },
  })

  async function handleBatchDelete() {
    const bookmarkIds = selectedItems.map((item) => item.id)
    await batchDeleteMutation.mutateAsync(bookmarkIds)
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
            aria-label="Search"
            placeholder="Search"
            disabled={tableRowsLength === 0}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <IconSearch className="size-4" />
          </InputGroupAddon>

          <InputGroupAddon align="inline-end">
            <Popover>
              <PopoverTrigger
                openOnHover
                render={<Button aria-label="Password requirements" size="icon-xs" variant="ghost" />}
              >
                <IconInfoCircle />
              </PopoverTrigger>
              <PopoverContent side="top" tooltipStyle>
                <p>Search by name or description</p>
              </PopoverContent>
            </Popover>
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
