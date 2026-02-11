'use client'

import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { deleteFolder, type FolderTreeNode } from '@/server-actions/folders'
import { FOLDERS_QUERY_KEY } from '@/tanstack-queries/folders'
import { AlertDialogGeneric } from '../shared/alert-dialog-generic'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '../ui/context-menu'
import { EditFolderDialog } from './dialogs/edit'

interface ActionsProps {
  folder: FolderTreeNode
  trigger?: React.ReactElement
}

export function FolderActionsCtxMenu({ folder, trigger }: ActionsProps) {
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

      <ContextMenu>
        <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>{folder.name}</ContextMenuLabel>
            <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
              <IconEdit />
              Edit
            </ContextMenuItem>
            <ContextMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <IconTrash /> Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
