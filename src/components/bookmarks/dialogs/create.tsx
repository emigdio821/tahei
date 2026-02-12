import { zodResolver } from '@hookform/resolvers/zod'
import type React from 'react'
import { Activity, useId } from 'react'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { useBookmarkCreationContext } from '@/lib/contexts/bookmark-creation'
import { type CreateBookmarkFormData, createBookmarkSchema } from '@/lib/form-schemas/bookmarks'
import { createBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface CreateManualBookmarkDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBookmarkDialog({ open, onOpenChange, ...props }: CreateManualBookmarkDialogProps) {
  const createBookmarkFormId = useId()
  const context = useBookmarkCreationContext()

  const form = useForm<CreateBookmarkFormData>({
    shouldUnregister: true,
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      url: '',
      name: '',
      tags: context.defaultTags ?? [],
      description: '',
      isFavorite: context.defaultIsFavorite ?? false,
      folderId: context.defaultFolderId ?? null,
    },
  })

  const createBookmarkMutation = useEntityMutation({
    mutationFn: async (data: CreateBookmarkFormData) => {
      return await createBookmark(data)
    },
    invalidateKeys: [BOOKMARKS_QUERY_KEY],
    successTitle: 'Bookmark created',
    successDescription: 'The bookmark has been created successfully.',
    errorDescription: 'An error occurred while creating the bookmark, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: CreateBookmarkFormData) {
    createBookmarkMutation.mutate(data)
  }

  function handleOpenChange(open: boolean) {
    if (createBookmarkMutation.isPending) return
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create bookmark</DialogTitle>
          <DialogDescription>Enter the information for the new bookmark.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            id={createBookmarkFormId}
            className="flex flex-col gap-4"
            aria-label="Create bookmark form"
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
                    aria-invalid={fieldState.invalid}
                    disabled={createBookmarkMutation.isPending}
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
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    disabled={createBookmarkMutation.isPending}
                  />
                  <FieldDescription>
                    Leave it empty to use the title from the website metadata.
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
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={createBookmarkMutation.isPending}
                  />
                  <FieldDescription>
                    Leave it empty to use the description from the website metadata.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Activity name="folder-activity" mode={!context.hiddenFields?.folder ? 'visible' : 'hidden'}>
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
            </Activity>

            <Activity name="tags-activity" mode={!context.hiddenFields?.tags ? 'visible' : 'hidden'}>
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
            </Activity>

            <Activity
              name="isFavorite-activity"
              mode={!context.hiddenFields?.isFavorite ? 'visible' : 'hidden'}
            >
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
                        disabled={createBookmarkMutation.isPending}
                        onCheckedChange={(value) => {
                          field.onChange(value)
                        }}
                      />
                    </Label>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </Activity>
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
          <Button type="submit" form={createBookmarkFormId} disabled={createBookmarkMutation.isPending}>
            {createBookmarkMutation.isPending && <LoaderIcon />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
