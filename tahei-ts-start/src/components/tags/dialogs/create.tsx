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
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants'
import { type CreateTagFormData, createTagSchema } from '@/lib/form-schemas/tags'
import { createTag } from '@/server-actions/tags'
import { TAGS_QUERY_KEY } from '@/tanstack-queries/tags'

interface CreateTagDialogProps extends React.ComponentProps<typeof Dialog> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTagDialog({ open, onOpenChange, ...props }: CreateTagDialogProps) {
  const createTagFormId = useId()

  const form = useForm<CreateTagFormData>({
    shouldUnregister: true,
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
    },
  })

  const createTagMutation = useEntityMutation({
    mutationFn: async (name: string) => {
      return await createTag(name)
    },
    invalidateKeys: [TAGS_QUERY_KEY],
    successDescription: 'The tag has been created.',
    errorDescription: 'An error occurred while creating the tag, please try again.',
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  function onSubmit(data: CreateTagFormData) {
    createTagMutation.mutate(data.name)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (createTagMutation.isPending) return
        onOpenChange(isOpen)
      }}
      {...props}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
          <DialogDescription>Enter the information for the new tag.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <form
            id={createTagFormId}
            className="flex flex-col gap-4"
            aria-label="Create tag form"
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
                    maxLength={TAG_NAME_MAX_LENGTH}
                    aria-invalid={fieldState.invalid}
                    disabled={createTagMutation.isPending}
                  />
                  <FieldDescription>
                    <span className="tabular-nums">{TAG_NAME_MAX_LENGTH - (field.value?.length ?? 0)}</span>{' '}
                    characters left
                  </FieldDescription>
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
          <Button type="submit" form={createTagFormId} disabled={createTagMutation.isPending}>
            {createTagMutation.isPending && <LoaderIcon />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
