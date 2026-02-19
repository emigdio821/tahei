'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconInfoCircle } from '@tabler/icons-react'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LoaderIcon } from '@/components/icons'
import { FoldersCombobox } from '@/components/shared/dropdowns/folders-combobox'
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
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import type { Bookmark } from '@/db/schema/zod/bookmarks'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { BOOKMARK_NAME_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } from '@/lib/constants'
import { type UpdateBookmarkFormData, updateBookmarkSchema } from '@/lib/form-schemas/bookmarks'
import { updateBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/tanstack-queries/folders'
import { TAGS_QUERY_KEY } from '@/tanstack-queries/tags'

interface EditBookmarkDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  bookmark: Bookmark
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBookmarkDialog({ bookmark, open, onOpenChange, ...props }: EditBookmarkDialogProps) {
  const editBookmarkFormId = useId()

  const form = useForm<UpdateBookmarkFormData>({
    resolver: zodResolver(updateBookmarkSchema),
    values: {
      url: bookmark.url,
      name: bookmark.name,
      description: bookmark.description || '',
      isFavorite: bookmark.isFavorite,
      folderId: bookmark.folderId,
      tags: bookmark.bookmarkTags.map((bt) => bt.tagId) || [],
    },
  })

  function keysToInvalidate(): (string | unknown[])[] {
    const keys: (string | unknown[])[] = [BOOKMARKS_QUERY_KEY]
    const hasTags = bookmark.bookmarkTags && bookmark.bookmarkTags.length > 0
    const bookmarkFolderId = bookmark.folderId
    const formTags = form.getValues('tags') || []
    const formFolder = form.getValues('folderId')

    if (hasTags || formTags.length > 0) {
      keys.push(TAGS_QUERY_KEY)
    }

    if (formFolder !== bookmark.folderId) {
      keys.push(FOLDERS_QUERY_KEY)
    }

    if (bookmarkFolderId) {
      keys.push([FOLDERS_QUERY_KEY, bookmarkFolderId])
    }

    if (formFolder && formFolder !== bookmark.folderId) {
      keys.push([FOLDERS_QUERY_KEY, formFolder])
    }

    return keys
  }

  const updateBookmarkMutation = useEntityMutation({
    mutationFn: async (data: UpdateBookmarkFormData) => {
      return await updateBookmark(bookmark.id, data)
    },
    invalidateKeys: keysToInvalidate(),
    successDescription: 'The bookmark has been updated.',
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
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) form.reset()
      }}
      {...props}
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
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      maxLength={BOOKMARK_NAME_MAX_LENGTH}
                      disabled={updateBookmarkMutation.isPending}
                    />
                    <InputGroupAddon align="inline-end">
                      <Popover>
                        <PopoverTrigger
                          openOnHover
                          render={
                            <Button aria-label="Bookmark name field info" size="icon-xs" variant="ghost" />
                          }
                        >
                          <IconInfoCircle />
                        </PopoverTrigger>
                        <PopoverContent side="top" tooltipStyle>
                          <p>Leave it empty to use the title from the website metadata</p>
                        </PopoverContent>
                      </Popover>
                    </InputGroupAddon>
                  </InputGroup>

                  <FieldDescription>
                    <span className="tabular-nums">
                      {BOOKMARK_NAME_MAX_LENGTH - (field.value?.length ?? 0)}
                    </span>{' '}
                    characters left
                  </FieldDescription>
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
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id={field.name}
                      maxLength={DESCRIPTION_MAX_LENGTH}
                      disabled={updateBookmarkMutation.isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end" className="justify-end p-1">
                      <Popover>
                        <PopoverTrigger
                          openOnHover
                          render={
                            <Button
                              size="icon-xs"
                              variant="ghost"
                              aria-label="Bookmark description field info"
                            />
                          }
                        >
                          <IconInfoCircle />
                        </PopoverTrigger>
                        <PopoverContent side="top" tooltipStyle>
                          <p>Leave it empty to use the description from the website metadata</p>
                        </PopoverContent>
                      </Popover>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    <span className="tabular-nums">
                      {DESCRIPTION_MAX_LENGTH - (field.value?.length ?? 0)}
                    </span>{' '}
                    characters left
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="folderId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Folder</FieldLabel>
                  <FoldersCombobox
                    id={field.name}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

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
