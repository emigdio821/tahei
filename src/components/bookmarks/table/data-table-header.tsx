'use client'

import { IconCloudDown, IconInfoCircle, IconSearch, IconTag, IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { differenceInMonths } from 'date-fns'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AlertDialogGeneric } from '@/components/shared/alert-dialog-generic'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { deleteBookmarksBatch, resyncBookmarksMetadataBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { CreateBookmarkDialog } from '../dialogs/create'
import { UpdateBookmarkTagsDialog } from '../dialogs/update-tags'

interface BookmarksDataTableHeaderProps {
  table: Table<Bookmark>
}

export function BookmarksDataTableHeader({ table }: BookmarksDataTableHeaderProps) {
  const [isCreateManualOpen, setIsCreateManualOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isUpdateTagsDialogOpen, setUpdateTagsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useQueryState('search-bookmarks', parseAsString.withDefault(''))

  const tableRowsLength = table.getCoreRowModel().rows.length
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedRowsLength = selectedRows.length

  const selectedItems = selectedRows.map((row) => row.original)

  const eligibleBookmarks = selectedItems.filter((bookmark) => {
    if (!bookmark.lastMetadataSyncedAt) return true
    const monthsSinceLastSync = differenceInMonths(new Date(), bookmark.lastMetadataSyncedAt)
    return monthsSinceLastSync >= 1
  })

  const areElegibleForMetadataUpdate = eligibleBookmarks.length > 0

  const batchDeleteMutation = useMutation({
    mutationFn: async (bookmarkIds: string[]) => {
      return await deleteBookmarksBatch(bookmarkIds)
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Success', {
          description: 'The selected bookmarks have been deleted.',
        })
      } else if (succeeded === 0) {
        toast.error('Error', {
          description: 'Failed to delete bookmarks. Please try again.',
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
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred while deleting bookmarks.',
      })
    },
  })

  const batchUpdateMetadataMutation = useMutation({
    mutationFn: async (options: { assetsOnly: boolean }) => {
      const bookmarkIds = selectedItems.map((item) => item.id)
      return await resyncBookmarksMetadataBatch(bookmarkIds, options)
    },
  })

  async function handleBatchMetadataUpdate(options: { assetsOnly: boolean }) {
    const promise = batchUpdateMetadataMutation.mutateAsync(options)

    toast.promise(promise, {
      loading: 'Updating metadata...',
      description: (
        <div>
          <p>
            Eligible bookmarks: <span className="font-medium">{eligibleBookmarks.length}</span>.
          </p>
        </div>
      ),
      success: (results) => {
        const succeeded = results.filter((r) => r.success).length
        const failed = results.filter((r) => !r.success).length

        queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

        if (failed === 0) {
          return {
            message: 'Success',
            description: 'The metadata for the selected bookmarks has been updated.',
          }
        } else if (succeeded === 0) {
          return {
            message: 'Error',
            description:
              'Failed to update bookmarks metadata. Check if they are eligible for metadata update and try again.',
          }
        } else {
          return {
            message: 'Partial update',
            description: `${succeeded} updated, ${failed} failed.`,
          }
        }
      },
      error: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred while updating metadata.'
        console.error('Batch metadata update failed', error)

        return {
          message: 'Error',
          description: errorMessage,
        }
      },
    })
  }

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
              Selected bookmarks: <span className="font-medium">{selectedRowsLength}</span>.
            </p>
            <p>This action cannot be undone.</p>
          </div>
        }
      />

      <CreateBookmarkDialog open={isCreateManualOpen} onOpenChange={setIsCreateManualOpen} />
      <UpdateBookmarkTagsDialog
        bookmarks={selectedItems}
        open={isUpdateTagsDialogOpen}
        onOpenChange={setUpdateTagsDialogOpen}
      />

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
            <>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      onClick={() => setDeleteDialogOpen(true)}
                      variant="destructive-outline"
                      size="icon"
                    >
                      <IconTrash />
                    </Button>
                  }
                />
                <TooltipContent>Delete selected bookmarks</TooltipContent>
              </Tooltip>

              <Tooltip>
                <DropdownMenu>
                  <TooltipTrigger
                    render={
                      <DropdownMenuTrigger
                        render={
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={batchUpdateMetadataMutation.isPending || !areElegibleForMetadataUpdate}
                          >
                            <IconCloudDown />
                          </Button>
                        }
                      />
                    }
                  />

                  <DropdownMenuContent align="end" className="max-w-sm">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>You can update metadata once per month</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleBatchMetadataUpdate({ assetsOnly: false })}>
                        <div>
                          <p className="text-sm">Full</p>
                          <p className="text-muted-foreground text-sm">
                            Update all. This will overwrite existing data.
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBatchMetadataUpdate({ assetsOnly: true })}>
                        <div>
                          <p className="text-sm">Assets only</p>
                          <p className="text-muted-foreground text-sm">
                            Update only the favicon and preview image.
                          </p>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipContent>Update metadata for selected bookmarks</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button onClick={() => setUpdateTagsDialogOpen(true)} variant="outline" size="icon">
                      <IconTag />
                    </Button>
                  }
                />
                <TooltipContent>Update tags for selected bookmarks</TooltipContent>
              </Tooltip>
            </>
          )}

          <Button onClick={() => setIsCreateManualOpen(true)}>Create</Button>
        </div>
      </div>
    </>
  )
}
