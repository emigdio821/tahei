'use client'

import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { deleteFolder, type FolderTreeNode } from '@/server-actions/folders'
import { FOLDERS_QUERY_KEY } from '@/tanstack-queries/folders'
import { AlertDialogGeneric } from '../shared/alert-dialog-generic'
import { Button } from '../ui/button'
import { EditFolderDialog } from './dialogs/edit'

interface ActionsProps {
  folder: FolderTreeNode
  trigger?: React.ReactElement
}

export function FolderActionsDropdown({ folder, trigger }: ActionsProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteFolderMutation = useEntityMutation({
    mutationFn: async (id: string) => {
      return await deleteFolder(id)
    },
    invalidateKeys: [FOLDERS_QUERY_KEY],
    successTitle: 'Folder deleted',
    successDescription: 'The folder has been successfully deleted.',
    errorDescription: 'An error occurred while deleting the folder, please try again.',
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  async function handleDeleteFolder() {
    await deleteFolderMutation.mutateAsync(folder.id)
  }

  return (
    <>
      <AlertDialogGeneric
        variant="destructive"
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        action={handleDeleteFolder}
        title="Delete folder?"
        description={
          <div>
            You are about to delete the folder: "<span className="font-medium">{folder.name}</span>". This
            action cannot be undone.
          </div>
        }
      />

      <EditFolderDialog folder={folder} open={isEditDialogOpen} onOpenChange={setEditDialogOpen} />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            trigger || (
              <Button aria-label="Folder actions" size="icon" variant="ghost">
                <IconDotsVertical className="size-4" />
              </Button>
            )
          }
        />

        <DropdownMenuContent align="end" className="max-w-42">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="wrap-break-word my-1.5 line-clamp-2 py-0">
              {folder.name}
            </DropdownMenuLabel>

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
    </>
  )
}
