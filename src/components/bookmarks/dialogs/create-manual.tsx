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
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { type CreateManualBookmarkFormData, createManualBookmarkSchema } from '@/lib/form-schemas/bookmarks'
import { createManualBookmark } from '@/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/tanstack-queries/bookmarks'

interface CreateManualBookmarkDialogProps {
  state: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
  }
}

export function CreateManualBookmarkDialog({ state }: CreateManualBookmarkDialogProps) {
  const createBookmarkFormId = useId()
  const { isOpen, onOpenChange } = state

  const form = useForm<CreateManualBookmarkFormData>({
    shouldUnregister: true,
    resolver: zodResolver(createManualBookmarkSchema),
    defaultValues: {
      url: '',
      name: '',
      description: '',
      isFavorite: false,
      folderId: undefined,
    },
  })

  const createManualBookmarkMutation = useEntityMutation({
    mutationFn: async (data: CreateManualBookmarkFormData) => {
      return await createManualBookmark(data)
    },
    invalidateKeys: [BOOKMARKS_QUERY_KEY],
    successTitle: 'Bookmark created',
    successDescription: 'The bookmark has been created successfully.',
    errorDescription: 'An error occurred while creating the bookmark, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: CreateManualBookmarkFormData) {
    createManualBookmarkMutation.mutate(data)
  }

  function handleOpenChange(open: boolean) {
    if (createManualBookmarkMutation.isPending) return
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bookmark</DialogTitle>
          <DialogDescription>Enter the information for the new bookmark.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            className="space-y-4"
            id={createBookmarkFormId}
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
                    disabled={createManualBookmarkMutation.isPending}
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
                    aria-invalid={fieldState.invalid}
                    disabled={createManualBookmarkMutation.isPending}
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
                    placeholder="Description of the bookmark (optional)"
                    aria-invalid={fieldState.invalid}
                    disabled={createManualBookmarkMutation.isPending}
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
                      disabled={createManualBookmarkMutation.isPending}
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
          <Button type="submit" form={createBookmarkFormId} disabled={createManualBookmarkMutation.isPending}>
            {createManualBookmarkMutation.isPending && <LoaderIcon />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
