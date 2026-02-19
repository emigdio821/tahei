'use client'

import { IconFolder, IconHeart, IconTag, IconTrash, IconX } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'
import { AlertDialogGeneric } from '@/components/shared/alert-dialog-generic'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { deleteBookmarksBatch, toggleFavoriteBookmarksBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { MoveBookmarksToFolderDialog } from '../dialogs/move-to-folder'
import { UpdateBookmarkTagsDialog } from '../dialogs/update-tags'

interface BookmarksActionBarProps {
  table: Table<Bookmark>
}

export function BookmarksActionBar({ table }: BookmarksActionBarProps) {
  const queryClient = useQueryClient()

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isUpdateTagsDialogOpen, setUpdateTagsDialogOpen] = useState(false)
  const [isMoveToFolderDialogOpen, setMoveToFolderDialogOpen] = useState(false)
  const [isToggleFavoriteDialogOpen, setToggleFavoriteDialogOpen] = useState(false)

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const isVisible = selectedCount > 0

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
          description: 'Selected bookmarks have been deleted.',
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

  const batchToggleFavoriteMutation = useMutation({
    mutationFn: async ({ bookmarkIds, isFavorite }: { bookmarkIds: string[]; isFavorite: boolean }) => {
      return await toggleFavoriteBookmarksBatch(bookmarkIds, isFavorite)
    },
    onSuccess: (results, variables) => {
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Success', {
          description: variables.isFavorite
            ? 'Selected bookmarks have been added to favorites.'
            : 'Selected bookmarks have been removed from favorites.',
        })
      } else if (succeeded === 0) {
        toast.error('Error', {
          description: 'Failed to update favorite status. Please try again.',
        })
      } else {
        toast.warning('Partial update', {
          description: `${succeeded} updated, ${failed} failed.`,
        })
      }

      if (succeeded > 0) {
        table.resetRowSelection()
        setToggleFavoriteDialogOpen(false)
      }
    },
    onError: (error) => {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred while updating favorites.',
      })
    },
  })

  async function handleBatchDelete() {
    const bookmarkIds = selectedRows.map((item) => item.original.id)
    await batchDeleteMutation.mutateAsync(bookmarkIds)
  }

  async function handleBatchToggleFavorite() {
    const bookmarkIds = selectedRows.map((item) => item.original.id)
    const allFavorited = selectedRows.every((row) => row.original.isFavorite)
    const isFavorite = !allFavorited

    await batchToggleFavoriteMutation.mutateAsync({ bookmarkIds, isFavorite })
  }

  if (!isVisible) return null

  return (
    <>
      <AlertDialogGeneric
        open={isToggleFavoriteDialogOpen}
        onOpenChange={setToggleFavoriteDialogOpen}
        action={handleBatchToggleFavorite}
        title="Toggle favorite?"
        description={
          <div>
            <p>
              Selected bookmarks: <span className="font-medium">{selectedCount}</span>.
            </p>
            <p>
              {selectedRows.every((row) => row.original.isFavorite)
                ? 'These bookmarks will be removed from favorites.'
                : 'These bookmarks will be added to favorites.'}
            </p>
          </div>
        }
      />

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
              Selected bookmarks: <span className="font-medium">{selectedCount}</span>.
            </p>
            <p>This action cannot be undone.</p>
          </div>
        }
      />

      <UpdateBookmarkTagsDialog
        open={isUpdateTagsDialogOpen}
        onOpenChange={setUpdateTagsDialogOpen}
        bookmarks={selectedRows.map((row) => row.original)}
      />

      <MoveBookmarksToFolderDialog
        open={isMoveToFolderDialogOpen}
        onOpenChange={setMoveToFolderDialogOpen}
        bookmarks={selectedRows.map((row) => row.original)}
      />

      <div className="flex w-full items-center justify-center gap-2">
        <p className="mr-auto text-sm">
          {selectedCount} <span className="text-muted-foreground">selected</span>
        </p>

        <Button size="sm" variant="outline" onClick={() => setToggleFavoriteDialogOpen(true)}>
          <IconHeart className="size-4" />
          Favorite
        </Button>

        <Button size="sm" variant="outline" onClick={() => setMoveToFolderDialogOpen(true)}>
          <IconFolder className="size-4" />
          Move
        </Button>

        <Button size="sm" variant="outline" onClick={() => setUpdateTagsDialogOpen(true)}>
          <IconTag className="size-4" />
          Tag
        </Button>

        <Button size="sm" variant="destructive-outline" onClick={() => setDeleteDialogOpen(true)}>
          <IconTrash className="size-4" />
          Delete
        </Button>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Clear selection"
                onClick={() => table.resetRowSelection()}
              >
                <IconX className="size-4" />
              </Button>
            }
          />
          <TooltipContent>Clear selection</TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
