'use client'

import {
  IconDotsVertical,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react'
import { useState } from 'react'
import { BookmarkDetailsDialog } from '@/components/bookmarks/dialogs/details'
import { EditBookmarkDialog } from '@/components/bookmarks/dialogs/edit'
import { AlertDialogGeneric } from '@/components/shared/alert-dialog-generic'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { deleteBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface ActionsProps {
  bookmark: Bookmark
}

export function BookmarksTableActions({ bookmark }: ActionsProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [isOpenFavTooltip, setOpenFavTooltip] = useState(false)

  const deleteBookmarkMutation = useEntityMutation({
    mutationFn: async (id: string) => {
      return await deleteBookmark(id)
    },
    invalidateKeys: [BOOKMARKS_QUERY_KEY],
    successTitle: 'Bookmark deleted',
    successDescription: 'The bookmark has been successfully deleted.',
    errorDescription: 'An error occurred while deleting the bookmark, please try again.',
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  async function handleDeleteBookmark() {
    await deleteBookmarkMutation.mutateAsync(bookmark.id)
  }

  return (
    <>
      <AlertDialogGeneric
        state={{
          isOpen: isDeleteDialogOpen,
          onOpenChange: setDeleteDialogOpen,
        }}
        action={handleDeleteBookmark}
        variant="destructive"
        actionLabel="Delete"
        title="Delete bookmark?"
        description={
          <div>
            You're about to delete the bookmark with name:{' '}
            <span className="font-medium">{bookmark.name}</span>. This action cannot be undone.
          </div>
        }
      />

      <EditBookmarkDialog
        bookmark={bookmark}
        state={{ isOpen: isEditDialogOpen, onOpenChange: setEditDialogOpen }}
      />

      <BookmarkDetailsDialog
        bookmark={bookmark}
        state={{ isOpen: isDetailsDialogOpen, onOpenChange: setDetailsDialogOpen }}
      />

      <div className="flex justify-end">
        <Tooltip open={isOpenFavTooltip} onOpenChange={setOpenFavTooltip}>
          <TooltipTrigger
            render={
              <Button
                onClick={(e) => {
                  e.preventBaseUIHandler()
                  setOpenFavTooltip(true)
                }}
                variant="ghost"
                size="icon"
                aria-label="Toggle favorite"
              >
                {bookmark.isFavorite ? (
                  <IconHeartFilled className="size-4" />
                ) : (
                  <IconHeart className="size-4" />
                )}
              </Button>
            }
          />
          <TooltipContent>
            <p>{bookmark.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button aria-label="Table actions" size="icon" variant="ghost">
                <IconDotsVertical className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="max-w-42">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="wrap-break-word my-1.5 line-clamp-2 py-0">
                {bookmark.name}
              </DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>
                <IconInfoCircle className="size-4" />
                Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <IconEdit className="size-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <IconTrash className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
