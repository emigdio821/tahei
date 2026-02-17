import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LoaderIcon } from '@/components/icons'
import { TagsMultiCombobox } from '@/components/shared/dropdowns/tags-multi-combobox'
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
import { type UpdateBookmarkTagsFormData, updateBookmarkTagsSchema } from '@/lib/form-schemas/bookmarks'
import { updateBookmarkTagsBatch } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface UpdateBookmarkTagsDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarks: Bookmark[]
}

export function UpdateBookmarkTagsDialog({
  open,
  onOpenChange,
  bookmarks,
  ...props
}: UpdateBookmarkTagsDialogProps) {
  const createBookmarkFormId = useId()
  const queryClient = useQueryClient()

  const form = useForm<UpdateBookmarkTagsFormData>({
    shouldUnregister: true,
    resolver: zodResolver(updateBookmarkTagsSchema),
    defaultValues: {
      tags: [],
    },
  })

  const updateBookmarkTagsMutation = useMutation({
    mutationFn: async (data: UpdateBookmarkTagsFormData) => {
      const bookmarkIds = bookmarks.map((b) => b.id)
      return await updateBookmarkTagsBatch(bookmarkIds, data.tags || [])
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY_KEY] })

      if (failed === 0) {
        toast.success('Success', {
          description: 'Bookmark tags have been updated.',
        })
      } else if (succeeded === 0) {
        toast.error('Error', {
          description: 'Failed to update bookmark tags. Please try again.',
        })
      } else {
        toast.warning('Partial update', {
          description: `${succeeded} updated, ${failed} failed.`,
        })
      }

      if (succeeded > 0) {
        onOpenChange(false)
      }
    },
    onError: (error) => {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'An error occurred while updating bookmark tags.',
      })
    },
  })

  function onSubmit(data: UpdateBookmarkTagsFormData) {
    updateBookmarkTagsMutation.mutate(data)
  }

  function handleOpenChange(open: boolean) {
    if (updateBookmarkTagsMutation.isPending) return
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update bookmark tags</DialogTitle>
          {bookmarks.length > 1 && (
            <DialogDescription>
              You are updating tags for <span className="font-medium">{bookmarks.length}</span> bookmarks.
              Changes will be applied to all selected bookmarks.
            </DialogDescription>
          )}

          {bookmarks.length === 1 && (
            <DialogDescription>
              Updating tags for <span className="font-medium">{bookmarks[0].name}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogPanel>
          <form
            id={createBookmarkFormId}
            className="flex flex-col gap-4"
            aria-label="Update bookmark tags form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                  <TagsMultiCombobox
                    id={field.name}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value || [])
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
          <Button type="submit" form={createBookmarkFormId} disabled={updateBookmarkTagsMutation.isPending}>
            {updateBookmarkTagsMutation.isPending && <LoaderIcon />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
