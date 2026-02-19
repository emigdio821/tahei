'use client'

import {
  IconDotsVertical,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react'
import { useParams, usePathname } from 'next/navigation'
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
import { deleteBookmark, toggleFavoriteBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/tanstack-queries/folders'
import { TAGS_QUERY_KEY } from '@/tanstack-queries/tags'

interface ActionsProps {
  bookmark: Bookmark
}

export function BookmarksTableActions({ bookmark }: ActionsProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)

  const pathname = usePathname()
  const params = useParams<{ id?: string }>()

  function keysToInvalidate(): (string | unknown[])[] {
    const keys: (string | unknown[])[] = [BOOKMARKS_QUERY_KEY]
    const hasTags = bookmark.bookmarkTags && bookmark.bookmarkTags.length > 0
    const hasFolder = bookmark.folderId

    if (hasTags) {
      keys.push(TAGS_QUERY_KEY)
    }

    if (hasFolder) {
      keys.push([FOLDERS_QUERY_KEY, bookmark.folderId])
    }

    if (pathname?.startsWith('/tags/') && params?.id) {
      keys.push([TAGS_QUERY_KEY, params.id])
    }

    return keys
  }

  const deleteBookmarkMutation = useEntityMutation({
    mutationFn: async (id: string) => {
      return await deleteBookmark(id)
    },
    invalidateKeys: keysToInvalidate(),
    successDescription: 'The bookmark has been deleted.',
    errorDescription: 'An error occurred while deleting the bookmark, please try again.',
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  const toggleFavoriteBookmarkMutation = useEntityMutation<
    void,
    { id: string; isFavorite: boolean },
    Bookmark[]
  >({
    mutationFn: async (data) => {
      return await toggleFavoriteBookmark(data.id, data.isFavorite)
    },
    invalidateKeys: keysToInvalidate(),
    errorDescription: 'An error occurred while updating the bookmark, please try again.',
    showSuccessToast: false,
    optimisticUpdate: {
      queryKey: [BOOKMARKS_QUERY_KEY],
      updateFn: (oldData, variables) => {
        if (!oldData) return []

        return oldData.map((bookmark) =>
          bookmark.id === variables.id ? { ...bookmark, isFavorite: variables.isFavorite } : bookmark,
        )
      },
    },
  })

  async function handleDeleteBookmark() {
    await deleteBookmarkMutation.mutateAsync(bookmark.id)
  }

  return (
    <>
      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        action={handleDeleteBookmark}
        variant="destructive"
        actionLabel="Delete"
        title="Delete bookmark?"
        description={
          <div>
            <p>You are about to delete the bookmark:</p>
            <p className="flex items-center">
              "<span className="truncate font-medium">{bookmark.name}</span>"
            </p>
            <p>This action cannot be undone.</p>
          </div>
        }
      />

      <EditBookmarkDialog bookmark={bookmark} open={isEditDialogOpen} onOpenChange={setEditDialogOpen} />

      <BookmarkDetailsDialog
        bookmark={bookmark}
        open={isDetailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                onClick={() => {
                  toggleFavoriteBookmarkMutation.mutate({
                    id: bookmark.id,
                    isFavorite: !bookmark.isFavorite,
                  })
                }}
                size="icon"
                variant="ghost"
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
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
