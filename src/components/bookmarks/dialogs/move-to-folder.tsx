import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoaderIcon } from '@/components/icons'
import { FoldersCombobox } from '@/components/shared/dropdowns/folders-combobox'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { type MoveBookmarksToFolderFormData, moveBookmarksToFolderSchema } from '@/lib/form-schemas/bookmarks'
import { moveBookmarksToFolderBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface MoveBookmarksToFolderDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarks: Bookmark[]
}

export function MoveBookmarksToFolderDialog({
  open,
  onOpenChange,
  bookmarks,
  ...props
}: MoveBookmarksToFolderDialogProps) {
  const moveBookmarksFormId = useId()
  const queryClient = useQueryClient()

  const form = useForm<MoveBookmarksToFolderFormData>({
    shouldUnregister: true,
    resolver: zodResolver(moveBookmarksToFolderSchema),
    defaultValues: {
      folderId: null,
    },
  })

  const moveBookmarksToFolderMutation = useMutation({
    mutationFn: async (data: MoveBookmarksToFolderFormData) => {
      const bookmarkIds = bookmarks.map((b) => b.id)
      return await moveBookmarksToFolderBatch(bookmarkIds, data.folderId)
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Success', {
          description: form.getValues('folderId')
            ? 'Bookmarks have been moved to the selected folder.'
            : 'Bookmarks have been moved to the root folder.',
        })
      } else if (succeeded === 0) {
        toast.error('Error', {
          description: 'Failed to move bookmarks. Please try again.',
        })
      } else {
        toast.warning('Partial update', {
          description: `${succeeded} moved, ${failed} failed.`,
        })
      }

      if (succeeded > 0) {
        onOpenChange(false)
      }
    },
    onError: (error) => {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred while moving bookmarks.',
      })
    },
  })

  function onSubmit(data: MoveBookmarksToFolderFormData) {
    moveBookmarksToFolderMutation.mutate(data)
  }

  function handleOpenChange(open: boolean) {
    if (moveBookmarksToFolderMutation.isPending) return
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move bookmarks to folder</DialogTitle>
          {bookmarks.length > 1 && (
            <DialogDescription>
              You are moving <span className="font-medium">{bookmarks.length}</span> bookmarks. Select a
              folder or choose no folder to move them to the root.
            </DialogDescription>
          )}

          {bookmarks.length === 1 && (
            <DialogDescription>
              Moving <span className="font-medium">{bookmarks[0].name}</span> to a folder
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogPanel>
          <form
            id={moveBookmarksFormId}
            className="flex flex-col gap-4"
            aria-label="Move bookmarks to folder form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="folderId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Folder</FieldLabel>
                  <FoldersCombobox
                    id={field.name}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" type="button">
                Cancel
              </Button>
            }
          />
          <Button type="submit" form={moveBookmarksFormId} disabled={moveBookmarksToFolderMutation.isPending}>
            {moveBookmarksToFolderMutation.isPending && <LoaderIcon />}
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
