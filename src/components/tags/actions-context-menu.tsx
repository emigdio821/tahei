import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import type { TagWithBookmarkCount } from '@/db/schema/zod/tags'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { deleteTag } from '@/server-actions/tags'
import { TAGS_QUERY_KEY } from '@/tanstack-queries/tags'
import { AlertDialogGeneric } from '../shared/alert-dialog-generic'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '../ui/context-menu'
import { EditTagDialog } from './dialogs/edit'

interface TagsActionsCtxMenuProps extends React.ComponentProps<typeof ContextMenu> {
  tag: TagWithBookmarkCount
  trigger: React.ReactElement
}

export function TagsActionsCtxMenu({ tag, trigger }: TagsActionsCtxMenuProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteTagMutation = useEntityMutation({
    mutationFn: async (id: string) => {
      return await deleteTag(id)
    },
    invalidateKeys: [TAGS_QUERY_KEY],
    successDescription: 'The tag has been deleted.',
    errorDescription: 'An error occurred while deleting the tag, please try again.',
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  async function handleDeleteTag() {
    await deleteTagMutation.mutateAsync(tag.id)
  }

  return (
    <>
      <AlertDialogGeneric
        variant="destructive"
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        action={handleDeleteTag}
        title="Delete tag?"
        description={
          <div>
            You are about to delete the tag: "<span className="font-medium">{tag.name}</span>". This action
            cannot be undone.
          </div>
        }
      />

      <EditTagDialog tag={tag} open={isEditDialogOpen} onOpenChange={setEditDialogOpen} />

      <ContextMenu>
        <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>{tag.name}</ContextMenuLabel>
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
