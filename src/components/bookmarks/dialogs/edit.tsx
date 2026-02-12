'use client'

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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { type UpdateBookmarkFormData, updateBookmarkSchema } from '@/lib/form-schemas/bookmarks'
import { updateBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface EditBookmarkDialogProps {
  bookmark: Bookmark
  state: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
  }
}

export function EditBookmarkDialog({ bookmark, state }: EditBookmarkDialogProps) {
  const editBookmarkFormId = useId()
  const { isOpen, onOpenChange } = state

  const form = useForm<UpdateBookmarkFormData>({
    resolver: zodResolver(updateBookmarkSchema),
    values: {
      url: bookmark.url,
      name: bookmark.name,
      description: bookmark.description || '',
      isFavorite: bookmark.isFavorite,
      folderId: bookmark.folderId,
    },
  })

  const updateBookmarkMutation = useEntityMutation({
    mutationFn: async (data: UpdateBookmarkFormData) => {
      return await updateBookmark(bookmark.id, data)
    },
    invalidateKeys: [BOOKMARKS_QUERY_KEY],
    successTitle: 'Bookmark updated',
    successDescription: 'The bookmark has been successfully updated.',
    errorDescription: 'An error occurred while updating the bookmark, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: UpdateBookmarkFormData) {
    updateBookmarkMutation.mutate(data)
  }

  function handleOpenChange(open: boolean) {
    if (updateBookmarkMutation.isPending) return
    onOpenChange(open)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) form.reset()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit bookmark</DialogTitle>
          <DialogDescription>Update the bookmark information.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            id={editBookmarkFormId}
            className="flex flex-col gap-4"
            aria-label="Edit bookmark form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    URL <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="url"
                    aria-invalid={fieldState.invalid}
                    disabled={updateBookmarkMutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

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
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    disabled={updateBookmarkMutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={updateBookmarkMutation.isPending}
                    placeholder="Description of the bookmark (optional)"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="isFavorite"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label
                    className="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
                    htmlFor={field.name}
                  >
                    <div className="flex flex-col">
                      <p className="text-sm">Favorite</p>
                      <p className="font-normal text-muted-foreground text-sm">
                        Add this bookmark to the favorites list.
                      </p>
                    </div>
                    <Switch
                      id={field.name}
                      className="ms-auto"
                      checked={field.value}
                      disabled={updateBookmarkMutation.isPending}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                      }}
                    />
                  </Label>
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
          <Button type="submit" form={editBookmarkFormId} disabled={updateBookmarkMutation.isPending}>
            {updateBookmarkMutation.isPending && <LoaderIcon />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
