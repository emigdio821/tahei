import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LoaderIcon } from '@/components/icons'
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
import { Input } from '@/components/ui/input'
import type { TagWithBookmarkCount } from '@/db/schema/zod/tags'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { type UpdateTagFormData, updateTagSchema } from '@/lib/form-schemas/tags'
import { updateTag } from '@/server-actions/tags'
import { TAGS_QUERY_KEY } from '@/tanstack-queries/tags'

interface EditTagDialogProps extends React.ComponentProps<typeof Dialog> {
  tag: TagWithBookmarkCount
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTagDialog({ open, onOpenChange, tag, ...props }: EditTagDialogProps) {
  const editTagFormId = useId()

  const form = useForm<UpdateTagFormData>({
    resolver: zodResolver(updateTagSchema),
    values: {
      id: tag.id,
      name: tag.name,
    },
  })

  const updateTagMutation = useEntityMutation({
    mutationFn: async (data: UpdateTagFormData) => {
      return await updateTag(data)
    },
    invalidateKeys: [TAGS_QUERY_KEY],
    successTitle: 'Tag updated',
    successDescription: 'The tag has been updated successfully.',
    errorDescription: 'An error occurred while updating the tag, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: UpdateTagFormData) {
    updateTagMutation.mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (updateTagMutation.isPending) return
        onOpenChange(isOpen)
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) form.reset()
      }}
      {...props}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit tag</DialogTitle>
          <DialogDescription>Enter the tag information.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            className="space-y-4"
            id={editTagFormId}
            aria-label="Edit tag form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updateTagMutation.isPending}
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
          <Button type="submit" form={editTagFormId} disabled={updateTagMutation.isPending}>
            {updateTagMutation.isPending && <LoaderIcon />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
